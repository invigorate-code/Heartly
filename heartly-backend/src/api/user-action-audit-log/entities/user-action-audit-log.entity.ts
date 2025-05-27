import { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'user_action_audit_log' })
export class UserActionAuditLogEntity extends AbstractEntity {
  // The user performing the action
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
  @Column()
  userId!: string;

  // // The client the action is performed on
  // @ManyToOne(() => ClientEntity, { nullable: true })
  // @JoinColumn({ name: 'clientId' })
  // client?: ClientEntity;
  // @Column({ nullable: true })
  // clientId?: string;

  // The user the action is performed for
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'targetUserId' })
  targetUser?: UserEntity;
  @Column({ nullable: true })
  targetUserId?: string;

  // The facility the action is performed for
  @ManyToOne(() => FacilityEntity, { nullable: false })
  @JoinColumn({ name: 'targetFacilityId' })
  targetFacility!: FacilityEntity;
  @Column()
  targetFacilityId!: string;

  // The tenant the action is performed for
  @ManyToOne(() => TenantEntity, { nullable: false })
  @JoinColumn({ name: 'targetTenantId' })
  targetTenant!: TenantEntity;
  @Column()
  targetTenantId!: string;

  // The action performed
  @Column()
  action!: string;

  // Additional details
  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;
}
