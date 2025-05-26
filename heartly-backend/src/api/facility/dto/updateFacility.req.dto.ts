import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateFacilityDto } from './createFacility.req.dto';

export class UpdateFacilityDto extends PartialType(
  OmitType(CreateFacilityDto, ['tenantId'] as const),
) {
  @ApiProperty({
    description: 'ID of the facility to update',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @IsUUID()
  id: string;
}
