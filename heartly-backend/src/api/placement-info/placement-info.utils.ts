import { AddressResponseDto } from '@/api/address/dto/getAddress.res.dto';
import { AddressEntity } from '@/api/address/entities/address.entity';
import { MedicationResponseDto } from '@/api/medication/dto/getMedication.res.dto';
import { SpecialistResponseDto } from '@/api/specialist/dto/getSpecialist.res.dto';
import { MetadataResponseDto } from '@/common/dto/getFormMetadata.res.dto';
import { MetadataEntity } from '@/common/entities/form-metadata.entity';
import { EntityRelationshipRequirement } from '@/common/interfaces/form-definitions.interface';
import { PHIService } from '../../phi/phi.service';
import { CreateAddressDto } from '../address/dto/createAddress.req.dto';
import { CreateMedicationDto } from '../medication/dto/CreateMedication.req.dto';
import { MedicationEntity } from '../medication/entities/medication.entity';
import { CreateSpecialistDto } from '../specialist/dto/createSpecialist.req.dto';
import { SpecialistEntity } from '../specialist/entities/specialist.entity';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { PlacementInfoResponseDto } from './dto/getPlacementInfo.res.dto';
import { PlacementInfoEntity } from './entities/placement-info.entity';

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
 * Process a single specialist object for encryption
 * Converts string fields to Buffer for PHI data
 */
export const processSpecialistObject = (
  specialist: CreateSpecialistDto | undefined,
  tenantId: string,
  phiService: PHIService,
): Record<string, any> | undefined => {
  if (!specialist) return undefined;

  // Process address if it exists
  const processedAddress = specialist.address
    ? addTenantToAddress(specialist.address, tenantId)
    : undefined;

  return {
    type: specialist.type ? phiService.encryptToBuffer(specialist.type) : null,
    name: specialist.name ? phiService.encryptToBuffer(specialist.name) : null,
    tenantId,
    address: processedAddress,
  };
};

/**
 * Process an array of specialists for encryption
 * Converts string fields to Buffer for PHI data
 */
export const processSpecialists = (
  specialists: CreateSpecialistDto[] | undefined,
  tenantId: string,
  phiService: PHIService,
): Record<string, any>[] => {
  if (!specialists || specialists.length === 0) return [];

  return specialists
    .map((specialist) =>
      processSpecialistObject(specialist, tenantId, phiService),
    )
    .filter(Boolean) as Record<string, any>[];
};

/**
 * Process an array of medications for encryption
 * Converts string fields to Buffer for PHI data
 * Links medications to both the client and placement info
 */
/**
 * Processes medication DTOs into entities ready to be saved
 * Encrypts sensitive fields using PHIService and adds necessary metadata like tenantId
 *
 * @param medications The medication DTOs to process
 * @param tenantId The tenant ID to assign to the medications
 * @param phiService The service to handle PHI encryption
 * @param clientId Optional client ID to associate with the medications
 * @param placementInfoId Optional placement info ID to associate with the medications
 * @returns An array of processed medication objects ready to be saved to the database
 */
export const processMedications = (
  medications: CreateMedicationDto[] | undefined,
  tenantId: string,
  phiService: PHIService,
  clientId?: string,
  placementInfoId?: string,
): Record<string, any>[] => {
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
    client: clientId ? { id: clientId } : undefined,
    placementInfoId,
  }));
};

/**
 * Updates an array of medication objects with a placement info ID
 * @param medications Array of medication objects to update
 * @param placementInfoId The ID of the placement info to set
 * @returns The updated medication objects
 */
/**
 * Updates an array of medication objects with a placement info ID
 * This function efficiently adds the placementInfoId to each medication object
 * without creating unnecessary object copies when possible
 *
 * @param medications Array of medication objects to update
 * @param placementInfoId The ID of the placement info to set
 * @returns The updated medication objects
 */
export const updateMedicationsWithPlacementInfoId = (
  medications: Record<string, any>[] | undefined,
  placementInfoId: string,
): Record<string, any>[] => {
  if (!medications || medications.length === 0) return [];

  // Map each medication to include the placementInfoId
  return medications.map((medication) => ({
    ...medication,
    placementInfoId,
  }));
};

export function getPlacementInfoRelations(): string[] {
  return [
    'client',
    'facility',
    'metadata',
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
    // 'medications',
  ];
}

/**
 * Decrypts a PlacementInfoEntity and all its related entities containing PHI data
 *
 * @param placementInfo - The placement info entity with encrypted PHI fields (Buffer type)
 * @param phiService - The PHI service used to decrypt the data
 * @returns The decrypted placement info with all PHI fields as strings
 */
