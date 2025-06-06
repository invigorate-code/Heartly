import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrackContributionDto {
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

  @ApiProperty({ description: 'The ID of the placement info record' })
  @IsNotEmpty()
  @IsString()
  placementInfoId: string;
}
