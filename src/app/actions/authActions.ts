'use server';
import { prisma } from '@/lib/db';

async function ensureDefaultTenant() {
  let tenant = await prisma.tenant.findUnique({ where: { name: 'SNS Hotels Group' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'SNS Hotels Group',
        domain: 'sns-hotels.com'
      }
    });
  }
  let hotel = await prisma.hotel.findFirst({ where: { tenantId: tenant.id } });
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        name: 'SNS Beach Resort',
        tenantId: tenant.id
      }
    });
  }
  return { tenant, hotel };
}

export async function fetchUsers() {
  try {
    const { tenant } = await ensureDefaultTenant();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      include: { hotel: true, tenant: true }
    });
    return { ok: true, users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tenant: u.tenant.name,
      hotel: u.hotel?.name || null,
      avatar: u.avatar || 'U',
      password: u.passwordHash // Keep this synced with frontend interface temporarily
    })) };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbUser(userData: any) {
  try {
    const { tenant, hotel } = await ensureDefaultTenant();
    
    // Check dupe
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) return { ok: false, error: 'Email already exists' };

    const roleName = userData.role || 'worker';
    
    const u = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password || 'password123',
        role: roleName,
        avatar: userData.avatar,
        tenantId: tenant.id,
        hotelId: hotel.id
      }
    });
    return { ok: true, user: u };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateDbUserPassword(userId: string, newPass: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPass }
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function deleteDbUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
