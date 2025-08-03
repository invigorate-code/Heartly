import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Name of the medication' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Required dosage of the medication' })
  @IsString()
  @IsOptional()
  requiredDosage?: string;

  @ApiPropertyOptional({ description: 'Time frequency for taking medication' })
  @IsString()
  @IsOptional()
  timeFrequency?: string;

  @ApiPropertyOptional({ description: 'Whether medication is prescription' })
  @IsBoolean()
  @IsOptional()
  isPrescription?: boolean;

  @ApiPropertyOptional({ description: 'Name of prescribing doctor' })
  @IsString()
  @IsOptional()
  prescribingMd?: string;

  @ApiPropertyOptional({ description: 'Date medication was filled' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  filledDate?: Date;

  @ApiPropertyOptional({ description: 'Number of refills remaining' })
  @IsNumber()
  @IsOptional()
  refillsRemaining?: number;

  @ApiPropertyOptional({ description: 'Whether medication is daily' })
  @IsBoolean()
  @IsOptional()
  isDailyMed?: boolean;
}
