#!/usr/bin/env npx tsx
/**
 * Mock Server for local development without real AI calls.
 *
 * Run with: npm run dev:mock
 * Then use exactly like the real server at http://localhost:8080
 *
 * The mock server proxies to Modern.js dev server for static assets/SSR,
 * but intercepts /api/v1/chat/* endpoints with mock responses.
 */
import * as http from 'node:http';
import { spawn, type ChildProcess } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_PORT = parseInt(process.env.MOCK_PORT ?? '8080', 10);
const MODERN_PORT = parseInt(process.env.MODERN_PORT ?? '8081', 10);
const MOCK_DELAY_MS = parseInt(process.env.MOCK_DELAY_MS ?? '500', 10);

// ─────────────────────────────────────────────────────────────────────────────
// Mock Response Generators
// ─────────────────────────────────────────────────────────────────────────────

type ChatMessage = { role: string; content: string };
type ChatRequest = { messages: ChatMessage[]; model?: string; temperature?: number; max_tokens?: number };

const generateMockCompletion = (request: ChatRequest): Record<string, unknown> => {
  const lastUserMsg = [...request.messages].reverse().find((m) => m.role === 'user');
  const userContent = (lastUserMsg?.content ?? '').toLowerCase();

  let responseContent: string;

  if (userContent.includes('hello') || userContent.includes('hi')) {
    responseContent = "Hello! I'm a mock AI response. The real AI is not connected, but I can help you test the UI flow.";
  } else if (userContent.includes('analyze') || userContent.includes('data')) {
    responseContent = `## Mock Analysis

Based on the data provided:

1. **Pattern detected**: The values show a normalized distribution centered around zero
2. **Range**: From -1.22 to 1.22 (symmetric around origin)
3. **Interpretation**: This appears to be z-score normalized data

*Note: This is a mock response for local development.*`;
  } else if (userContent.includes('code') || userContent.includes('function')) {
    responseContent = `## Mock Code Response

Here's a sample implementation:

\`\`\`typescript
function processData(values: number[]): { mean: number; std: number } {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return { mean, std: Math.sqrt(variance) };
}
\`\`\`

*Note: This is a mock response for local development.*`;
  } else {
    responseContent = `## Mock Response

I received your message: "${lastUserMsg?.content ?? '(empty)'}"

This is a mock response because the server is running in mock mode. To use real AI:
1. Set the \`GROK_KEY\` environment variable
2. Run \`npm run dev\` instead of \`npm run dev:mock\`

*Note: This is a mock response for local development.*`;
  }

  return {
    id: `chatcmpl-mock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: request.model ?? 'mock-model',
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: responseContent },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: Math.floor(Math.random() * 100) + 50,
      completion_tokens: Math.floor(Math.random() * 200) + 100,
      total_tokens: Math.floor(Math.random() * 300) + 150,
    },
  };
};

const generateMockHealth = (): Record<string, unknown> => ({
  status: 'healthy',
  mock: true,
  uptime_ms: process.uptime() * 1000,
  timestamp: new Date().toISOString(),
  version: '1.0.0',
});

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Helpers
// ─────────────────────────────────────────────────────────────────────────────

const parseBody = (req: http.IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

const sendJson = (res: http.ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const proxyRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  targetPort: number,
) => {
  const options: http.RequestOptions = {
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy] Error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  });

  req.pipe(proxyReq);
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock Server
// ─────────────────────────────────────────────────────────────────────────────

const startMockServer = (modernPort: number) => {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${MOCK_PORT}`);
    const path = url.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Intercept API endpoints
    if (path.startsWith('/api/v1/chat/')) {
      const apiPath = path.slice('/api/v1/chat'.length);

      console.log(`[Mock] ${req.method} ${path} -> intercepted`);

      try {
        // Health endpoint
        if (apiPath === '/health' && req.method === 'GET') {
          sendJson(res, 200, generateMockHealth());
          return;
        }

        // Completions endpoint
        if (apiPath === '/completions' && req.method === 'POST') {
          const body = (await parseBody(req)) as ChatRequest;

          // Log the incoming request
          console.log('\n┌─────────────────────────────────────────────────────────────');
          console.log('│ 📥 INCOMING REQUEST');
          console.log('├─────────────────────────────────────────────────────────────');
          console.log('│ Model:', body.model ?? '(default)');
          console.log('│ Temperature:', body.temperature ?? '(default)');
          console.log('│ Max tokens:', body.max_tokens ?? '(default)');
          console.log('│ Messages:');
          for (const msg of body.messages ?? []) {
            const content = msg.content.length > 100 
              ? msg.content.slice(0, 100) + '...' 
              : msg.content;
            console.log(`│   [${msg.role}]: ${content}`);
          }
          console.log('└─────────────────────────────────────────────────────────────\n');

          // Simulate network delay
          if (MOCK_DELAY_MS > 0) {
            await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
          }

          const response = generateMockCompletion(body);

          // Log the outgoing response
          const responseContent = (response.choices as any)?.[0]?.message?.content ?? '';
          const truncatedResponse = responseContent.length > 200 
            ? responseContent.slice(0, 200) + '...' 
            : responseContent;
          console.log('┌─────────────────────────────────────────────────────────────');
          console.log('│ 📤 MOCK RESPONSE');
          console.log('├─────────────────────────────────────────────────────────────');
          console.log('│ ID:', response.id);
          console.log('│ Model:', response.model);
          console.log('│ Content:', truncatedResponse.split('\n').join('\n│          '));
          console.log('└─────────────────────────────────────────────────────────────\n');

          sendJson(res, 200, response);
          return;
        }

        // Unknown API endpoint
        sendJson(res, 404, { error: { message: 'Not found', path: apiPath } });
      } catch (error) {
        console.error('[Mock] Error:', error);
        sendJson(res, 500, { error: { message: String(error) } });
      }
      return;
    }

    // Proxy everything else to Modern.js dev server
    proxyRequest(req, res, modernPort);
  });

  server.listen(MOCK_PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🧪 MOCK DEV SERVER                        ║
╠══════════════════════════════════════════════════════════════╣
║  Mock server:    http://localhost:${String(MOCK_PORT).padEnd(27)}║
║  Modern.js:      http://localhost:${String(modernPort).padEnd(27)}║
║  Mock delay:     ${String(MOCK_DELAY_MS + 'ms').padEnd(43)}║
║                                                              ║
║  Intercepted endpoints:                                      ║
║    GET  /api/v1/chat/health       Mock health check          ║
║    POST /api/v1/chat/completions  Mock AI completions        ║
║                                                              ║
║  All other requests proxied to Modern.js dev server.         ║
║                                                              ║
║  To use real AI: npm run dev (with GROK_KEY set)             ║
╚══════════════════════════════════════════════════════════════╝
`);
  });

  return server;
};

// ─────────────────────────────────────────────────────────────────────────────
// Start Modern.js Dev Server + Mock Server
// ─────────────────────────────────────────────────────────────────────────────

const waitForServer = async (port: number, maxAttempts = 60, delayMs = 500): Promise<void> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          res.resume(); // Consume response to free up memory
          if (res.statusCode && res.statusCode < 500) {
            resolve();
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Server on port ${port} not ready after ${maxAttempts} attempts`);
};

