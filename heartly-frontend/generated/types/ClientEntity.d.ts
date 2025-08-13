export interface ClientEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  firstName: string;
  lastName: string;
  birthDate: Date;
  uci: string;
  facilityId: string;
  facility: FacilityEntity;
  tenantId: string;
  tenant: TenantEntity;
  isDeleted: boolean;
  photo?: string;
}
