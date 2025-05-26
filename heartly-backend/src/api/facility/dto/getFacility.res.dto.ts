import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import {
  ClassField,
  NumberField,
  StringField,
} from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FacilityResDto {
  @ApiProperty({
    description: 'Unique identifier for the facility',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @StringField()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the facility',
    example: 'Heartly Wellness Center',
  })
  @StringField()
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Street address of the facility',
    example: '123 Main Street',
  })
  @StringField()
  @Expose()
  address: string;

  @ApiProperty({
    description: 'City where the facility is located',
    example: 'San Francisco',
  })
  @StringField()
  @Expose()
  city: string;

  @ApiProperty({
    description: 'State code where the facility is located',
    example: 'CA',
  })
  @StringField()
  @Expose()
  state: string;

  @ApiProperty({
    description: 'ZIP/Postal code of the facility',
    example: '94105',
  })
  @StringField()
  @Expose()
  zip: string;

  @ApiProperty({
    description: 'Estimated number of clients for this facility',
    example: 500,
  })
  @NumberField()
  @Expose()
  projected_client_count: number;

  @ApiProperty({
    description: 'ID of the tenant this facility belongs to',
    example: '7d793fe4-cd74-45bc-9d0d-7b9641f54c3d',
  })
  @StringField()
  @Expose()
  tenantId: string;

  @ApiProperty({
    description: 'When the facility was created',
    example: '2023-06-15T14:30:00Z',
  })
  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'When the facility was last updated',
    example: '2023-07-20T09:15:30Z',
  })
  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Indicates if the facility is deleted',
    example: false,
  })
  @Expose()
  isDeleted: boolean;

  @ApiProperty({
    description: 'Date when the facility was deleted, if applicable',
    example: null,
  })
  @ClassField(() => Date, { nullable: true })
  @Expose()
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'Tenant details this facility belongs to',
    type: () => TenantEntity,
  })
  @Expose()
  tenant?: TenantEntity;

  @ApiProperty({
    description: 'Users assigned to this facility',
    type: () => [UserEntity],
  })
  @Expose()
  users?: UserEntity[];
}
