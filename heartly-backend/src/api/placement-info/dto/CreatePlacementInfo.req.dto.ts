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
  distinguisingMarks?: string;

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
  uci?: Buffer;

  @ApiPropertyOptional({ description: 'Client height' })
  @IsOptional()
  height?: Buffer;

  @ApiPropertyOptional({ description: 'Client weight' })
  @IsOptional()
  weight?: Buffer;

  @ApiPropertyOptional({ description: 'Client eye color' })
  @IsOptional()
  eyes?: Buffer;

  @ApiPropertyOptional({ description: 'Client hair color/type' })
  @IsOptional()
  hair?: Buffer;

  @ApiPropertyOptional({ description: 'Client allergies information' })
  @IsOptional()
  allergies?: Buffer;

  @ApiPropertyOptional({ description: 'Client dietary sensitivities' })
  @IsOptional()
  dietarySensitivities?: Buffer;

  @ApiPropertyOptional({ description: 'Client social security information' })
  @IsOptional()
  socialSecurity?: Buffer;

  @ApiPropertyOptional({ description: 'Client SSI information' })
  @IsOptional()
  ssi?: Buffer;

  @ApiPropertyOptional({ description: 'Client SSI payee information' })
  @IsOptional()
  ssiPayee?: Buffer;

  @ApiPropertyOptional({ description: 'Client SSA information' })
  @IsOptional()
  ssa?: Buffer;

  @ApiPropertyOptional({ description: 'Client SSA payee information' })
  @IsOptional()
  ssaPayee?: Buffer;

  @ApiPropertyOptional({ description: 'Other benefits information' })
  @IsOptional()
  otherBenefits?: Buffer;

  @ApiPropertyOptional({ description: 'Other benefits payee information' })
  @IsOptional()
  otherBenefitsPayee?: Buffer;

  @ApiPropertyOptional({ description: 'Client medical information' })
  @IsOptional()
  medical?: Buffer;

  @ApiPropertyOptional({ description: 'Client medicare information' })
  @IsOptional()
  medicare?: Buffer;

  @ApiPropertyOptional({ description: 'Client other insurance information' })
  @IsOptional()
  otherInsurance?: Buffer;

  @ApiPropertyOptional({
    description: 'Religious preference and advisor information',
  })
  @IsOptional()
  religiousPrefAdvisor?: Buffer;

  @ApiPropertyOptional({
    description: 'Religious preference address information',
  })
  @IsOptional()
  religiouPrefAddress?: Buffer;

  @ApiPropertyOptional({
    description: 'Client dangerous propensities information',
  })
  @IsOptional()
  dangerouPropensities?: Buffer;

  @ApiPropertyOptional({ description: 'Description of dangerous propensities' })
  @IsOptional()
  dangerouPropensitiesDescription?: Buffer;

  @ApiPropertyOptional({ description: 'Client diagnosis information' })
  @IsOptional()
  diagnosis?: Buffer;

  @ApiPropertyOptional({ description: 'Client medical needs information' })
  @IsOptional()
  medicalNeeds?: Buffer;

  @ApiPropertyOptional({
    description: 'Client communicable conditions information',
  })
  @IsOptional()
  communicableConditions?: Buffer;

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

  @ApiPropertyOptional({ description: 'Previous placement facility ID' })
  @IsUUID()
  @IsOptional()
  previousPlacementId?: string;

  @ApiPropertyOptional({ description: 'Placement agency address ID' })
  @IsUUID()
  @IsOptional()
  placementAgencyId?: string;

  @ApiPropertyOptional({ description: 'Other agency address ID' })
  @IsUUID()
  @IsOptional()
  otherAgencyId?: string;

  @ApiPropertyOptional({ description: 'Legal representative address ID' })
  @IsUUID()
  @IsOptional()
  legalRepId?: string;

  @ApiPropertyOptional({ description: 'Other representative address ID' })
  @IsUUID()
  @IsOptional()
  otherRepId?: string;

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
