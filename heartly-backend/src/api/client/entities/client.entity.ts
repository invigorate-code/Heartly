import { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('client')
export class ClientEntity extends AbstractEntity {
  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ type: 'date', nullable: false })
  birthDate!: Date;

  @Column({ nullable: false })
  uci!: string;

  // Adding explicit foreign key column for facility
  @Column({ nullable: false })
  facilityId!: string;

  @ManyToOne(() => FacilityEntity, { nullable: false })
  @JoinColumn({ name: 'facilityId' })
  facility!: FacilityEntity;

  // Adding explicit foreign key column for tenant
  @Column({ nullable: false })
  tenantId!: string;

  @ManyToOne(() => TenantEntity, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ nullable: true })
  photo?: string;

  // @OneToOne(() => PhotoEntity, { nullable: true })
  // @JoinColumn({ name: 'photo' })
  // photoEntity?: PhotoEntity;
}
