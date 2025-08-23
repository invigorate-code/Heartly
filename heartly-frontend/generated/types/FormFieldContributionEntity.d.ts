export interface FormFieldContributionEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  fieldName: string;
  formType: string;
  metadata: MetadataEntity;
  contributor?: UserEntity;
}
