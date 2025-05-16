import type { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('tenant')
export class TenantEntity extends AbstractEntity {
  @Column({ unique: true, length: 100 })
  name!: string;

  /** All users under this tenant */
  @OneToMany('UserEntity', 'tenant', {
    cascade: ['insert', 'update', 'remove'],
  })
  users?: UserEntity[];

  /** All facilities under this tenant */
  @OneToMany('FacilityEntity', 'tenant', {
    cascade: ['insert', 'update', 'remove'],
  })
  facilities?: FacilityEntity[];
}
