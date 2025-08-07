import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import {
  IsAddress,
  IsCityName,
  IsFacilityName,
  IsPhoneNumber,
  IsStateCode,
  IsZipCode,
} from '../../../common/validators/business-rules.validator';

export enum FacilityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export class CreateFacilityDto {
  @ApiProperty({
    description: 'Name of the facility (3-100 characters)',
    example: 'Sunshine Care Center',
  })
  @IsNotEmpty()
  @IsFacilityName()
  name: string;

  @ApiProperty({
    description: 'Street address of the facility (5-200 characters)',
    example: '123 Main Street',
  })
  @IsNotEmpty()
  @IsAddress()
  address: string;

  @ApiProperty({
    description: 'City where the facility is located',
    example: 'San Francisco',
  })
  @IsNotEmpty()
  @IsCityName()
  city: string;

  @ApiProperty({
    description:
      'State code where the facility is located (2 uppercase letters)',
    example: 'CA',
  })
  @Transform(({ value }) => value?.toUpperCase())
  @IsNotEmpty()
  @IsStateCode()
  state: string;

  @ApiProperty({
    description: 'ZIP code of the facility (12345 or 12345-6789 format)',
    example: '94102',
  })
  @IsNotEmpty()
  @IsZipCode()
  zip: string;

  @ApiProperty({
    description: 'Projected number of clients at this facility',
    example: 150,
  })
  @IsInt()
  @Min(0)
  projectedClientCount: number;

  @ApiProperty({
    description: 'Number of rooms at this facility',
    example: 75,
  })
  @IsInt()
  @Min(0)
  roomCount: number;

  @ApiProperty({
    description: 'ID of the tenant this facility belongs to',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: 'Facility phone number in international format',
    example: '+14155551234',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Facility email address',
    example: 'contact@sunshinecare.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Facility status',
    enum: FacilityStatus,
    example: FacilityStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FacilityStatus)
  status?: FacilityStatus = FacilityStatus.ACTIVE;
}
