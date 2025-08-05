import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { 
  IsBirthDate, 
  IsPersonName, 
  IsPhoneNumber, 
  IsUciFormat 
} from '../../../common/validators/business-rules.validator';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCHARGED = 'DISCHARGED',
  ON_HOLD = 'ON_HOLD',
}

export class CreateClientDto {
  @ApiProperty({
    description: 'First name of the client',
    example: 'John',
  })
  @IsNotEmpty()
  @IsPersonName()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the client',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsPersonName()
  lastName: string;

  @ApiProperty({
    description: 'Birthdate of the client in ISO format',
    example: '2000-01-01',
  })
  @Type(() => Date)
  @IsBirthDate()
  birthDate: Date;

  @ApiProperty({
    description: 'Unique Client Identifier (UCI) - 6-20 uppercase alphanumeric characters',
    example: 'CLIENT123456',
  })
  @Transform(({ value }) => value?.toUpperCase())
  @IsUciFormat()
  uci: string;

  @ApiProperty({
    description: 'ID of the tenant where the client is registered',
    example: 'h45sh223-1234-5678-9abc-def012345678',
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: 'ID of the facility where the client is registered',
    example: 'f45sh223-1234-5678-9abc-def012345678',
  })
  @IsUUID()
  facilityId: string;

  @ApiProperty({
    description: 'Client photo URL or base64 encoded image',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    description: 'Client phone number in international format',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Client status',
    enum: ClientStatus,
    example: ClientStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus = ClientStatus.ACTIVE;
}
