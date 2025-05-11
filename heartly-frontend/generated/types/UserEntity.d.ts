export interface UserEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  company?: string;
  onboarding_completed_at?: Date;
  onboarding_step?: number;
  role: UserRole;
  permissions?: Record<string, boolean>;
  tenantOwned?: TenantEntity;
  tenant: TenantEntity;
  facilities: FacilityEntity[];
}
