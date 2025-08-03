// audit-log.entity.ts
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'system_audit_logs' })
export class SystemAuditLogEntity extends AbstractEntity {
  // The ID of the user performing the action
  @Column()
  userId!: string;

  // The ID of the client action is performed on
  @Column()
  clientId?: string;

  // The ID of the user the action is performed for
  @Column()
  targetUserId?: string;

  // The ID of the facility the action is performed for
  @Column()
  targetFacilityId?: string;

  // The ID of the tenant the action is performed for
  @Column()
  targetTenantId?: string;

  // The action performed (e.g., 'READ_PHI', 'UPDATE_PHI', etc.)
  @Column()
  action!: string;

  // The type of log (e.g., 'SYSTEM', 'USER', 'ADMIN)
  @Column()
  type!: string;

  // Additional details stored as JSON (e.g., which PHI was accessed)
  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;
}