export function decryptPlacementInfoData(
  placementInfo: PlacementInfoEntity,
  phiService: PHIService,
): DecryptedPlacementInfoEntity {
  let decrypted: DecryptedPlacementInfoEntity;

  try {
    decrypted = phiService.decryptPHIFields(
      placementInfo,
      'placementInfo',
    ) as unknown as DecryptedPlacementInfoEntity;
  } catch (error) {
    console.error('Error decrypting placement info fields:', error);
    // Create a fallback with the original entity
    decrypted = { ...placementInfo } as unknown as DecryptedPlacementInfoEntity;
  }

  if (placementInfo.primaryPhysician) {
    try {
      // Decrypt the specialist data
      decrypted.primaryPhysician = phiService.decryptPHIFields(
        placementInfo.primaryPhysician,
        'specialist',
      ) as unknown as DecryptedSpecialistEntity;

      // Preserve the address relationship
      if (placementInfo.primaryPhysician.address) {
        decrypted.primaryPhysician.address =
          placementInfo.primaryPhysician.address;
      }
    } catch (error) {
      console.error('Error decrypting primaryPhysician:', error);
      decrypted.primaryPhysician = {
        ...placementInfo.primaryPhysician,
      } as unknown as DecryptedSpecialistEntity;
    }
  }

  if (placementInfo.dentist) {
    try {
      // Decrypt the dentist data
      decrypted.dentist = phiService.decryptPHIFields(
        placementInfo.dentist,
        'specialist',
      ) as unknown as DecryptedSpecialistEntity;

      // Preserve the address relationship
      if (placementInfo.dentist.address) {
        decrypted.dentist.address = placementInfo.dentist.address;
      }
    } catch (error) {
      console.error('Error decrypting dentist:', error);
      decrypted.dentist = {
        ...placementInfo.dentist,
      } as unknown as DecryptedSpecialistEntity;
    }
  }

  if (placementInfo.otherSpecialists?.length) {
    try {
      decrypted.otherSpecialists = placementInfo.otherSpecialists.map((s) => {
        try {
          // Decrypt the specialist
          const decryptedSpecialist = phiService.decryptPHIFields(
            s,
            'specialist',
          ) as unknown as DecryptedSpecialistEntity;

          // Preserve the address relationship
          if (s.address) {
            decryptedSpecialist.address = s.address;
          }

          return decryptedSpecialist;
        } catch (error) {
          console.error('Error decrypting specialist:', error);
          return { ...s } as unknown as DecryptedSpecialistEntity;
        }
      });
    } catch (error) {
      console.error('Error processing specialists array:', error);
      decrypted.otherSpecialists = [];
    }
  }

  if (placementInfo.medications?.length) {
    try {
      decrypted.medications = placementInfo.medications.map((m) => {
        try {
          return phiService.decryptPHIFields(
            m,
            'medication',
          ) as unknown as DecryptedMedicationEntity;
        } catch (error) {
          console.error('Error decrypting medication:', error);
          return { ...m } as unknown as DecryptedMedicationEntity;
        }
      });
    } catch (error) {
      console.error('Error processing medications array:', error);
      decrypted.medications = [];
    }
  }

  return decrypted;
}

export function mapAddressToDto(
  address: AddressEntity | undefined,
): AddressResponseDto | undefined {
  if (!address) return undefined;

  return {
    id: address.id,
    name: address.name ?? '',
    streetAddress: address.streetAddress ?? '',
    city: address.city ?? '',
    zipCode: address.zipCode ?? '',
    phone: address.phone ?? '',
    relation: address.relation ?? '',
  };
}

/**
 * Type for PlacementInfoEntity with PHI fields decrypted from Buffer to string
 *
 * This preserves the optional/required nature of fields from the original entity
 * but changes the type of PHI fields from Buffer to string
 */
type DecryptedPlacementInfoEntity = Omit<
  PlacementInfoEntity,
  | 'nickname'
  | 'gender'
  | 'maritalStatus'
  | 'height'
  | 'weight'
  | 'eyes'
  | 'hair'
  | 'distinguishingMarks'
  | 'allergies'
  | 'dietarySensitivities'
  | 'diagnosis'
  | 'medicalNeeds'
  | 'communicableConditions'
  | 'socialSecurity'
  | 'ssi'
  | 'ssiPayee'
  | 'medical'
  | 'medicare'
  | 'otherInsurance'
  | 'religiousPreference'
  | 'religiousPrefAdvisor'
  | 'specialInstructions'
  | 'visitationRestrictions'
  | 'personsAuthorizedClientFromHome'
  | 'burialArrangements'
  | 'dangerousPropensitiesDescription'
  | 'otherSignificantInfo'
  | 'languages'
  | 'primaryPhysician'
  | 'dentist'
  | 'otherSpecialists'
  | 'medications'
