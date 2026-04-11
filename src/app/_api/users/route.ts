import { NextRequest } from 'next/server';
import { DEMO_USERS } from '@/lib/mockData';
import {
  ok, created, badRequest, unauthorized, forbidden, conflict,
  validateEmail, sanitizeString, checkRateLimit, verifyDemoToken
} from '@/lib/apiHelpers';

const ROLE_POWER: Record<string, number> = {
  main_admin: 0,
  main_client: 1,
  franchise_head: 2,
  hotel_manager: 3,
  inventory_manager: 4,
  cashier: 5,
  chef: 6,
  worker: 7,
  customer: 8,
};

const NOTIFY_PARENT: Record<string, string | null> = {
  cashier: 'hotel_manager',
  chef: 'hotel_manager',
  worker: 'hotel_manager',
  inventory_manager: 'hotel_manager',
  hotel_manager: 'franchise_head',
  franchise_head: 'main_client',
  main_client: 'main_admin',
  main_admin: null,
  customer: null,
};

// In-memory user store (replace with DB in production)
const dynamicUsers: any[] = [...DEMO_USERS];
let nextId = DEMO_USERS.length + 1;

function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? '';
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const token = authHeader.replace('Bearer ', '') || cookie;
  if (!token) return null;
  return verifyDemoToken(token);
}

// GET /api/users — list users (filtered by caller's access level)
export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorized();

  const caller = dynamicUsers.find((u) => u.id === auth.userId);
  if (!caller) return unauthorized('User not found');

  const { searchParams } = new URL(req.url);
  const roleFilter = searchParams.get('role');
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

  const callerPower = ROLE_POWER[caller.role] ?? 99;

  let filtered = dynamicUsers.filter((u) => {
    // Can only see users at same level or below
    const userPower = ROLE_POWER[u.role] ?? 99;
    if (caller.role !== 'main_admin' && userPower < callerPower) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search) && !u.email.toLowerCase().includes(search)) return false;
    return true;
  });

  const total = filtered.length;
  const results = filtered.slice((page - 1) * limit, page * limit).map(({ password: _pw, ...safe }) => safe);

  return ok(results, { total, page, limit });
}

// POST /api/users — create user
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return new Response(JSON.stringify({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } }), { status: 429 });
  }

  const auth = getAuthUser(req);
  if (!auth) return unauthorized();

  const caller = dynamicUsers.find((u) => u.id === auth.userId);
  if (!caller) return unauthorized('Caller not found');

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { name, email, role, tenant, hotel, password } = body;

  // Validation
  if (!name || !email || !role) return badRequest('name, email, and role are required');
  if (!validateEmail(email)) return badRequest('Invalid email format');
  if (!ROLE_POWER.hasOwnProperty(role)) return badRequest('Invalid role');
  if (password && password.length < 8) return badRequest('Password must be at least 8 characters');

  // Permission check
  const callerPower = ROLE_POWER[caller.role] ?? 99;
  const targetPower = ROLE_POWER[role] ?? 99;

  if (callerPower >= targetPower) {
    return forbidden('You cannot create a user with equal or higher role');
  }

  // Main admin restriction
  if (role === 'main_admin' && caller.role !== 'main_admin') {
    return forbidden('Only main_admin can create another main_admin');
  }

  // Check duplicate email
  if (dynamicUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return conflict('A user with this email already exists');
  }

  const newUser = {
    id: nextId++,
    name: sanitizeString(name),
    email: sanitizeString(email).toLowerCase(),
    password: password ?? 'TempPass@123',
    role,
    tenant: tenant ?? caller.tenant,
    hotel: hotel ?? null,
    avatar: name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
  };

  dynamicUsers.push(newUser as any);

  // Log alert (in production: save to audit_logs with alert_sent=true)
  const alertTarget = NOTIFY_PARENT[role];
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: 'CREATE_USER',
    resource: 'User',
    resourceId: newUser.id,
    actor: caller.email,
    actorRole: caller.role,
    targetRole: role,
    alertSentTo: alertTarget,
    alertSent: !!alertTarget,
  };

  if (process.env.DEBUG === 'true') {
    console.log('[AUDIT]', JSON.stringify(auditEntry));
  }

  const { password: _pw, ...safeUser } = newUser;
  return created({ user: safeUser, alertSentTo: alertTarget });
}
