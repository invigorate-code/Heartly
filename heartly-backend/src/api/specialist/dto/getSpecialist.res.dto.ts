import { AddressResponseDto } from '@/api/address/dto/getAddress.res.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpecialistResponseDto {
  @ApiProperty({ description: 'Unique identifier for the specialist' })
  id: string;

  @ApiProperty({ description: 'Specialist name' })
  name: string;

  @ApiProperty({
    description: 'Specialist type (e.g., Primary Physician, Dentist)',
  })
  type: string;

  @ApiPropertyOptional({
    description: 'Address information for the specialist',
  })
  address?: AddressResponseDto;
}
