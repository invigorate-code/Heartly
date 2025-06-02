import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateClientNameDto {
  @ApiProperty({
    description: 'Client first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ValidateIf((o) => !o.lastName || o.firstName)
  firstName?: string;

  @ApiProperty({
    description: 'Client last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ValidateIf((o) => !o.firstName || o.lastName)
  lastName?: string;
}
