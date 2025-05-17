import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import {
  ClassField,
  NumberField,
  StringField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FacilityResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  address: string;

  @StringField()
  @Expose()
  city: string;

  @StringField()
  @Expose()
  state: string;

  @StringField()
  @Expose()
  zip: string;

  @NumberField()
  @Expose()
  projected_client_count: number;

  @StringField()
  @Expose()
  tenantId: string;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @Expose()
  tenant?: TenantEntity;

  @Expose()
  users?: UserEntity[];
}
