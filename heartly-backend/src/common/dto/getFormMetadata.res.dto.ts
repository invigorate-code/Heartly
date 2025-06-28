import { ApiProperty } from '@nestjs/swagger';

export class MetadataResponseDto {
  @ApiProperty({ description: 'Unique identifier for the metadata' })
  id: string;

  @ApiProperty({ description: 'Form type' })
  formType: string;

  @ApiProperty({ description: 'ID of the entity this metadata belongs to' })
  entityId: string;

  @ApiProperty({ description: 'User who last updated the form' })
  lastUpdatedBy: {
    id: string;
    name?: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
