import { PHIService } from 'src/phi/phi.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateMedicationDto } from '../medication/dto/CreateMedication.req.dto';
import { CreateSpecialistDto } from '../specialist/dto/CreateSpecialist.dto';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';

/**
 * List of fields required for a placement info form to be considered complete
 */
export const REQUIRED_PLACEMENT_INFO_FIELDS = [
  'clientId',
  'facilityId',
  'nickname',
  'gender',
  'maritalStatus',
  'date_of_placement',
  'height',
  'weight',
  'eyes',
  'hair',
  'allergies',
  'diagnosis',
  'medical_needs',
  'communicable_conditions',
  'religiousPrefAdvisor',
  'special_instructions',
  'visitation_restrictions',
];

/**
 * Calculates the completion percentage of a placement info form
 * @param placementInfo The placement info data
 * @param requiredFields Optional override of fields to consider required
 * @returns Percentage of required fields that are completed (0-100)
 */
export function calculateCompletionPercentage(
  placementInfo: Partial<CreatePlacementInfoDto>,
  requiredFields: string[] = REQUIRED_PLACEMENT_INFO_FIELDS,
): number {
  if (!placementInfo) return 0;

  // Count how many required fields are filled
  let filledCount = 0;
  for (const field of requiredFields) {
    if (
      placementInfo[field] !== undefined &&
      placementInfo[field] !== null &&
      placementInfo[field] !== ''
    ) {
      filledCount++;
    }
  }

  // Calculate percentage
  return Math.round((filledCount / requiredFields.length) * 100);
}

/**
 * Checks if a placement info form is fully completed
 * @param placementInfo The placement info data
 * @param requiredFields Optional override of fields to consider required
 * @returns Boolean indicating if all required fields are completed
 */
export function isPlacementInfoCompleted(
  placementInfo: Partial<CreatePlacementInfoDto>,
  requiredFields: string[] = REQUIRED_PLACEMENT_INFO_FIELDS,
): boolean {
  return calculateCompletionPercentage(placementInfo, requiredFields) === 100;
}

/**
 * Adds tenant ID to address and validates required fields
 */
export const addTenantToAddress = (
  address?: CreateAddressDto,
  tenantId?: string,
): CreateAddressDto | undefined => {
  if (!address || !address.streetAddress || !address.city || !address.zipCode) {
    return undefined;
  }
  return { ...address, tenantId };
};

/**
 * Process a single specialist object
 */
export const processSpecialistObject = (
  specialist: CreateSpecialistDto | undefined,
  tenantId: string,
  phiService: PHIService,
): any | undefined => {
  if (!specialist) return undefined;

  return {
    type: specialist.type ? phiService.encryptToBuffer(specialist.type) : null,
    name: specialist.name ? phiService.encryptToBuffer(specialist.name) : null,
    address: specialist.address
      ? addTenantToAddress(specialist.address, tenantId)
      : undefined,
    tenantId,
  };
};

/**
 * Process an array of specialists
 */
export const processSpecialists = (
  specialists: CreateSpecialistDto[] | undefined,
  tenantId: string,
  phiService: PHIService,
): any[] => {
  if (!specialists || specialists.length === 0) return [];

  return specialists.map((specialist) =>
    processSpecialistObject(specialist, tenantId, phiService),
  );
};

/**
 * Process an array of medications
 */
export const processMedications = (
  medications: CreateMedicationDto[] | undefined,
  tenantId: string,
  phiService: PHIService,
): any[] => {
  if (!medications || medications.length === 0) return [];

  return medications.map((medication) => ({
    name: medication.name ? phiService.encryptToBuffer(medication.name) : null,
    requiredDosage: medication.requiredDosage
      ? phiService.encryptToBuffer(medication.requiredDosage)
      : null,
    timeFrequency: medication.timeFrequency
      ? phiService.encryptToBuffer(medication.timeFrequency)
      : null,
    prescribingMd: medication.prescribingMd
      ? phiService.encryptToBuffer(medication.prescribingMd)
      : null,
    isPrescription: medication.isPrescription,
    filledDate: medication.filledDate,
    refillsRemaining: medication.refillsRemaining,
    isDailyMed: medication.isDailyMed,
    tenantId,
  }));
};
