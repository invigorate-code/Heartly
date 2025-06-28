import { AddressResponseDto } from '@/api/address/dto/getAddress.res.dto';
import { AddressEntity } from '@/api/address/entities/address.entity';
import { MedicationResponseDto } from '@/api/medication/dto/getMedication.res.dto';
import { SpecialistResponseDto } from '@/api/specialist/dto/getSpecialist.res.dto';
import { MetadataResponseDto } from '@/common/dto/getFormMetadata.res.dto';
import { EntityRelationshipRequirement } from '@/common/interfaces/form-definitions.interface';
import { PHIService } from 'src/phi/phi.service';
import { CreateAddressDto } from '../address/dto/createAddress.req.dto';
import { CreateMedicationDto } from '../medication/dto/createMedication.req.dto';
import { CreateSpecialistDto } from '../specialist/dto/createSpecialist.req.dto';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { PlacementInfoResponseDto } from './dto/getPlacementInfo.req.dto';
import { PlacementInfoEntity } from './entities/placement-info.entity';

/**
 * List of fields required for a placement info form to be considered complete
 */
/**
 * List of fields required for a placement info form to be considered complete
 */
export const REQUIRED_PLACEMENT_INFO_FIELDS = [
  // Core identifiers
  'clientId',
  'facilityId',

  // Basic demographic info
  'nickname',
  'gender',
  'maritalStatus',
  'dateOfPlacement', // Exact property name from entity

  // Physical characteristics
  'height',
  'weight',
  'eyes',
  'hair',
  'distinguishingMarks',

  // Medical information
  'allergies',
  'dietarySensitivities',
  'diagnosis',
  'medicalNeeds',
  'communicableConditions',

  // Identifiers and benefits
  'socialSecurity',
  'ssi',
  'ssiPayee',
  'medical',
  'medicare',
  'otherInsurance',

  // Religious information
  'religiousPreference',
  'religiousPrefAdvisor',

  // Care instructions
  'specialInstructions',
  'visitationRestrictions',
  'personsAuthorizedClientFromHome',
  'burialArrangements',

  // Safety information
  'dangerousPropensities',
  'dangerousPropensitiesDescription',

  // Other important fields
  'otherSignificantInfo',
  'languages',
];

/**
 * Entity relationship requirements for placement info
 */
export const PLACEMENT_INFO_ENTITY_RELATIONSHIPS: Record<
  string,
  EntityRelationshipRequirement
