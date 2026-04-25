'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

export async function fetchHotels(adminId?: string, tenantId?: string, franchiseId?: string) {
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
    if (franchiseId) whereClause.franchiseId = franchiseId;

    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      include: {
        _count: { select: { tables: true, staff: true, orders: true } },
        tenant: true,
        franchise: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      ok: true,
      hotels: hotels.map(h => ({
        id: h.id,
        name: h.name,
        address: h.address,
        phoneNumber: h.phoneNumber,
        tenant: h.tenant.name,
        tenantId: h.tenantId,
        franchise: h.franchise?.name || null,
        franchiseId: h.franchiseId,
        tables: h._count.tables,
        staff: h._count.staff,
        orders: h._count.orders,
        status: 'active',
        revenue: 0
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbHotel(userId: string, data: {
  name: string; tenantId: string; franchiseId?: string; address?: string; phoneNumber?: string;
}) {
  try {
    const hotel = await prisma.hotel.create({ data });
    await logAction(userId, 'CREATE', 'Hotel', hotel.id, null, hotel);
    return { ok: true, hotel };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateDbHotel(userId: string, id: string, data: any) {
  try {
    const old = await prisma.hotel.findUnique({ where: { id } });
    const hotel = await prisma.hotel.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'Hotel', id, old, hotel);
    return { ok: true, hotel };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteDbHotel(userId: string, id: string) {
  try {
    // Guard: check for active orders
    const activeOrders = await prisma.order.count({
      where: { hotelId: id, status: { notIn: ['paid', 'cancelled'] } }
    });
    if (activeOrders > 0) {
      return { ok: false, error: `Cannot delete: ${activeOrders} active order(s) still open.` };
    }
    const old = await prisma.hotel.findUnique({ where: { id } });
    await prisma.hotel.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'Hotel', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
