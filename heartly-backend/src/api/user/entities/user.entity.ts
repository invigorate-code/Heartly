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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role!: UserRole;

  // TODO: Add a column for dynamic permissions
  @Column({ type: 'jsonb', nullable: true })
  permissions?: Record<string, boolean>;

  @Column('uuid')
  tenantId!: string;

  /** Many users belong to one tenant */
  @ManyToOne('TenantEntity', 'users', {
    nullable: false,
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;

  @Column('uuid')
  facilityId!: string;

  /** Staff assignments to facilities */
  @ManyToMany('FacilityEntity', 'staff', {
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
