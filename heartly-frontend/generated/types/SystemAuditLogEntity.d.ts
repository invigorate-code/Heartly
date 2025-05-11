export interface SystemAuditLogEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: string;
  clientId?: string;
  targetUserId?: string;
  targetFacilityId?: string;
  targetTenantId?: string;
  action: string;
  type: string;
  details?: Record<string, any>;
}
