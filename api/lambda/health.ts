/**
 * Health check endpoint.
 * GET /api/v1/chat/health — returns service status and uptime.
 */

const startTime = Date.now();

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  uptime_ms: number;
  timestamp: string;
  version: string;
}

export const get = async (): Promise<HealthResponse> => {
  return {
    status: 'healthy',
    uptime_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  };
};
