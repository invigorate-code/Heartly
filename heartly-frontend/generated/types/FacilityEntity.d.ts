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
  projected_client_count: number;
  tenant: TenantEntity;
  staff: UserEntity[];
}
