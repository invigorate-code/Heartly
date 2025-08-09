export interface CustomRoleEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  tenant: TenantEntity;
  tenantId: string;
  createdByUser?: UserEntity;
  createdBy?: string;
  updatedByUser?: UserEntity;
  updatedBy?: string;
}
