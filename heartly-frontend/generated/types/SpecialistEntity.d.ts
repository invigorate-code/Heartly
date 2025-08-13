export interface SpecialistEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  type?: Buffer<ArrayBufferLike>;
  name?: Buffer<ArrayBufferLike>;
  address?: AddressEntity;
}
