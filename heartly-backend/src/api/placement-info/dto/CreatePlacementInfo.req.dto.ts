import { CreateAddressDto } from '@/api/address/dto/create-address.dto';
import { CreateMedicationDto } from '@/api/medication/dto/CreateMedication.req.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { CreateSpecialistDto } from '../../specialist/dto/CreateSpecialist.dto';

export class CreatePlacementInfoDto {
  @ApiPropertyOptional({
    description: 'Client ID associated with the placement info',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId!: string;

  @ApiPropertyOptional({
    description: 'Nickname of the client',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Gender of the client', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Marital status of the client',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  maritalStatus?: string;

  @ApiPropertyOptional({
    description: 'Distinguising marks of the client',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  distinguishingMarks?: string;

  @ApiPropertyOptional({
    description: 'Languages spoken by the client',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  languages?: string;

  @ApiPropertyOptional({
    description: 'Client UCI (Universal Client Identifier)',
  })
  @IsOptional()
  uci?: string;

  @ApiPropertyOptional({ description: 'Client height' })
  @IsOptional()
  height?: string;

  @ApiPropertyOptional({ description: 'Client weight' })
  @IsOptional()
  weight?: string;

  @ApiPropertyOptional({ description: 'Client eye color' })
  @IsOptional()
  eyes?: string;

  @ApiPropertyOptional({ description: 'Client hair color/type' })
  @IsOptional()
  hair?: string;

  @ApiPropertyOptional({ description: 'Client allergies information' })
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({ description: 'Client dietary sensitivities' })
  @IsOptional()
  dietarySensitivities?: string;

  @ApiPropertyOptional({ description: 'Client social security information' })
  @IsOptional()
  socialSecurity?: string;

  @ApiPropertyOptional({ description: 'Client SSI information' })
  @IsOptional()
  ssi?: string;

  @ApiPropertyOptional({ description: 'Client SSI payee information' })
  @IsOptional()
  ssiPayee?: string;

  @ApiPropertyOptional({ description: 'Client SSA information' })
  @IsOptional()
  ssa?: string;

  @ApiPropertyOptional({ description: 'Client SSA payee information' })
  @IsOptional()
  ssaPayee?: string;

  @ApiPropertyOptional({ description: 'Other benefits information' })
  @IsOptional()
  otherBenefits?: string;

  @ApiPropertyOptional({ description: 'Other benefits payee information' })
  @IsOptional()
  otherBenefitsPayee?: string;

  @ApiPropertyOptional({ description: 'Client medical information' })
  @IsOptional()
  medical?: string;

  @ApiPropertyOptional({ description: 'Client medicare information' })
  @IsOptional()
  medicare?: string;

  @ApiPropertyOptional({ description: 'Client other insurance information' })
  @IsOptional()
  otherInsurance?: string;

  @ApiPropertyOptional({
    description: 'Religious preference',
  })
  @IsOptional()
  religiousPreference?: string;

  @ApiPropertyOptional({
    description: 'Religious advisor information',
  })
  @IsOptional()
  religiousPrefAdvisor?: string;

  @ApiPropertyOptional({
    description: 'Religious preference address information',
  })
  @Type(() => CreateAddressDto)
  @IsOptional()
  religiousPrefAddress?: CreateAddressDto;

  @ApiPropertyOptional({
    description: 'Client dangerous propensities information',
  })
  @IsOptional()
  dangerousPropensities?: boolean;

  @ApiPropertyOptional({ description: 'Description of dangerous propensities' })
  @IsOptional()
  dangerousPropensitiesDescription?: string;

  @ApiPropertyOptional({ description: 'Client diagnosis information' })
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({ description: 'Client medical needs information' })
  @IsOptional()
  medicalNeeds?: string;

  @ApiPropertyOptional({
    description: 'Primary physician information',
  })
  @Type(() => CreateSpecialistDto)
  @IsOptional()
  primaryPhysician?: CreateSpecialistDto;

  @ApiPropertyOptional({
    description: 'Dentist information',
  })
  @Type(() => CreateSpecialistDto)
  @IsOptional()
  dentist?: CreateSpecialistDto;

  @ApiPropertyOptional({
    description: 'Client medications',
    type: [CreateMedicationDto],
  })
  @Type(() => CreateMedicationDto)
  @IsOptional()
  medications?: CreateMedicationDto[];

  @ApiPropertyOptional({
    description: 'Client specialists',
    type: [CreateSpecialistDto],
  })
  @Type(() => CreateSpecialistDto)
  @IsOptional()
  specialists?: CreateSpecialistDto[];

  @ApiPropertyOptional({
    description: 'Client communicable conditions information',
  })
  @IsOptional()
  communicableConditions?: string;

  @ApiPropertyOptional({ description: 'Date when client was placed' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfPlacement?: Date;

  @ApiPropertyOptional({ description: 'Facility ID where client is placed' })
  @IsUUID()
  @IsOptional()
  facilityId?: string;

  @ApiPropertyOptional({
    description: 'Burial arrangements for client',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  burialArrangements?: string;

  @ApiPropertyOptional({ description: 'Previous Placement Address' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  previousPlacement?: CreateAddressDto;

  @ApiPropertyOptional({ description: 'Placement agency address ID' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  placementAgency?: CreateAddressDto;

  @ApiPropertyOptional({ description: 'Other agency address ID' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  otherAgency?: CreateAddressDto;

  @ApiPropertyOptional({ description: 'Legal representative address ID' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  legalRep?: CreateAddressDto;

  @ApiPropertyOptional({ description: 'Other representative address ID' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  otherRep?: CreateAddressDto;

  @ApiPropertyOptional({
    description: 'Special instructions for client',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  specialInstructions?: string;

  @ApiPropertyOptional({
    description: 'Visitation restrictions for client',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  visitationRestrictions?: string;

  @ApiPropertyOptional({
    description: 'Persons authorized to take client from home',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  personsAuthorizedClientFromHome?: string;

  @ApiPropertyOptional({
    description: 'Other significant client information',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  otherSignificantInfo?: string;
}
