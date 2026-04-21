'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

export async function fetchTenants() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { hotels: true, users: true }
        }
      }
    });
    
    return { 
      ok: true, 
      tenants: tenants.map(t => ({
        id: t.id,
        name: t.name,
        domain: t.domain || 'N/A',
        logo: t.logo,
        hotels: t._count.hotels,
        staff: t._count.users,
        created: t.createdAt.toLocaleDateString(),
        status: 'active'
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbTenant(userId: string, data: { name: string; domain?: string; email?: string }) {
  try {
    const existing = await prisma.tenant.findFirst({
      where: {
        OR: [
          { name: data.name },
          { domain: data.domain || undefined }
        ]
      }
    });
    
    if (existing) return { ok: false, error: 'Tenant name or domain already exists' };

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        domain: data.domain || null,
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
    const old = await prisma.tenant.findUnique({ where: { id } });
    await prisma.tenant.delete({ where: { id } });
    await logAction(userId, 'DELETE', 'Tenant', id, old, null);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