> = {
  client: {
    required: true,
    requiredFields: ['id'],
    entityType: 'client',
    trackableFields: [],
  },
  facility: {
    required: true,
    requiredFields: ['id'],
    entityType: 'facility',
    trackableFields: [],
  },
  metadata: {
    required: true,
    requiredFields: ['formType', 'lastUpdatedBy'],
    entityType: 'metadata',
    trackableFields: [],
  },
  previousPlacement: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode'],
    entityType: 'address',
    trackableFields: [
      'name',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  placementAgency: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode'],
    entityType: 'address',
    trackableFields: [
      'name',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  otherAgency: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode'],
    entityType: 'address',
    trackableFields: [
      'name',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  legalRep: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode', 'name'],
    entityType: 'address',
    trackableFields: [
      'name',
      'relation',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  otherRep: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode', 'name'],
    entityType: 'address',
    trackableFields: [
      'name',
      'relation',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  religiousPrefAddress: {
    required: false,
    requiredFields: ['streetAddress', 'city', 'zipCode', 'name'],
    entityType: 'address',
    trackableFields: [
      'name',
      'streetAddress',
      'city',
      'state',
      'zipCode',
      'phone',
    ],
  },
  primaryPhysician: {
    required: true, // Important to have a primary physician
    requiredFields: ['name', 'type'],
    entityType: 'specialist',
    trackableFields: ['name', 'type', 'phoneNumber'],
  },
  dentist: {
    required: false,
    requiredFields: ['name'],
    entityType: 'specialist',
    trackableFields: ['name', 'type', 'phoneNumber'],
  },
  otherSpecialists: {
    required: false,
    requiredFields: ['name', 'type'],
    isCollection: true,
    minCount: 0,
    entityType: 'specialist',
    trackableFields: ['name', 'type', 'phoneNumber'],
  },
  medications: {
    required: false,
    requiredFields: ['name', 'requiredDosage'],
    isCollection: true,
    minCount: 0,
    entityType: 'medication',
    trackableFields: [
      'name',
      'requiredDosage',
      'timeFrequency',
      'prescribingMd',
      'isPrescription',
      'refillsRemaining',
      'filledDate',
    ],
  },
};
/**
 * Calculates the completion percentage of a placement info form
 * @param placementInfo The placement info data
 * @param requiredFields Optional override of fields to consider required
 * @param entityRelationships Optional entity relationships to validate
 * @returns Percentage of required fields that are completed (0-100)
 */
export function calculateCompletionPercentage(
  placementInfo: Partial<CreatePlacementInfoDto>,
  requiredFields: string[] = REQUIRED_PLACEMENT_INFO_FIELDS,
  entityRelationships: Record<
    string,
    EntityRelationshipRequirement
  > = PLACEMENT_INFO_ENTITY_RELATIONSHIPS,
): number {
  if (!placementInfo) return 0;

  // Count how many required fields are filled
  let totalRequiredFields = requiredFields.length;
  let filledCount = 0;

  // Check direct fields
  for (const field of requiredFields) {
    if (
      placementInfo[field] !== undefined &&
      placementInfo[field] !== null &&
      placementInfo[field] !== ''
    ) {
      filledCount++;
    }
  }

  // Check required entity relationships
  for (const [relationName, relationship] of Object.entries(
    entityRelationships,
  )) {
    // Skip non-required relationships
    if (!relationship.required) continue;

    const relationData = placementInfo[relationName];

    // If it's a collection, check if it meets the minimum count requirement
    if (relationship.isCollection) {
      const minCount = relationship.minCount || 0;
      if (Array.isArray(relationData) && relationData.length >= minCount) {
        // For collections, we consider it complete if it meets the minimum count
        // Iterate through each item and check required fields
        let validItemCount = 0;
        for (const item of relationData) {
          let allRequiredFieldsPresent = true;
          for (const reqField of relationship.requiredFields) {
            if (
              item[reqField] === undefined ||
              item[reqField] === null ||
              item[reqField] === ''
            ) {
              allRequiredFieldsPresent = false;
              break;
            }
          }
          if (allRequiredFieldsPresent) {
            validItemCount++;
          }
        }

        // If we have enough valid items, mark as complete
        if (validItemCount >= minCount) {
          filledCount++;
        }
      }
      totalRequiredFields++;
    }
    // For non-collection relationships
    else if (relationData) {
      let allRequiredFieldsPresent = true;

      // Check that all required fields in the relation are present
      for (const reqField of relationship.requiredFields) {
        if (
          !relationData[reqField] ||
          relationData[reqField] === undefined ||
          relationData[reqField] === null ||
          relationData[reqField] === ''
        ) {
          allRequiredFieldsPresent = false;
          break;
        }
      }

      if (allRequiredFieldsPresent) {
        filledCount++;
      }
      totalRequiredFields++;
    } else {
      // Relation is required but not present
      totalRequiredFields++;
    }
  }

  // Calculate percentage
  return totalRequiredFields > 0
    ? Math.round((filledCount / totalRequiredFields) * 100)
    : 0;
}

/**
 * Checks if a placement info form is fully completed
 * @param placementInfo The placement info data
 * @param requiredFields Optional override of fields to consider required
 * @param entityRelationships Optional entity relationships to validate
 * @returns Boolean indicating if all required fields are completed
 */
export function isPlacementInfoCompleted(
  placementInfo: Partial<CreatePlacementInfoDto>,
  requiredFields: string[] = REQUIRED_PLACEMENT_INFO_FIELDS,
  entityRelationships: Record<
    string,
    EntityRelationshipRequirement
  > = PLACEMENT_INFO_ENTITY_RELATIONSHIPS,
): boolean {
  return (
    calculateCompletionPercentage(
      placementInfo,
      requiredFields,
      entityRelationships,
    ) === 100
  );
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

// --- Placement Info Decryption and Mapping Utilities ---

export function getPlacementInfoRelations(): string[] {
  return [
    'client',
    'facility',
    'metadata',
    'metadata.lastUpdatedBy',
    'previousPlacement',
    'placementAgency',
    'otherAgency',
    'legalRep',
    'otherRep',
    'religiousPrefAddress',
    'primaryPhysician',
    'primaryPhysician.address',
    'dentist',
    'dentist.address',
    'otherSpecialists',
    'otherSpecialists.address',
    'medications',
  ];
}

export function decryptPlacementInfoData(
  placementInfo: PlacementInfoEntity,
  phiService: PHIService,
): PlacementInfoEntity {
  const decrypted = phiService.decryptPHIFields(placementInfo, 'placementInfo');
  if (placementInfo.primaryPhysician) {
    decrypted.primaryPhysician = phiService.decryptPHIFields(
      placementInfo.primaryPhysician,
      'specialist',
    );
  }
  if (placementInfo.dentist) {
    decrypted.dentist = phiService.decryptPHIFields(
      placementInfo.dentist,
      'specialist',
    );
  }
  if (placementInfo.otherSpecialists?.length) {
    decrypted.otherSpecialists = placementInfo.otherSpecialists.map((s) =>
      phiService.decryptPHIFields(s, 'specialist'),
    );
  }
  if (placementInfo.medications?.length) {
    decrypted.medications = placementInfo.medications.map((m) =>
      phiService.decryptPHIFields(m, 'medication'),
    );
  }
  return decrypted;
}

// Function removed - no longer needed as PHI fields are already decrypted

export function mapAddressToDto(
  address: AddressEntity | undefined,
): AddressResponseDto | undefined {
  if (!address) return undefined;

  // Note: AddressEntity doesn't have a state field, but it's required in the DTO
  return {
    id: address.id,
    name: address.name ?? '',
    streetAddress: address.streetAddress ?? '',
    city: address.city ?? '',
    state: '', // AddressEntity doesn't have state field
    zipCode: address.zipCode ?? '',
    phone: address.phone ?? '',
    relation: address.relation ?? '',
  };
}

export function mapSpecialistToDto(
  specialist: any,
): SpecialistResponseDto | undefined {
  if (!specialist) return undefined;
  return {
    id: specialist.id,
    // PHI fields (name, type) are already decrypted to string by decryptPlacementInfoData
    name: specialist.name ?? '',
    type: specialist.type ?? '',
    address: mapAddressToDto(specialist.address),
  };
}

export function mapMedicationToDto(
  medication: any,
): MedicationResponseDto | undefined {
  if (!medication) return undefined;
  return {
    id: medication.id,
    // PHI fields are already decrypted to string by decryptPlacementInfoData
    name: medication.name ?? '',
    requiredDosage: medication.requiredDosage ?? '',
    timeFrequency: medication.timeFrequency ?? '',
    prescribingMd: medication.prescribingMd ?? '',
    isPrescription: medication.isPrescription,
    refillsRemaining: medication.refillsRemaining,
    filledDate: medication.filledDate,
  };
}

export function mapMetadataToDto(
  metadata: any,
): MetadataResponseDto | undefined {
  if (!metadata) return undefined;
  return {
    id: metadata.id,
    formType: metadata.formType ?? '',
    entityId: metadata.entityId ?? '',
    lastUpdatedBy: metadata.lastUpdatedBy
      ? {
          id: metadata.lastUpdatedBy.id,
          name: metadata.lastUpdatedBy.name ?? '',
        }
      : undefined,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
  };
}

export function mapPlacementInfoToDto(
  decrypted: PlacementInfoEntity,
): PlacementInfoResponseDto {
  const dto = new PlacementInfoResponseDto();
  Object.assign(dto, {
    id: decrypted.id,
    // PHI fields are already decrypted to string
    nickname: decrypted.nickname ?? '',
    gender: decrypted.gender ?? '',
    maritalStatus: decrypted.maritalStatus ?? '',
    dateOfPlacement: decrypted.dateOfPlacement,
    height: decrypted.height ?? '',
    weight: decrypted.weight ?? '',
    eyes: decrypted.eyes ?? '',
    hair: decrypted.hair ?? '',
    distinguishingMarks: decrypted.distinguishingMarks ?? '',
    allergies: decrypted.allergies ?? '',
    dietarySensitivities: decrypted.dietarySensitivities ?? '',
    diagnosis: decrypted.diagnosis ?? '',
    medicalNeeds: decrypted.medicalNeeds ?? '',
    communicableConditions: decrypted.communicableConditions ?? '',
    socialSecurity: decrypted.socialSecurity ?? '',
    ssi: decrypted.ssi ?? '',
    ssiPayee: decrypted.ssiPayee ?? '',
    medical: decrypted.medical ?? '',
    medicare: decrypted.medicare ?? '',
    otherInsurance: decrypted.otherInsurance ?? '',
    religiousPreference: decrypted.religiousPreference ?? '',
    religiousPrefAdvisor: decrypted.religiousPrefAdvisor ?? '',
    specialInstructions: decrypted.specialInstructions ?? '',
    visitationRestrictions: decrypted.visitationRestrictions ?? '',
    personsAuthorizedClientFromHome:
      decrypted.personsAuthorizedClientFromHome ?? '',
    burialArrangements: decrypted.burialArrangements ?? '',
    dangerousPropensities: decrypted.dangerousPropensities,
    dangerousPropensitiesDescription:
      decrypted.dangerousPropensitiesDescription ?? '',
    otherSignificantInfo: decrypted.otherSignificantInfo ?? '',
    languages: decrypted.languages ?? '',
    completionPercentage: decrypted.completionPercentage,
    isCompleted: decrypted.isCompleted,
    createdAt: decrypted.createdAt,
    updatedAt: decrypted.updatedAt,
  });
  if (decrypted.client) {
    dto.client = {
      id: decrypted.client.id,
      // Create full name from firstName and lastName
      name: `${decrypted.client.firstName ?? ''} ${decrypted.client.lastName ?? ''}`.trim(),
    };
  }
  if (decrypted.facility) {
    dto.facility = {
      id: decrypted.facility.id,
      name: decrypted.facility.name ?? '',
    };
  }
  dto.previousPlacement = mapAddressToDto(decrypted.previousPlacement);
  dto.placementAgency = mapAddressToDto(decrypted.placementAgency);
  dto.otherAgency = mapAddressToDto(decrypted.otherAgency);
  dto.legalRep = mapAddressToDto(decrypted.legalRep);
  dto.otherRep = mapAddressToDto(decrypted.otherRep);
  dto.religiousPrefAddress = mapAddressToDto(decrypted.religiousPrefAddress);
  dto.primaryPhysician = mapSpecialistToDto(decrypted.primaryPhysician);
  dto.dentist = mapSpecialistToDto(decrypted.dentist);
  dto.otherSpecialists = (decrypted.otherSpecialists || []).map(
    mapSpecialistToDto,
  );
  dto.medications = (decrypted.medications || []).map(mapMedicationToDto);
  dto.metadata = mapMetadataToDto(decrypted.metadata);
  return dto;
}
