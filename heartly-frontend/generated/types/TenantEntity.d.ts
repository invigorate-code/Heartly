export interface TenantEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  ownerId: string;
  owner: UserEntity;
  users: UserEntity[];
  facilities: FacilityEntity[];
}