const main = async () => {
  console.log('[Mock] Starting Modern.js dev server on port', MODERN_PORT);

  // Start Modern.js dev server on a different port
  const modernProcess: ChildProcess = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, PORT: String(MODERN_PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  modernProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    // Filter out some noise, show important messages
    if (output.includes('ready') || output.includes('error') || output.includes('Local:')) {
      process.stdout.write(`[Modern.js] ${output}`);
    }
  });

  modernProcess.stderr?.on('data', (data) => {
    process.stderr.write(`[Modern.js] ${data}`);
  });

  modernProcess.on('exit', (code) => {
    console.log(`[Modern.js] Process exited with code ${code}`);
    process.exit(code ?? 1);
  });

  // Handle shutdown
  const shutdown = () => {
    console.log('\n[Mock] Shutting down...');
    modernProcess.kill('SIGTERM');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Wait for Modern.js to be ready
  console.log('[Mock] Waiting for Modern.js dev server to be ready...');
  try {
    await waitForServer(MODERN_PORT);
    console.log('[Mock] Modern.js dev server is ready');
  } catch (error) {
    console.error('[Mock] Failed to start Modern.js dev server:', error);
    modernProcess.kill('SIGTERM');
    process.exit(1);
  }

  // Start mock server
  startMockServer(MODERN_PORT);
};

main().catch((error) => {
  console.error('[Mock] Fatal error:', error);
  process.exit(1);
});
