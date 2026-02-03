import { get, type HealthResponse } from './health';

test('returns healthy status with required fields', async () => {
  const result = await get();

  expect(result.status).toBe('healthy');
  expect(typeof result.uptime_ms).toBe('number');
  expect(result.uptime_ms).toBeGreaterThanOrEqual(0);
  expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(result.version).toBeDefined();
});

test('uptime increases over time', async () => {
  const first = await get();
  await new Promise((r) => setTimeout(r, 50));
  const second = await get();

  expect(second.uptime_ms).toBeGreaterThan(first.uptime_ms);
});

test('timestamp is valid ISO string', async () => {
  const result = await get();
  const parsed = new Date(result.timestamp);

  expect(parsed.toISOString()).toBe(result.timestamp);
});
