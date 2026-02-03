/**
 * OpenAI-compatible Chat Completions proxy.
 * POST /api/v1/chat/completions — forwards to OpenRouter, same request/response format.
 * When API_TOKEN is set, requires Authorization: Bearer <token> (token from client auth/SSO session).
 */

import { useHonoContext } from '@modern-js/plugin-bff/server';

const DEFAULT_MODEL = 'x-ai/grok-4.1-fast';

type RequestOption = { data?: unknown };

function err(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ error: { message, type: 'invalid_request_error', code: 'invalid_request_error' } }),
    { status, headers: { 'Content-Type': 'application/json' } },
  );
}

function authErr(): Response {
  return new Response(
    JSON.stringify({ error: { message: 'Invalid or missing API token', type: 'invalid_api_key', code: 'invalid_api_key' } }),
    { status: 401, headers: { 'Content-Type': 'application/json' } },
  );
}

export const post = async (
  req: RequestOption,
): Promise<Record<string, unknown> | Response> => {
  const body = req.data as Record<string, unknown> | undefined;

  if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return err('Request must include non-empty "messages" array.');
  }

  if (process.env.OPENROUTER_MOCK === '1') {
    return {
      id: 'chatcmpl-mock-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: (body.model as string) ?? DEFAULT_MODEL,
      choices: [{ index: 0, message: { role: 'assistant', content: 'Mocked response.' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 10, completion_tokens: 3, total_tokens: 13 },
    };
  }

  const apiToken = process.env.API_TOKEN;
  if (apiToken) {
    try {
      const ctx = useHonoContext();
      const auth = ctx.req.header('Authorization');
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
      if (token !== apiToken) return authErr();
    } catch {
      return authErr();
    }
  }

  const apiKey = process.env.GROK_KEY;
  if (!apiKey) return err('Missing GROK_KEY.', 500);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (process.env.OPENROUTER_REFERER) headers['HTTP-Referer'] = process.env.OPENROUTER_REFERER;
  if (process.env.OPENROUTER_TITLE) headers['X-Title'] = process.env.OPENROUTER_TITLE;

  const payload = {
    model: body.model ?? DEFAULT_MODEL,
    messages: body.messages,
    ...(body.stream !== undefined && { stream: body.stream }),
    ...(typeof body.temperature === 'number' && { temperature: body.temperature }),
    ...(typeof body.max_tokens === 'number' && { max_tokens: body.max_tokens }),
  };

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    return err(`OpenRouter failed: ${text || res.status}`, res.status >= 400 && res.status < 600 ? res.status : 500);
  }

  return JSON.parse(text) as Record<string, unknown>;
};
