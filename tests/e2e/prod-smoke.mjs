import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const publicOrigin = 'http://127.0.0.1:3001';

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: process.env,
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}.`));
    });
  });

const stopProcess = async (child) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  child.kill('SIGTERM');

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (child.exitCode !== null || child.signalCode !== null) {
      return;
    }

    await delay(250);
  }

  child.kill('SIGKILL');
};

const waitForUrl = async (url, timeoutMs) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
    } catch {
      // Server is still starting.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}.`);
};

await runCommand('npm', ['run', 'build']);

const server = spawn('npm', ['run', 'start'], {
  env: {
    ...process.env,
    PORT: '3001',
  },
  stdio: 'inherit',
});

try {
  const serverReadyOrFailed = Promise.race([
    waitForUrl(`${publicOrigin}/`, 30_000),
    new Promise((_, reject) => {
      server.once('error', reject);
      server.once('exit', (code) => {
        reject(new Error(`npm run start exited early with code ${code ?? 'unknown'}.`));
      });
    }),
  ]);

  const rootResponse = await serverReadyOrFailed;
  const rootHtml = await rootResponse.text();

  if (!/<div\b[^>]*\bid=['"]root['"]/.test(rootHtml)) {
    throw new Error('Production root response did not return the client app shell.');
  }

  const apiResponse = await fetch(`${publicOrigin}/api/v1/hello`);
  if (!apiResponse.ok) {
    throw new Error(`Expected /api/v1/hello to return 200, got ${apiResponse.status}.`);
  }

  const payload = await apiResponse.json();
  if (payload.message !== 'Hello World from RS Stack') {
    throw new Error('Production hello API returned an unexpected payload.');
  }
} finally {
  await stopProcess(server);
}
