import type { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity('tenant')
export class TenantEntity extends AbstractEntity {
  @Column({ unique: true, length: 100 })
  name!: string;

  /** The subscribing user who “owns” this tenant */
  // @OneToOne(/* target */ 'UserEntity', /* inverse */ 'tenantOwned', {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'ownerId' })
  // owner!: UserEntity;

  @OneToOne(() => UserEntity)
  owner: UserEntity;

  // /** All users under this tenant */
  // @OneToMany(/* target */ 'UserEntity', /* inverse */ 'tenant', {
  //   cascade: ['insert', 'update', 'remove'],
  // })
  // users!: UserEntity[];

  @OneToMany(/* target */ 'UserEntity', /* inverse */ 'tenant')
  users: UserEntity[];

  /** All facilities under this tenant */
  @OneToMany(/* target */ 'FacilityEntity', /* inverse */ 'tenant', {
    cascade: ['insert', 'update', 'remove'],
  })
  facilities!: FacilityEntity[];
}
