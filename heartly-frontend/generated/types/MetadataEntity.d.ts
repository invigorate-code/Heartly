export interface MetadataEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  formType: string;
  entityId: string;
  lastUpdatedBy: UserEntity;
  lastUpdatedAt: Date;
  formFieldContributions: FormFieldContributionEntity[];
  contributors: UserEntity[];
}
