import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateFacilityDto {
  @ApiProperty({
    description: 'Name of the facility',
    example: 'Sunshine Care Center',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Street address of the facility',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  address: string;

  @ApiProperty({
    description: 'City where the facility is located',
    example: 'San Francisco',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  city: string;

  @ApiProperty({
    description: 'State code where the facility is located',
    example: 'CA',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @ApiProperty({
    description: 'ZIP code of the facility',
    example: '94102',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 10)
  zip: string;

  @ApiProperty({
    description: 'Projected number of clients at this facility',
    example: 150,
  })
  @IsInt()
  @Min(0)
  projectedClientCount: number;

  @ApiProperty({
    description: 'Projected number of clients at this facility',
    example: 150,
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
}
