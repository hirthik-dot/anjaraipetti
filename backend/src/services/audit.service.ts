import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const createAuditLog = async (
    adminId: string,
    action: string,
    entity: string,
    entityId: string,
    details: Record<string, unknown>
): Promise<void> => {
    await prisma.auditLog.create({
        data: {
            adminId,
            action,
            entity,
            entityId,
            details: details as Prisma.InputJsonValue,
        },
    });
};
