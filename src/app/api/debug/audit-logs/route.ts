import { NextRequest } from 'next/server';
import { AUDIT_LOGS } from '@/lib/mockData';
import { ok, unauthorized, forbidden } from '@/lib/apiHelpers';

// In-memory log store (replace with DB in production)
const auditStore = [...AUDIT_LOGS];
const errorLogs: Array<{
  id: number;
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  userId?: number;
  role?: string;
  path?: string;
  ip?: string;
}> = [];

function getAuth(req: NextRequest) {
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const header = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const token = header || cookie;
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch { return null; }
}

// GET /api/debug/audit-logs
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'main_admin') return forbidden('Only main_admin can access debug audit logs');

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'audit';
  const limit = Math.min(500, parseInt(searchParams.get('limit') ?? '100'));

  if (type === 'errors') {
    const results = errorLogs.slice(0, limit);
    return ok({
      type: 'error_logs',
      count: results.length,
      logs: results,
    });
  }

  // Audit logs with full debug info
  const results = [...auditStore]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return ok({
    type: 'audit_logs',
    count: results.length,
    environment: process.env.NODE_ENV,
    debugMode: process.env.DEBUG === 'true',
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    logs: results,
  });
}

// POST /api/debug/audit-logs — log an error (internal use)
export async function POST(req: NextRequest) {
  // This endpoint is for internal server-side use only
  const internalKey = req.headers.get('x-internal-key');
  if (internalKey !== process.env.INTERNAL_API_KEY && process.env.NODE_ENV === 'production') {
    return unauthorized('Internal endpoint');
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return ok({ logged: false, reason: 'invalid body' }); }

  const entry = {
    id: errorLogs.length + 1,
    timestamp: new Date().toISOString(),
    level: (body.level as 'error' | 'warn' | 'info') ?? 'error',
    message: String(body.message ?? 'Unknown error'),
    stack: body.stack ? String(body.stack) : undefined,
    userId: body.userId ? Number(body.userId) : undefined,
    role: body.role ? String(body.role) : undefined,
    path: body.path ? String(body.path) : undefined,
    ip: body.ip ? String(body.ip) : undefined,
  };

  errorLogs.unshift(entry);

  // Keep only last 500 entries in memory
  if (errorLogs.length > 500) errorLogs.splice(500);

  return ok({ logged: true, id: entry.id });
}
