import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'First name of the client',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the client',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Birthdate of the client in ISO format',
    example: '2000-01-01T00:00:00Z',
  })
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    description: 'Unique Client Identifier (UCI)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  uci: string;

  @ApiProperty({
    description: 'ID of the tenant where the client is registered',
    example: 'h45sh223',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    description: 'ID of the facility where the client is registered',
    example: 'f45sh223',
  })
  @IsString()
  @IsNotEmpty()
  facilityId: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
