'use server';
import { prisma } from '@/lib/db';
import { logAction } from '@/lib/audit';

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      include: { hotel: true, tenant: true }
    });
    return {
      ok: true,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.passwordHash, // used for client-side login match
        role: u.role,
        tenant: u.tenant.name,
        hotel: u.hotel?.name || null,
        hotelId: u.hotelId,
        tenantId: u.tenantId,
        avatar: u.avatar || u.name.charAt(0).toUpperCase(),
        staffId: u.staffId || undefined,
        age: u.age || undefined,
        joiningDate: u.joiningDate?.toISOString() || undefined,
        salary: u.salary ? Number(u.salary) : undefined,
        workingDays: u.workingDays || 26,
        presenceThisMonth: u.presenceThisMonth || 0,
        remarks: u.remarks || undefined,
        isActive: u.isActive,
        status: u.isActive ? 'active' : 'suspended'
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function createDbUser(adminId: string, userData: any) {
  try {
    // FIX: Only call ensureDefaultTenant when no tenantId provided
    let tenantId = userData.tenantId;
    let hotelId = userData.hotelId;

    if (!tenantId || !hotelId) {
      const { tenant, hotel } = await ensureDefaultTenant();
      tenantId = tenantId || tenant.id;
      hotelId = hotelId || hotel.id;
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) return { ok: false, error: `Email "${userData.email}" is already registered.` };

    // Check duplicate staffId if provided
    if (userData.staffId) {
      const dupStaffId = await prisma.user.findUnique({ where: { staffId: userData.staffId } });
      if (dupStaffId) return { ok: false, error: `Staff ID "${userData.staffId}" is already in use.` };
    }

    const u = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.password || 'password123',
        role: userData.role || 'worker',
        avatar: userData.avatar || userData.name.charAt(0).toUpperCase(),
        tenantId,
        hotelId,
        staffId: userData.staffId || undefined,
        age: userData.age ? parseInt(userData.age) : undefined,
        joiningDate: userData.joiningDate ? new Date(userData.joiningDate) : new Date(),
        salary: userData.salary ? parseFloat(userData.salary) : undefined,
        workingDays: userData.workingDays ? parseInt(userData.workingDays) : 26,
        remarks: userData.remarks || undefined,
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
    if (!old) return { ok: false, error: 'User not found' };
    // Soft-protect main admin
    if (old.role === 'main_admin') {
      const adminCount = await prisma.user.count({ where: { role: 'main_admin' } });
      if (adminCount <= 1) return { ok: false, error: 'Cannot delete the last main admin.' };
    }
    await prisma.user.delete({ where: { id: userId } });
    await logAction(adminId, 'DELETE', 'User', userId, { name: old.name, email: old.email }, null);
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

export async function updateDbUser(adminId: string, userId: string, data: any) {
  try {
    const old = await prisma.user.findUnique({ where: { id: userId } });
    const u = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        hotelId: data.hotelId,
        staffId: data.staffId,
        age: data.age ? parseInt(data.age) : undefined,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        workingDays: data.workingDays ? parseInt(data.workingDays) : undefined,
        remarks: data.remarks,
        isActive: data.isActive,
      }
    });
    await logAction(adminId, 'UPDATE', 'User', userId, old, u);
    return { ok: true, user: u };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

// ─── INTERNAL HELPER ────────────────────────────────────────────────────────
async function ensureDefaultTenant() {
  let tenant = await prisma.tenant.findFirst({ where: { name: 'SNS Hotels Group' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { name: 'SNS Hotels Group', domain: 'sns-hotels.com', plan: 'enterprise' }
    });
  }
  let hotel = await prisma.hotel.findFirst({ where: { tenantId: tenant.id } });
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: { name: 'SNS Main Hotel', tenantId: tenant.id }
    });
  }
  return { tenant, hotel };
}
