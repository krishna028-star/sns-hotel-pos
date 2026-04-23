import { NextRequest } from 'next/server';
import { ACTIVE_ORDERS, PENDING_KOTS } from '@/lib/mockData';
import { ok, created, badRequest, unauthorized, notFound, serverError } from '@/lib/apiHelpers';

// In-memory stores (replace with DB in production)
let orders = [...ACTIVE_ORDERS] as any[];
let kots = [...PENDING_KOTS];
let nextOrderNum = 200;

function getAuth(req: NextRequest) {
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const header = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const token = header || cookie;
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch { return null; }
}

// GET /api/orders
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const tableNum = searchParams.get('table');

  let results = [...orders];
  if (status) results = results.filter(o => o.status === status);
  if (tableNum) results = results.filter(o => o.tableNum === parseInt(tableNum));

  return ok(results, { total: results.length });
}

// POST /api/orders — create new order (worker)
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  const allowedRoles = ['worker', 'hotel_manager', 'main_admin'];
  if (!allowedRoles.includes(auth.role)) {
    return badRequest('Only workers can create orders');
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return badRequest('Invalid JSON body'); }

  const { tableNum, items } = body as { tableNum: number; items: { id: number; name: string; qty: number; price: number }[] };

  if (!tableNum || !Array.isArray(items) || items.length === 0) {
    return badRequest('tableNum and items array are required');
  }

  // Validate items
  for (const item of items) {
    if (!item.name || typeof item.qty !== 'number' || item.qty < 1) {
      return badRequest(`Invalid item: ${JSON.stringify(item)}`);
    }
    if (typeof item.price !== 'number' || item.price <= 0) {
      return badRequest(`Invalid price for item: ${item.name}`);
    }
  }

  const total = items.reduce((acc, i) => acc + i.qty * i.price, 0);
  const orderId = `ORD-${nextOrderNum++}`;

  const newOrder = {
    id: orderId,
    tableNum,
    items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    status: 'pending' as const,
    kotStatus: 'none' as const,
    worker: auth.role,
    total,
    time: new Date().toISOString()
  };

  orders.push(newOrder as any);

  return created({ order: newOrder });
}
