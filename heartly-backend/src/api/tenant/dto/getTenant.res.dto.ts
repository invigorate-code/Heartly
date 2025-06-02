import { ClassField, StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

// Import FacilityResDto type only to avoid circular dependency
import type { FacilityResDto } from '@/api/facility/dto/getFacility.res.dto';

@Exclude()
export class TenantResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  description?: string;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  // QUESTION(@thompson): Is circular dependency the best approach here? i.e. the @Type(() => FacilityResDto) method (AI said its not the best)
  // Use type annotation rather than decorator for circular ref
  @Expose()
  facilities?: FacilityResDto[];
}
