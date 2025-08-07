export interface UserActionAuditLogEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user: UserEntity;
  userId: string;
  client?: ClientEntity;
  clientId?: string;
  targetUser?: UserEntity;
  targetUserId?: string;
  targetFacility: FacilityEntity;
  targetFacilityId: string;
  targetTenant: TenantEntity;
  targetTenantId: string;
  action: string;
  details?: Record<string, any>;
}
