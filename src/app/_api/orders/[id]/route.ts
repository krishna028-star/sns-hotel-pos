import { NextRequest } from 'next/server';
import { ACTIVE_ORDERS } from '@/lib/mockData';
import { ok, badRequest, unauthorized, notFound, forbidden } from '@/lib/apiHelpers';

let orders = [...ACTIVE_ORDERS] as any[];

type OrderStatus = 'pending' | 'kot_sent' | 'cooking' | 'ready' | 'served' | 'bill_requested' | 'paid' | 'cancelled';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['kot_sent', 'cancelled'],
  kot_sent: ['cooking', 'cancelled'],
  cooking: ['ready', 'cancelled'],
  ready: ['served'],
  served: ['bill_requested'],
  bill_requested: ['paid'],
  paid: [], cancelled: [],
};

// Role → allowed status transitions
const ROLE_TRANSITIONS: Record<string, string[]> = {
  worker: ['kot_sent', 'served', 'cancelled'],
  chef: ['cooking', 'ready'],
  cashier: ['paid'],
  hotel_manager: ['cancelled', 'paid', 'kot_sent'],
  main_admin: Object.values(VALID_TRANSITIONS).flat(),
};

function getAuth(req: NextRequest) {
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const header = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const token = header || cookie;
  if (!token) return null;
  try { return JSON.parse(Buffer.from(token, 'base64').toString('utf-8')); }
  catch { return null; }
}

// PATCH /api/orders/[id] — update order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  const order = orders.find(o => o.id === id);
  if (!order) return notFound('Order');

  let body: { status?: string };
  try { body = await req.json(); }
  catch { return badRequest('Invalid JSON body'); }

  const { status: newStatus } = body;
  if (!newStatus) return badRequest('status is required');

  // Validate transition
  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return badRequest(`Cannot transition from ${order.status} to ${newStatus}`);
  }

  // Role permission check
  const roleAllowed = ROLE_TRANSITIONS[auth.role] ?? [];
  if (!roleAllowed.includes(newStatus) && auth.role !== 'main_admin') {
    return forbidden(`Your role (${auth.role}) cannot set status to ${newStatus}`);
  }

  // Update KOT status
  let kotStatus = order.kotStatus;
  if (newStatus === 'kot_sent') kotStatus = 'pending';
  else if (newStatus === 'cooking') kotStatus = 'cooking';
  else if (newStatus === 'ready') kotStatus = 'ready';
  else if (newStatus === 'served') kotStatus = 'served';

  const updated = { ...order, status: newStatus, kotStatus };
  orders = orders.map(o => o.id === id ? updated : o);

  return ok(updated);
}

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  const order = orders.find(o => o.id === id);
  if (!order) return notFound('Order');

  return ok(order);
}
