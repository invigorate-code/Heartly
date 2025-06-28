import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({ description: 'Unique identifier for the address' })
  id: string;

  @ApiProperty({ description: 'Name associated with this address' })
  name: string;

  @ApiProperty({ description: 'Street address' })
  streetAddress: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State' })
  state: string;

  @ApiProperty({ description: 'Zip code' })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Relation to the client' })
  relation?: string;
}
