'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

export async function fetchHotels(tenantId?: string) {
  try {
    const hotels = await prisma.hotel.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        _count: {
          select: { tables: true, staff: true, orders: true }
        },
        tenant: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { 
      ok: true, 
      hotels: hotels.map(h => ({
        id: h.id,
        name: h.name,
        tenant: h.tenant.name,
        tenantId: h.tenantId,
        tables: h._count.tables,
        staff: h._count.staff,
        status: 'active',
        revenue: 0 // Placeholder until real finance tracking
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbHotel(userId: string, data: { name: string; tenantId: string; address?: string; phoneNumber?: string }) {
  try {
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        tenantId: data.tenantId,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }
    });

    await logAction(userId, 'CREATE', 'Hotel', hotel.id, null, hotel);
    return { ok: true, hotel };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
