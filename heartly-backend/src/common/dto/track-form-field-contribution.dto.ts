import { FORM_TYPE } from '@/constants/form-types.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrackFormContributionDto {
  @ApiProperty({ description: 'The name of the field that was contributed to' })
  @IsNotEmpty()
  @IsString()
  fieldName: string;

  @ApiProperty({
    description: 'The ID of the user who contributed to the field',
  })
  @IsNotEmpty()
  @IsString()
  contributorId: string;

  @ApiProperty({ description: 'The type of form' })
  @IsNotEmpty()
  @IsString()
  formType: FORM_TYPE;

  @ApiProperty({ description: 'The ID of the metadata record' })
  @IsNotEmpty()
  @IsString()
  metadataId: string;
}
