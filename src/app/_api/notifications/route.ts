import { NextRequest } from 'next/server';
import { ok, unauthorized, badRequest } from '@/lib/apiHelpers';

// In-memory notification store (replace with DB + WebSocket in production)
const notifications: Array<{
  id: number;
  type: string;
  title: string;
  message: string;
  targetRole: string;
  createdBy: string;
  timestamp: string;
  read: boolean;
}> = [
  {
    id: 1, type: 'user_created', title: 'New User Created',
    message: 'Cashier Suresh Menon was created by Hotel Manager Anil Kumar',
    targetRole: 'franchise_head', createdBy: 'hotel_manager',
    timestamp: new Date(Date.now() - 300000).toISOString(), read: false,
  },
  {
    id: 2, type: 'kot_alarm', title: 'KOT Alarm — Table 7',
    message: 'KOT-001 has been pending for 8 minutes. Please accept.',
    targetRole: 'chef', createdBy: 'system',
    timestamp: new Date(Date.now() - 480000).toISOString(), read: false,
  },
  {
    id: 3, type: 'theft_report', title: 'Theft Report Filed',
    message: 'Inventory Manager filed a theft report for 5kg Chicken (₹1,400)',
    targetRole: 'hotel_manager', createdBy: 'inventory_manager',
    timestamp: new Date(Date.now() - 600000).toISOString(), read: false,
  },
  {
    id: 4, type: 'payment_alarm', title: 'Payment Pending — Table 9',
    message: 'Bill of ₹840 requested. Please process payment.',
    targetRole: 'cashier', createdBy: 'system',
    timestamp: new Date(Date.now() - 900000).toISOString(), read: true,
  },
];

let nextNotifId = 5;

function getAuth(req: NextRequest) {
  const cookie = req.cookies.get('sns_session')?.value ?? '';
  const header = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const token = header || cookie;
  if (!token) return null;
  try { return JSON.parse(Buffer.from(token, 'base64').toString('utf-8')); }
  catch { return null; }
}

// GET /api/notifications
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get('unread') === 'true';

  let results = notifications.filter(n => n.targetRole === auth.role);
  if (unreadOnly) results = results.filter(n => !n.read);

  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return ok(results, { total: results.length });
}

// POST /api/notifications — create notification (system/admin only)
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return badRequest('Invalid JSON body'); }

  const { type, title, message, targetRole } = body;
  if (!type || !title || !message || !targetRole) {
    return badRequest('type, title, message, and targetRole are required');
  }

  const notif = {
    id: nextNotifId++,
    type,
    title,
    message,
    targetRole,
    createdBy: auth.role,
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(notif);
  return ok(notif);
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();

  let body: { ids?: number[]; all?: boolean };
  try { body = await req.json(); }
  catch { return badRequest('Invalid JSON body'); }

  let count = 0;
  for (const n of notifications) {
    if (n.targetRole !== auth.role) continue;
    if (body.all || (body.ids && body.ids.includes(n.id))) {
      n.read = true;
      count++;
    }
  }

  return ok({ markedRead: count });
}
