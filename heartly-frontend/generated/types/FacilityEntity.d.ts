export interface FacilityEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  projectedClientCount: number;
  roomCount?: number;
  isDeleted: boolean;
  tenantId: string;
  tenant: TenantEntity;
  users: UserEntity[];
}
