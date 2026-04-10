import { NextRequest } from 'next/server';
import { AUDIT_LOGS } from '@/lib/mockData';
import { ok, unauthorized, forbidden, badRequest, verifyDemoToken } from '@/lib/apiHelpers';

// In-memory log store (replace with DB query in production)
const auditStore = [...AUDIT_LOGS];

function getAuth(req: NextRequest) {
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const header = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const token = header || cookie;
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

// GET /api/audit-logs
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  // Only main_admin, main_client, franchise_head, hotel_manager can view audit logs
  const allowedRoles = ['main_admin', 'main_client', 'franchise_head', 'hotel_manager'];
  if (!allowedRoles.includes(auth.role)) {
    return forbidden('Only managers and above can view audit logs');
  }

  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity');
  const action = searchParams.get('action');
  const resource = searchParams.get('resource');
  const userId = searchParams.get('userId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50')));

  let results = [...auditStore];

  if (severity) results = results.filter((l) => l.severity === severity);
  if (action) results = results.filter((l) => l.action.includes(action.toUpperCase()));
  if (resource) results = results.filter((l) => l.resource === resource);
  if (from) results = results.filter((l) => new Date(l.timestamp) >= new Date(from));
  if (to) results = results.filter((l) => new Date(l.timestamp) <= new Date(to));

  // Sort by newest first
  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const total = results.length;
  const page_results = results.slice((page - 1) * limit, page * limit);

  return ok(page_results, { total, page, limit });
}

// POST /api/audit-logs — add a new log entry (admin only)
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();
  if (auth.role !== 'main_admin') return forbidden('Only main_admin can write audit logs directly');

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { action, resource, resourceId, severity = 'info' } = body;
  if (!action || !resource) return badRequest('action and resource are required');

  const entry = {
    id: auditStore.length + 1001,
    timestamp: new Date().toISOString(),
    user: 'API',
    role: auth.role,
    tenant: null,
    action: String(action),
    resource: String(resource),
    resourceId,
    severity: String(severity),
    ip: 'api',
  };

  auditStore.unshift(entry);
  return ok(entry);
}
