'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

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
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      include: { hotel: true, tenant: true }
    });
    return { ok: true, users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.passwordHash,
      role: u.role,
      tenant: u.tenant.name,
      hotel: u.hotel?.name || null,
      hotelId: u.hotelId,
      avatar: u.avatar || 'U',
      staffId: u.staffId || undefined,
      joiningDate: u.joiningDate?.toISOString() || undefined,
      status: u.isActive ? 'active' : 'suspended'
    })) };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbUser(adminId: string, userData: any) {
  try {
    const { tenant, hotel } = await ensureDefaultTenant();
    
    // Check dupe
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) return { ok: false, error: 'Email already exists' };

    const u = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password || 'password123',
        role: userData.role || 'worker',
        avatar: userData.avatar,
        tenantId: userData.tenantId || tenant.id,
        hotelId: userData.hotelId || hotel.id,
        staffId: userData.staffId,
        age: userData.age ? parseInt(userData.age) : undefined,
        joiningDate: userData.joiningDate ? new Date(userData.joiningDate) : new Date(),
        salary: userData.salary ? parseFloat(userData.salary) : undefined,
        remarks: userData.remarks,
      }
    });

    await logAction(adminId, 'CREATE', 'User', u.id, null, { name: u.name, email: u.email, role: u.role });
    return { ok: true, user: u };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateDbUserPassword(adminId: string, userId: string, newPass: string) {
  try {
    const old = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPass }
    });
    await logAction(adminId, 'CHANGE_PASSWORD', 'User', userId, null, { message: 'Password updated' });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function deleteDbUser(adminId: string, userId: string) {
  try {
    const old = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.user.delete({ where: { id: userId } });
    await logAction(adminId, 'DELETE', 'User', userId, { name: old?.name, email: old?.email }, null);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function toggleUserStatus(adminId: string, userId: string, isActive: boolean) {
  try {
    const old = await prisma.user.findUnique({ where: { id: userId } });
    const u = await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
    await logAction(adminId, 'TOGGLE_STATUS', 'User', userId, { isActive: old?.isActive }, { isActive: u.isActive });
    return { ok: true, user: u };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
