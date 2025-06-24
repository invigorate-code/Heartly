import { CreateAddressDto } from '@/api/address/dto/create-address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialistDto {
  @ApiProperty({
    description:
      'Type of specialist (e.g. "Primary Physician", "Dentist", etc.)',
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: 'Name of specialist' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Address information of the specialist' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  address?: CreateAddressDto;
}
