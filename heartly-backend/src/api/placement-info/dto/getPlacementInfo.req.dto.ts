import { AddressResponseDto } from '@/api/address/dto/getAddress.res.dto';
import { MedicationResponseDto } from '@/api/medication/dto/getMedication.res.dto';
import { SpecialistResponseDto } from '@/api/specialist/dto/getSpecialist.res.dto';
import { MetadataResponseDto } from '@/common/dto/getFormMetadata.res.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlacementInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier for the placement info' })
  id: string;

  @ApiProperty({ description: 'Client information' })
  client: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Facility information' })
  facility: {
    id: string;
    name: string;
  };

  @ApiPropertyOptional({ description: 'Client nickname' })
  nickname?: string;

  @ApiPropertyOptional({ description: 'Gender' })
  gender?: string;

  @ApiPropertyOptional({ description: 'Marital status' })
  maritalStatus?: string;

  @ApiPropertyOptional({ description: 'Date of placement' })
  dateOfPlacement?: Date;

  @ApiPropertyOptional({ description: 'Height' })
  height?: string;

  @ApiPropertyOptional({ description: 'Weight' })
  weight?: string;

  @ApiPropertyOptional({ description: 'Eye color' })
  eyes?: string;

  @ApiPropertyOptional({ description: 'Hair color' })
  hair?: string;

  @ApiPropertyOptional({ description: 'Distinguishing marks' })
  distinguishingMarks?: string;

  @ApiPropertyOptional({ description: 'Allergies' })
  allergies?: string;

  @ApiPropertyOptional({ description: 'Dietary sensitivities' })
  dietarySensitivities?: string;

  @ApiPropertyOptional({ description: 'Diagnosis' })
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Medical needs' })
  medicalNeeds?: string;

  @ApiPropertyOptional({ description: 'Communicable conditions' })
  communicableConditions?: string;

  // Identifiers and benefits
  @ApiPropertyOptional({ description: 'Social security number' })
  socialSecurity?: string;

  @ApiPropertyOptional({ description: 'SSI information' })
  ssi?: string;

  @ApiPropertyOptional({ description: 'SSI payee information' })
  ssiPayee?: string;

  @ApiPropertyOptional({ description: 'Medical insurance information' })
  medical?: string;

  @ApiPropertyOptional({ description: 'Medicare information' })
  medicare?: string;

  @ApiPropertyOptional({ description: 'Other insurance information' })
  otherInsurance?: string;

  // Religious information
  @ApiPropertyOptional({ description: 'Religious preference' })
  religiousPreference?: string;

  @ApiPropertyOptional({ description: 'Religious preference advisor' })
  religiousPrefAdvisor?: string;

  // Care instructions
  @ApiPropertyOptional({ description: 'Special instructions' })
  specialInstructions?: string;

  @ApiPropertyOptional({ description: 'Visitation restrictions' })
  visitationRestrictions?: string;

  @ApiPropertyOptional({
    description: 'Persons authorized to take client from home',
  })
  personsAuthorizedClientFromHome?: string;

  @ApiPropertyOptional({ description: 'Burial arrangements' })
  burialArrangements?: string;

  // Safety information
  @ApiPropertyOptional({
    description: 'Whether client has dangerous propensities',
  })
  dangerousPropensities?: boolean;

  @ApiPropertyOptional({ description: 'Description of dangerous propensities' })
  dangerousPropensitiesDescription?: string;

  // Other important fields
  @ApiPropertyOptional({ description: 'Other significant information' })
  otherSignificantInfo?: string;

  @ApiPropertyOptional({ description: 'Languages spoken' })
  languages?: string;

  // Related entities
  @ApiPropertyOptional({ description: 'Previous placement information' })
  previousPlacement?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Placement agency information' })
  placementAgency?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Other agency information' })
  otherAgency?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Legal representative information' })
  legalRep?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Other representative information' })
  otherRep?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Religious preference address' })
  religiousPrefAddress?: AddressResponseDto;

  @ApiPropertyOptional({ description: 'Primary physician information' })
  primaryPhysician?: SpecialistResponseDto;

  @ApiPropertyOptional({ description: 'Dentist information' })
  dentist?: SpecialistResponseDto;

  @ApiPropertyOptional({ description: 'Other specialists' })
  otherSpecialists?: SpecialistResponseDto[];

  @ApiPropertyOptional({ description: 'Medications' })
  medications?: MedicationResponseDto[];

  // Form metadata
  @ApiProperty({ description: 'Form metadata' })
  metadata: MetadataResponseDto;

  // Form status
  @ApiProperty({ description: 'Completion percentage of the form' })
  completionPercentage: number;

  @ApiProperty({ description: 'Whether the form is completed' })
  isCompleted: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
