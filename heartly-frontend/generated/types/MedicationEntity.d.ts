export interface MedicationEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  client: ClientEntity;
  name?: Buffer<ArrayBufferLike>;
  requiredDosage?: Buffer<ArrayBufferLike>;
  timeFrequency?: Buffer<ArrayBufferLike>;
  isPrescription?: boolean;
  prescribingMd?: Buffer<ArrayBufferLike>;
  filledDate?: Date;
  refillsRemaining?: number;
  isDailyMed?: boolean;
  tenantId: string;
  placementInfoId?: string;
}
