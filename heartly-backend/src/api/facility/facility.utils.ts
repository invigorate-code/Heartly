import { Repository } from 'typeorm';
import { FacilityEntity } from './entities/facility.entity';

/**
 * Checks if a facility has any PHI data associated with it
 * This is a placeholder implementation that just checks if projected client count > 0
 * @param facilityId The ID of the facility to check
 * @param facilityRepository The repository used to query facility data
 * @returns {Promise<boolean>} True if PHI exists, false otherwise
 */
export async function facilityHasPHI(
  facilityId: string,
  facilityRepository: Repository<FacilityEntity>,
): Promise<boolean> {
  try {
    const facility = await facilityRepository.findOne({
      where: { id: facilityId },
    });

    if (!facility) {
      return false;
    }

    // Simple check - if the facility has any projected clients, assume it has PHI
    // This is a placeholder implementation that can be expanded later
    if (facility.projectedClientCount > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error checking for PHI in facility ${facilityId}:`, error);
    return true;
  }
}
