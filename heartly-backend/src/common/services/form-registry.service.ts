import {
  PLACEMENT_INFO_ENTITY_RELATIONSHIPS,
  REQUIRED_PLACEMENT_INFO_FIELDS,
  calculateCompletionPercentage,
  isPlacementInfoCompleted,
} from '@/api/placement-info/placement-info.utils';
import { FORM_TYPE } from '@/constants/form-types.constant';
import { Injectable } from '@nestjs/common';
import { FormDefinition } from '../interfaces/form-definitions.interface';

@Injectable()
export class FormRegistryService {
  private formDefinitions = new Map<FORM_TYPE, FormDefinition>();

  constructor() {
    this.registerForms();
  }

  private registerForms() {
    this.formDefinitions.set(FORM_TYPE.PLACEMENT_INFO, {
      type: FORM_TYPE.PLACEMENT_INFO,
      requiredFields: REQUIRED_PLACEMENT_INFO_FIELDS,
      calculateCompletionPercentage,
      isCompleted: isPlacementInfoCompleted,
      excludedContributionFields: [
        'clientId',
        'facilityId',
        'tenantId',
        'metadata',
        'contributors',
        'isCompleted',
        'completionPercentage',
      ],
      // Add entity relationships to the form definition
      entityRelationships: PLACEMENT_INFO_ENTITY_RELATIONSHIPS,
    });

    // Register other form types as you build them
  }

  getFormDefinition(formType: FORM_TYPE): FormDefinition | undefined {
    return this.formDefinitions.get(formType);
  }

  calculateCompletion(formType: FORM_TYPE, formData: any): number {
    const definition = this.getFormDefinition(formType);
    return definition ? definition.calculateCompletionPercentage(formData) : 0;
  }

  isFormCompleted(formType: FORM_TYPE, formData: any): boolean {
    const definition = this.getFormDefinition(formType);
    return definition ? definition.isCompleted(formData) : false;
  }
}
