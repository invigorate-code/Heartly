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
