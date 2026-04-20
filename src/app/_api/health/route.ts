import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming this exists or using the default import

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'ok';
  let dbMessage = 'Connected';
  let dbLatency = '0ms';

  try {
    const dbStart = Date.now();
    // Simple ping to check connection
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = `${Date.now() - dbStart}ms`;
  } catch (error: any) {
    dbStatus = 'error';
    dbMessage = error.message;
  }

  const status = {
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    checks: {
      app: { status: 'ok', message: 'Next.js running' },
      database: {
        status: dbStatus,
        message: dbMessage,
        latency: dbLatency
      },
      memory: {
        status: 'ok',
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      }
    },
    responseTime: `${Date.now() - startTime}ms`,
  };

  return NextResponse.json(status, {
    status: dbStatus === 'ok' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
