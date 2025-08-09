/**
 * Facilities onboarding step validation logic
 * Validates that user has created at least one facility before proceeding
 */

export interface FacilityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
  requiredActions: string[];
  facilitiesCount: number;
  validFacilities: number;
}

/**
 * Validate facilities step for onboarding progression
 */
export const validateFacilitiesStep = async (): Promise<FacilityValidationResult> => {
  try {
    // Call backend API to get user's facilities
    const response = await fetch('/api/getUserAndFacilities', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        isValid: false,
        errors: ['Failed to fetch facilities data'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Check your internet connection and try again'],
        facilitiesCount: 0,
        validFacilities: 0,
      };
    }

    const data = await response.json();
    const facilities = data.facilities || [];
    
    // Validate each facility has required information
    const validFacilities = facilities.filter((facility: any) => {
      return (
        facility.name &&
        facility.name.trim().length > 0 &&
        facility.address &&
        facility.address.trim().length > 0 &&
        facility.city &&
        facility.city.trim().length > 0 &&
        facility.state &&
        facility.state.trim().length > 0 &&
        facility.zip &&
        facility.zip.trim().length > 0 &&
        facility.projected_client_count &&
        facility.projected_client_count > 0
      );
    });

    const errors: string[] = [];
    const warnings: string[] = [];
    const requiredActions: string[] = [];

    // Check if user has at least one facility
    if (facilities.length === 0) {
      errors.push('No facilities have been created');
      requiredActions.push('Create at least one facility to proceed');
    }

    // Check if facilities are valid
    const invalidFacilities = facilities.length - validFacilities.length;
    if (invalidFacilities > 0) {
      if (facilities.length === invalidFacilities) {
        errors.push('All facilities are incomplete');
        requiredActions.push('Complete all facility information (name, address, city, state, zip, client count)');
      } else {
        warnings.push(`${invalidFacilities} ${invalidFacilities === 1 ? 'facility is' : 'facilities are'} incomplete`);
        requiredActions.push('Complete information for all facilities');
      }
    }

    // Healthcare-specific validations
    if (validFacilities.length > 0) {
      const facilitiesWithLowCapacity = validFacilities.filter((facility: any) => 
        facility.projected_client_count < 5
      );
      
      if (facilitiesWithLowCapacity.length > 0) {
        warnings.push(`${facilitiesWithLowCapacity.length} ${facilitiesWithLowCapacity.length === 1 ? 'facility has' : 'facilities have'} low client capacity (< 5)`);
      }

      const facilitiesWithHighCapacity = validFacilities.filter((facility: any) => 
        facility.projected_client_count > 50
      );
      
      if (facilitiesWithHighCapacity.length > 0) {
        warnings.push(`${facilitiesWithHighCapacity.length} ${facilitiesWithHighCapacity.length === 1 ? 'facility has' : 'facilities have'} high client capacity (> 50). Ensure adequate staffing.`);
      }
    }

    const canProceed = validFacilities.length > 0 && errors.length === 0;
    const isValid = canProceed && warnings.length === 0;

    return {
      isValid,
      errors,
      warnings,
      canProceed,
      requiredActions: canProceed ? [] : requiredActions,
      facilitiesCount: facilities.length,
      validFacilities: validFacilities.length,
    };

  } catch (error) {
    console.error('Error validating facilities step:', error);
    
    return {
      isValid: false,
      errors: ['Validation failed due to system error'],
      warnings: [],
      canProceed: false,
      requiredActions: ['Please try again or contact support if the problem persists'],
      facilitiesCount: 0,
      validFacilities: 0,
    };
  }
};