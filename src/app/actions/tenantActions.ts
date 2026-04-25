'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

export async function fetchTenants(adminId?: string) {
  try {
    let whereClause = {};
    if (adminId) {
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (admin && admin.role !== 'main_admin') {
        whereClause = { id: admin.tenantId };
      }
    }

    const tenants = await prisma.tenant.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { hotels: true, users: true } }
      }
    });

    return {
      ok: true,
      tenants: tenants.map(t => ({
        id: t.id,
        customId: t.customId || 'N/A',
        name: t.name,
        domain: t.domain || 'N/A',
        logo: t.logo,
        plan: t.plan || 'basic',
        hotels: t._count.hotels,
        staff: t._count.users,
        created: t.createdAt.toLocaleDateString(),
        status: t.status || 'active'
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbTenant(userId: string, data: { name: string; customId?: string; domain?: string; plan?: string }) {
  try {
    const existing = await prisma.tenant.findFirst({
      where: {
        OR: [
          { name: data.name },
          ...(data.domain ? [{ domain: data.domain }] : [])
        ]
      }
    });

    if (existing) return { ok: false, error: 'Tenant name or domain already exists.' };

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        customId: data.customId || null,
        domain: data.domain || null,
        plan: data.plan || 'basic',
        status: 'active'
      }
    });

    await logAction(userId, 'CREATE', 'Tenant', tenant.id, null, tenant);
    return { ok: true, tenant };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateDbTenant(userId: string, id: string, data: any) {
  try {
    const old = await prisma.tenant.findUnique({ where: { id } });
    const tenant = await prisma.tenant.update({ where: { id }, data });
    await logAction(userId, 'UPDATE', 'Tenant', id, old, tenant);
    return { ok: true, tenant };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function deleteDbTenant(userId: string, id: string) {
  try {
    // FIX: Guard against FK constraint errors
    const hotels = await prisma.hotel.count({ where: { tenantId: id } });
    if (hotels > 0) {
      return { ok: false, error: `Cannot delete: ${hotels} hotel(s) still belong to this tenant. Delete hotels first.` };
    }
    const users = await prisma.user.count({ where: { tenantId: id } });
    if (users > 0) {
      return { ok: false, error: `Cannot delete: ${users} user(s) still belong to this tenant. Remove users first.` };
    }

    const old = await prisma.tenant.findUnique({ where: { id } });
    // Also clean up policies
    await prisma.policy.deleteMany({ where: { tenantId: id } });
    await prisma.franchise.deleteMany({ where: { tenantId: id } });
    await prisma.tenant.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'Tenant', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
