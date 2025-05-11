import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity('facility')
export class FacilityEntity extends AbstractEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ length: 200 })
  address!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ length: 2 })
  state!: string;

  @Column({ length: 10 })
  zip!: string;

  @Column('int')
  projected_client_count!: number;

  /** Which tenant (subscriber) this facility belongs to */
  @ManyToOne(() => TenantEntity, (t) => t.facilities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  /** Staff users assigned to this facility */
  @ManyToMany(() => UserEntity, (u) => u.facilities)
  @JoinTable({
    name: 'facility_staff',
    joinColumn: { name: 'facilityId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  staff!: UserEntity[];
}
