import { prisma } from './db';

export async function logAction(userId: string, action: string, entity: string, entityId: string, oldData?: any, newData?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
        // Optional: Add IP address if available in server context
      }
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
}
