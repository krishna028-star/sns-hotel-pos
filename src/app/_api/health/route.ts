import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();

  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    checks: {
      app: { status: 'ok', message: 'Next.js running' },
      memory: {
        status: 'ok',
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      },
      environment: {
        status: process.env.DATABASE_URL ? 'ok' : 'warning',
        message: process.env.DATABASE_URL
          ? 'Environment variables loaded'
          : 'DATABASE_URL not set — running in demo mode',
      },
    },
    responseTime: `${Date.now() - startTime}ms`,
  };

  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
