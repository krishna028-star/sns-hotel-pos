'use server';
import { prisma } from '@/lib/db';

export type NotificationType = 'order' | 'payment' | 'inventory' | 'critical' | 'info';

/**
 * Creates a notification for a specific tenant and simulates sending an email/SMS.
 */
export async function sendTenantNotification(tenantId: string, type: NotificationType, message: string) {
  try {
    const notif = await prisma.notification.create({
      data: {
        tenantId,
        type,
        message
      }
    });
    
    // Simulate Email/Webhook payload (Could integrate Resend/Nodemailer here)
    console.log(`[EMAIL DISPATCH] To Tenant: ${tenantId} | Type: ${type} | MSG: ${message}`);
    
    return { ok: true, notification: notif };
  } catch (error: any) {
    console.error('Failed to send tenant notification:', error.message);
    return { ok: false, error: error.message };
  }
}

/**
 * Fetches recent unread notifications for a given user.
 * Resolves to the tenant's notification feed.
 */
export async function fetchUserNotifications(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { ok: false, error: 'User not found' };

    const notifications = await prisma.notification.findMany({
      where: {
        tenantId: user.tenantId,
        // Optional: only fetch last 48 hours for performance, or max 50
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return {
      ok: true,
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type as NotificationType,
        message: n.message,
        read: n.read,
        time: n.createdAt.toISOString()
      }))
    };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

/**
 * Marks specific notification(s) as read.
 */
export async function markNotificationAsRead(userId: string, notifId: string | 'all') {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { ok: false, error: 'User not found' };

    if (notifId === 'all') {
      await prisma.notification.updateMany({
        where: { tenantId: user.tenantId, read: false },
        data: { read: true }
      });
    } else {
      // Must verify the notif actually belongs to user tenant
      const target = await prisma.notification.findUnique({ where: { id: notifId } });
      if (target && target.tenantId === user.tenantId) {
        await prisma.notification.update({
          where: { id: notifId },
          data: { read: true }
        });
      }
    }
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
