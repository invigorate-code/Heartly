import { CreateAddressDto } from '@/api/address/dto/createAddress.req.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateSpecialistDto {
  @ApiProperty({
    description:
      'Type of specialist (e.g. "Primary Physician", "Dentist", etc.)',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Name of specialist' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Address information of the specialist' })
  @Type(() => CreateAddressDto)
  @IsOptional()
  address?: CreateAddressDto;
}
