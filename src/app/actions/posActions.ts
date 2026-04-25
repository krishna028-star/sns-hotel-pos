'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

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

    // Auto-create a KOT for the new order
    await prisma.kOT.create({
      data: {
        orderId: order.id,
        itemsJson: JSON.stringify(data.items)
      }
    });

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

    // When order is paid, free the table
    if (status === 'paid' && old.tableId) {
      await prisma.table.update({
        where: { id: old.tableId },
        data: { status: 'free' }
      });
    }

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
        waiter: true,
        kots: true
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

export async function fetchKOTs(hotelId: string) {
  try {
    const kots = await prisma.kOT.findMany({
      where: { order: { hotelId } },
      include: { order: { include: { table: true, items: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return { ok: true, kots };
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
    // FIX: Compute status dynamically since schema has no `status` column
    const itemsWithStatus = items.map(i => ({
      ...i,
      stockQuantity: Number(i.stockQuantity),
      reorderLevel: Number(i.reorderLevel),
      unitCost: Number(i.unitCost),
      status: Number(i.stockQuantity) <= Number(i.reorderLevel)
        ? 'critical'
        : Number(i.stockQuantity) <= Number(i.reorderLevel) * 1.5
        ? 'low'
        : 'ok'
    }));
    return { ok: true, items: itemsWithStatus };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createInventoryItem(userId: string, data: {
  name: string; category: string; stockQuantity: number;
  unit: string; unitCost: number; reorderLevel: number; hotelId: string;
}) {
  try {
    const item = await prisma.inventoryItem.create({ data });
    await logAction(userId, 'CREATE', 'InventoryItem', item.id, null, item);
    return { ok: true, item };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateInventoryItem(userId: string, id: string, data: any) {
  try {
    const old = await prisma.inventoryItem.findUnique({ where: { id } });
    const item = await prisma.inventoryItem.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'InventoryItem', id, old, item);
    return { ok: true, item };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteInventoryItem(userId: string, id: string) {
  try {
    const old = await prisma.inventoryItem.findUnique({ where: { id } });
    await prisma.inventoryItem.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'InventoryItem', id, old, null);
    return { ok: true };
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
      { stock: Number(old.stockQuantity), reason },
      { stock: Number(newItem.stockQuantity) }
    );

    return { ok: true, item: newItem };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── THEFT REPORTS ────────────────────────────────────────────────────────────
export async function fetchTheftReports(hotelId: string) {
  try {
    const reports = await prisma.theftReport.findMany({
      where: { item: { hotelId } },
      include: { item: true },
      orderBy: { createdAt: 'desc' }
    });
    return { ok: true, reports };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createTheftReport(userId: string, data: {
  itemId: string; quantity: number; reason: string; evidenceUrl?: string;
}) {
  try {
    // FIX: TheftReport schema has no hotelId – only itemId, quantity, reason, evidenceUrl
    const report = await prisma.theftReport.create({
      data: {
        itemId: data.itemId,
        quantity: data.quantity,
        reason: data.reason,
        evidenceUrl: data.evidenceUrl
      }
    });
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
      // FIX: Cast Decimal to Number to prevent Prisma serialization issue
      await prisma.inventoryItem.update({
        where: { id: old.itemId },
        data: { stockQuantity: { decrement: Number(old.quantity) } }
      });
    }

    await logAction(userId, 'VERIFY', 'TheftReport', id, { verified: old?.verified }, { verified: report.verified });
    return { ok: true, report };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────
export async function fetchPurchaseOrders(hotelId: string) {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      where: { hotelId },
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });
    return { ok: true, purchaseOrders: pos };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createPurchaseOrder(userId: string, data: {
  supplierId: string; hotelId: string; itemsCount: number; amount: number; notes?: string;
}) {
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

// ─── SUPPLIERS ─────────────────────────────────────────────────────────────
export async function fetchSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    return { ok: true, suppliers };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createSupplier(userId: string, data: {
  name: string; contact?: string; phone?: string; email?: string; categories?: string;
}) {
  try {
    const supplier = await prisma.supplier.create({ data });
    await logAction(userId, 'CREATE', 'Supplier', supplier.id, null, supplier);
    return { ok: true, supplier };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateSupplier(userId: string, id: string, data: any) {
  try {
    const old = await prisma.supplier.findUnique({ where: { id } });
    const supplier = await prisma.supplier.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'Supplier', id, old, supplier);
    return { ok: true, supplier };
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

export async function createBooking(userId: string, data: {
  customerName: string; phoneNumber?: string; tableNum?: string;
  date: Date; time: string; guests: number; hotelId: string; preOrder?: boolean;
}) {
  try {
    const booking = await prisma.booking.create({ data });
    await logAction(userId, 'CREATE', 'Booking', booking.id, null, booking);
    return { ok: true, booking };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateBookingStatus(userId: string, id: string, status: string) {
  try {
    const old = await prisma.booking.findUnique({ where: { id } });
    const booking = await prisma.booking.update({ where: { id }, data: { status } });
    await logAction(userId, 'UPDATE_STATUS', 'Booking', id, { status: old?.status }, { status: booking.status });
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
      data: { status: 'paid', version: { increment: 1 } }
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
    // Close any existing open shift for this user
    await prisma.cashierShift.updateMany({
      where: { userId, status: 'open' },
      data: { status: 'closed', endTime: new Date() }
    });

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

    const difference = Number(endingCash) - Number(old.startingCash);
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

export async function fetchActiveShift(userId: string) {
  try {
    const shift = await prisma.cashierShift.findFirst({
      where: { userId, status: 'open' },
      orderBy: { startTime: 'desc' }
    });
    return { ok: true, shift };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
export async function fetchAuditLogs(limit = 50) {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, role: true, email: true } } }
    });
    return { ok: true, logs };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── ADMIN METRICS ──────────────────────────────────────────────────────────
export async function fetchGlobalMetrics() {
  try {
    const [tenantsCount, usersCount, ordersCount, revenue] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'paid' }
      })
    ]);

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

// ─── FRANCHISES ─────────────────────────────────────────────────────────────
export async function fetchFranchises(adminId?: string, tenantId?: string) {
  try {
    let whereClause: any = {};
    if (adminId) {
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (admin && admin.role !== 'main_admin') {
         whereClause.tenantId = admin.tenantId;
      } else if (tenantId) {
         whereClause.tenantId = tenantId;
      }
    } else if (tenantId) {
       whereClause.tenantId = tenantId;
    }

    const franchises = await prisma.franchise.findMany({
      where: whereClause,
      include: {
        _count: { select: { hotels: true } },
        headUser: { select: { name: true, email: true } },
        tenant: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return {
      ok: true,
      franchises: franchises.map(f => ({
        id: f.id,
        name: f.name,
        tenantId: f.tenantId,
        tenant: f.tenant.name,
        hotels: f._count.hotels,
        head: f.headUser?.name || 'Unassigned',
        headUserId: f.headUserId,
        revenue: Number(f.revenue || 0),
        status: f.status,
        createdAt: f.createdAt
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createFranchise(userId: string, data: { name: string; tenantId: string; headUserId?: string }) {
  try {
    const franchise = await prisma.franchise.create({ data });
    await logAction(userId, 'CREATE', 'Franchise', franchise.id, null, franchise);
    return { ok: true, franchise };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateFranchise(userId: string, id: string, data: any) {
  try {
    const old = await prisma.franchise.findUnique({ where: { id } });
    const franchise = await prisma.franchise.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'Franchise', id, old, franchise);
    return { ok: true, franchise };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteFranchise(userId: string, id: string) {
  try {
    const hotelsUnder = await prisma.hotel.count({ where: { franchiseId: id } });
    if (hotelsUnder > 0) {
      return { ok: false, error: `Cannot delete: ${hotelsUnder} hotel(s) still assigned to this franchise. Reassign them first.` };
    }
    const old = await prisma.franchise.findUnique({ where: { id } });
    await prisma.franchise.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'Franchise', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

// ─── POLICIES ─────────────────────────────────────────────────────────────
export async function fetchPolicies(tenantId: string) {
  try {
    const policies = await prisma.policy.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
    return { ok: true, policies };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function upsertPolicy(userId: string, tenantId: string, name: string, value: string, scope = 'hotel') {
  try {
    const existing = await prisma.policy.findFirst({ where: { tenantId, name } });
    let policy;
    if (existing) {
      policy = await prisma.policy.update({ where: { id: existing.id }, data: { value } });
      await logAction(userId, 'UPDATE', 'Policy', existing.id, { value: existing.value }, { value });
    } else {
      policy = await prisma.policy.create({ data: { tenantId, name, value, scope } });
      await logAction(userId, 'CREATE', 'Policy', policy.id, null, policy);
    }
    return { ok: true, policy };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
