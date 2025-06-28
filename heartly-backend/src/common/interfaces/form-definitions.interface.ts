import { FORM_TYPE } from '@/constants/form-types.constant';

export interface EntityRelationshipRequirement {
  required: boolean;
  requiredFields: string[];
  isCollection?: boolean;
  minCount?: number;
  trackableFields?: string[];
  entityType: string;
}

export interface FormDefinition {
  type: FORM_TYPE;
  requiredFields: string[];
  calculateCompletionPercentage: (data: any) => number;
  isCompleted: (data: any) => boolean;
  excludedContributionFields?: string[];
  entityRelationships?: Record<string, EntityRelationshipRequirement>;
}
