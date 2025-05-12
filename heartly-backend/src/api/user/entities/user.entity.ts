import type { FacilityEntity } from '@/api/facility/entities/facility.entity';
import type { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

@Entity('user')
export class UserEntity extends AbstractEntity {
  @PrimaryColumn('uuid')
  override id: string = null;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column({ nullable: true, length: 100, unique: true })
  email?: string;

  @Column({ nullable: true, length: 255, unique: true })
  company?: string;

  @Column({ nullable: true })
  onboarding_completed_at?: Date;

  @Column({ default: 0 })
  onboarding_step?: number;

  @Column('uuid')
  tenantId!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role!: UserRole;

  // TODO: Add a column for dynamic permissions
  @Column({ type: 'jsonb', nullable: true })
  permissions?: Record<string, boolean>;


  /** Owner ↔ Tenant one-to-one */
  @OneToOne(/* target */ 'TenantEntity', /* inverse */ 'owner', {
    onDelete: 'CASCADE',
    eager: true,
  })
  tenantOwned?: TenantEntity;

  /** Many users belong to one tenant */
  @ManyToOne(/* target */ 'TenantEntity', /* inverse */ 'users', {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  /** Staff assignments to facilities */
  @ManyToMany(/* target */ 'FacilityEntity', /* inverse */ 'staff', {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinTable({
    name: 'facility_staff',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'facilityId', referencedColumnName: 'id' },
  })
  facilities!: FacilityEntity[];
}
