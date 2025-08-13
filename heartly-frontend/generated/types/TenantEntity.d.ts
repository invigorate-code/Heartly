export interface TenantEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  users?: UserEntity[];
  facilities?: FacilityEntity[];
}
