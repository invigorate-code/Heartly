export interface AuditLogEntity {
  id: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: string;
  clientId?: string;
  targetUserId?: string;
  action: string;
  type: string;
  details?: Record<string, any>;
}