> & {
  // Using the same optional/required status as in the original entity
  nickname?: string;
  gender?: string;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  hair?: string;
  distinguishingMarks?: string;
  allergies?: string;
  dietarySensitivities?: string;
  diagnosis?: string;
  medicalNeeds?: string;
  communicableConditions?: string;
  socialSecurity?: string;
  ssi?: string;
  ssiPayee?: string;
  medical?: string;
  medicare?: string;
  otherInsurance?: string;
  religiousPreference?: string;
  religiousPrefAdvisor?: string;
  specialInstructions?: string;
  visitationRestrictions?: string;
  personsAuthorizedClientFromHome?: string;
  burialArrangements?: string;
  dangerousPropensitiesDescription?: string;
  otherSignificantInfo?: string;
  languages?: string;
  // Relations
  primaryPhysician?: DecryptedSpecialistEntity;
  dentist?: DecryptedSpecialistEntity;
  otherSpecialists?: DecryptedSpecialistEntity[];
  medications?: DecryptedMedicationEntity[];
};

/**
 * Create decrypted entity types that have string properties instead of Buffer
 * We preserve the optional/nullable nature of the original properties
 */
type DecryptedSpecialistEntity = Omit<SpecialistEntity, 'name' | 'type'> & {
  name?: string;
  type?: string;
  address?: AddressEntity;
};

type DecryptedMedicationEntity = Omit<
  MedicationEntity,
  'name' | 'requiredDosage' | 'timeFrequency' | 'prescribingMd'
> & {
  name?: string;
  requiredDosage?: string;
  timeFrequency?: string;
  prescribingMd?: string;
};

export function mapSpecialistToDto(
  specialist: DecryptedSpecialistEntity | undefined,
): SpecialistResponseDto | undefined {
  if (!specialist) return undefined;
  return {
    id: specialist.id,
    name: specialist.name ?? '',
    type: specialist.type ?? '',
    address: mapAddressToDto(specialist.address),
  };
}

export function mapMedicationToDto(
  medication: DecryptedMedicationEntity | undefined,
): MedicationResponseDto | undefined {
  if (!medication) return undefined;
  return {
    id: medication.id,
    name: medication.name ?? '',
    requiredDosage: medication.requiredDosage ?? '',
    timeFrequency: medication.timeFrequency ?? '',
    prescribingMd: medication.prescribingMd ?? '',
    isPrescription: medication.isPrescription,
    refillsRemaining: medication.refillsRemaining,
    filledDate: medication.filledDate,
  };
}

/**
 * Maps decrypted metadata to a DTO format
 * Handles cases where the metadata entity may not have been properly decrypted
 */
export function mapMetadataToDto(
  metadata: MetadataEntity | undefined,
): MetadataResponseDto | undefined {
  if (!metadata) return undefined;

  // Handle case where the metadata might be the original entity or a decrypted entity
  const formType =
    'formType' in metadata && typeof metadata.formType === 'string'
      ? metadata.formType
      : '';

  return {
    id: metadata.id,
    formType: formType ?? '',
    entityId: metadata.entityId ?? '',
    lastUpdatedBy: metadata.lastUpdatedBy
      ? metadata.lastUpdatedBy.id
      : undefined,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
  };
}

/**
 * Maps a decrypted PlacementInfo entity to a PlacementInfoResponseDto
 * Handles nullable/optional fields by providing empty string defaults for PHI fields
 */
export function mapPlacementInfoToDto(
  decrypted: DecryptedPlacementInfoEntity,
): PlacementInfoResponseDto {
  const dto = new PlacementInfoResponseDto();
  Object.assign(dto, {
    id: decrypted.id,
    // PHI fields are already decrypted to string but might be null/undefined
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
  dto.client = decrypted.client.id as string;
  dto.facility = decrypted.facility.id as string;
  dto.previousPlacement = mapAddressToDto(decrypted.previousPlacement);
  dto.placementAgency = mapAddressToDto(decrypted.placementAgency);
  dto.otherAgency = mapAddressToDto(decrypted.otherAgency);
  dto.legalRep = mapAddressToDto(decrypted.legalRep);
  dto.otherRep = mapAddressToDto(decrypted.otherRep);
  dto.religiousPrefAddress = mapAddressToDto(decrypted.religiousPrefAddress);
  dto.primaryPhysician = mapSpecialistToDto(decrypted.primaryPhysician);
  dto.dentist = mapSpecialistToDto(decrypted.dentist);
  dto.otherSpecialists = (decrypted.otherSpecialists || [])
    .map(mapSpecialistToDto)
    .filter(Boolean) as SpecialistResponseDto[];
  dto.medications = (decrypted.medications || [])
    .map(mapMedicationToDto)
    .filter(Boolean) as MedicationResponseDto[];
  dto.metadata = mapMetadataToDto(decrypted.metadata);
  return dto;
}
