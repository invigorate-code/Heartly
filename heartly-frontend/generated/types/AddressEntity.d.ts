export interface AddressEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name?: string;
  relation?: string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  tenantId?: string;
}
