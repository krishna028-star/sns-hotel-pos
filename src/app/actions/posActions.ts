'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

// ─── TABLES ──────────────────────────────────────────────────────────────────
export async function fetchTables(hotelId: string) {
  try {
    const tables = await prisma.table.findMany({
      where: { hotelId },
      orderBy: { number: 'asc' }
    });
    return { ok: true, tables };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createTable(userId: string, data: { number: string; capacity: number; floor?: string; hotelId: string }) {
  try {
    const table = await prisma.table.create({ data });
    await logAction(userId, 'CREATE', 'Table', table.id, null, table);
    return { ok: true, table };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateTable(userId: string, id: string, data: any) {
  try {
    const old = await prisma.table.findUnique({ where: { id } });
    const table = await prisma.table.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'Table', id, old, table);
    return { ok: true, table };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteTable(userId: string, id: string) {
  try {
    const old = await prisma.table.findUnique({ where: { id } });
    await prisma.table.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'Table', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── MENU ITEMS ─────────────────────────────────────────────────────────────
export async function fetchMenuItems(hotelId: string) {
  try {
    const items = await prisma.menuItem.findMany({
      where: { hotelId },
      orderBy: { name: 'asc' }
    });
    return { ok: true, items };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createMenuItem(userId: string, data: any) {
  try {
    const item = await prisma.menuItem.create({ data });
    await logAction(userId, 'CREATE', 'MenuItem', item.id, null, item);
    return { ok: true, item };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateMenuItem(userId: string, id: string, data: any) {
  try {
    const old = await prisma.menuItem.findUnique({ where: { id } });
    const item = await prisma.menuItem.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'MenuItem', id, old, item);
    return { ok: true, item };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteMenuItem(userId: string, id: string) {
  try {
    const old = await prisma.menuItem.findUnique({ where: { id } });
    await prisma.menuItem.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'MenuItem', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export async function createOrder(userId: string, data: {
  hotelId: string;
  tableId?: string;
  customerId?: string;
  waiterId?: string;
  totalAmount: number;
  items: any[];
}) {
  try {
    const order = await prisma.order.create({
      data: {
        hotelId: data.hotelId,
        tableId: data.tableId,
        customerId: data.customerId,
        waiterId: data.waiterId,
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        }
      },
      include: { items: true }
    });
    
    if (data.tableId) {
      await prisma.table.update({
        where: { id: data.tableId },
        data: { status: 'occupied' }
      });
    }

    await logAction(userId, 'CREATE', 'Order', order.id, null, order);
    return { ok: true, order };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateOrderStatus(userId: string, orderId: string, status: any, version: number) {
  try {
    const old = await prisma.order.findUnique({ where: { id: orderId } });
    if (!old) return { ok: false, error: 'Order not found' };
    
    if (old.version !== version) {
       return { ok: false, error: 'Order has been modified by another user. Please refresh.' };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        version: { increment: 1 }
      }
    });

    await logAction(userId, 'UPDATE_STATUS', 'Order', orderId, { status: old.status }, { status: order.status });
    return { ok: true, order };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function fetchOrders(hotelId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { hotelId },
      include: {
        items: true,
        payments: true,
        table: true,
        customer: true,
        waiter: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { ok: true, orders };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── KOTS ───────────────────────────────────────────────────────────────────
export async function createKOT(userId: string, orderId: string, itemsJson: string) {
  try {
    const kot = await prisma.kOT.create({
      data: { orderId, itemsJson }
    });
    await logAction(userId, 'CREATE', 'KOT', kot.id, null, kot);
    return { ok: true, kot };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateKOTStatus(userId: string, id: string, status: any) {
  try {
    const old = await prisma.kOT.findUnique({ where: { id } });
    const kot = await prisma.kOT.update({
      where: { id },
      data: { status }
    });
    await logAction(userId, 'UPDATE_STATUS', 'KOT', id, old, kot);
    return { ok: true, kot };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── INVENTORY ───────────────────────────────────────────────────────────────
export async function fetchInventory(hotelId: string) {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { hotelId },
      orderBy: { name: 'asc' }
    });
    return { ok: true, items };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function adjustStock(userId: string, itemId: string, quantityChange: number, reason: string, version: number) {
  try {
    const old = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!old) return { ok: false, error: 'Item not found' };

    if (old.version !== version) {
      return { ok: false, error: 'Stock has been modified by another user. Please refresh.' };
    }

    const newItem = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        stockQuantity: { increment: quantityChange },
        version: { increment: 1 }
      }
    });

    await logAction(userId, 'ADJUST_STOCK', 'InventoryItem', itemId, 
      { stock: old.stockQuantity, reason }, 
      { stock: newItem.stockQuantity }
    );
    
    return { ok: true, item: newItem };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── THEFT REPORTS ────────────────────────────────────────────────────────────
export async function createTheftReport(userId: string, data: any) {
  try {
    const report = await prisma.theftReport.create({ data });
    await logAction(userId, 'CREATE', 'TheftReport', report.id, null, report);
    return { ok: true, report };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function verifyTheftReport(userId: string, id: string, verified: boolean) {
  try {
    const old = await prisma.theftReport.findUnique({ where: { id }, include: { item: true } });
    const report = await prisma.theftReport.update({
      where: { id },
      data: { verified }
    });
    
    if (verified && old) {
      // Automatically adjust stock upon verification
      await prisma.inventoryItem.update({
        where: { id: old.itemId },
        data: { stockQuantity: { decrement: old.quantity } }
      });
    }

    await logAction(userId, 'VERIFY', 'TheftReport', id, old, report);
    return { ok: true, report };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────
export async function createPurchaseOrder(userId: string, data: any) {
  try {
    const po = await prisma.purchaseOrder.create({ data });
    await logAction(userId, 'CREATE', 'PurchaseOrder', po.id, null, po);
    return { ok: true, po };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updatePurchaseOrderStatus(userId: string, id: string, status: string) {
  try {
    const old = await prisma.purchaseOrder.findUnique({ where: { id } });
    const po = await prisma.purchaseOrder.update({
      where: { id },
      data: { status }
    });
    await logAction(userId, 'UPDATE_STATUS', 'PurchaseOrder', id, old, po);
    return { ok: true, po };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export async function fetchBookings(hotelId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { hotelId },
      orderBy: { date: 'asc' }
    });
    return { ok: true, bookings };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createBooking(userId: string, data: any) {
  try {
    const booking = await prisma.booking.create({ data });
    await logAction(userId, 'CREATE', 'Booking', booking.id, null, booking);
    return { ok: true, booking };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export async function processPayment(userId: string, orderId: string, data: { amount: number; method: any; transactionId?: string }) {
  try {
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: data.amount,
        method: data.method,
        transactionId: data.transactionId,
        status: 'completed'
      }
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid' }
    });

    await logAction(userId, 'PAYMENT', 'Order', orderId, null, payment);
    return { ok: true, payment };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── SHIFTS ─────────────────────────────────────────────────────────────────
export async function startShift(userId: string, startingCash: number) {
  try {
    const shift = await prisma.cashierShift.create({
      data: { userId, startingCash, status: 'open' }
    });
    await logAction(userId, 'START_SHIFT', 'CashierShift', shift.id, null, shift);
    return { ok: true, shift };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function endShift(userId: string, shiftId: string, endingCash: number, notes?: string) {
  try {
    const old = await prisma.cashierShift.findUnique({ where: { id: shiftId } });
    if (!old) return { ok: false, error: 'Shift not found' };
    
    const difference = Number(endingCash) - Number(old.startingCash); // Simplified diff
    const shift = await prisma.cashierShift.update({
      where: { id: shiftId },
      data: { 
        endingCash, 
        difference, 
        notes, 
        status: 'closed',
        endTime: new Date()
      }
    });
    await logAction(userId, 'END_SHIFT', 'CashierShift', shiftId, old, shift);
    return { ok: true, shift };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
export async function fetchAuditLogs(limit = 20) {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    return { ok: true, logs };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── ADMIN METRICS ──────────────────────────────────────────────────────────
export async function fetchGlobalMetrics() {
  try {
    const tenantsCount = await prisma.tenant.count();
    const usersCount = await prisma.user.count();
    const ordersCount = await prisma.order.count();
    const revenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'paid' }
    });
    
    return { 
      ok: true, 
      metrics: {
        tenants: tenantsCount,
        users: usersCount,
        orders: ordersCount,
        totalRevenue: Number(revenue._sum.totalAmount || 0)
      }
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
