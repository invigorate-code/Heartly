import { FORM_TYPE } from '@/constants/form-types.constant';

export interface FormDefinition {
  type: FORM_TYPE;
  requiredFields: string[];
  calculateCompletionPercentage: (data: any) => number;
  isCompleted: (data: any) => boolean;
  excludedContributionFields?: string[];
}
