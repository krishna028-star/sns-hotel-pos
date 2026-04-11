'use server';
import { prisma } from '@/lib/db';

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
        status: 'active' // Adding a default status for UI compatibility
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbTenant(data: { name: string; domain?: string; email?: string }) {
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
    
    return { ok: true, tenant };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
