import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MedicationResponseDto {
  @ApiProperty({ description: 'Unique identifier for the medication' })
  id: string;

  @ApiProperty({ description: 'Medication name' })
  name: string;

  @ApiProperty({ description: 'Required dosage' })
  requiredDosage: string;

  @ApiPropertyOptional({ description: 'Time/frequency for administering' })
  timeFrequency?: string;

  @ApiPropertyOptional({ description: 'Prescribing doctor' })
  prescribingMd?: string;

  @ApiPropertyOptional({
    description: 'Whether this is a prescription medication',
  })
  isPrescription?: boolean;

  @ApiPropertyOptional({ description: 'Number of refills remaining' })
  refillsRemaining?: number;

  @ApiPropertyOptional({ description: 'Date when medication was filled' })
  filledDate?: Date;
}
