import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('data_audit_log')
@Index(['tableName', 'rowId'])
@Index(['userId', 'timestamp'])
@Index(['tenantId', 'timestamp'])
@Index(['timestamp'])
export class DataAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'table_name' })
  tableName: string;

  @Column({
    type: 'varchar',
    enum: ['INSERT', 'UPDATE', 'DELETE'],
  })
  operation: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column({ name: 'row_id', type: 'uuid' })
  rowId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string;

  @Column({ name: 'facility_id', type: 'uuid', nullable: true })
  facilityId?: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues?: Record<string, any>;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues?: Record<string, any>;

  @Column({ name: 'changed_fields', type: 'text', array: true, nullable: true })
  changedFields?: string[];

  @Column({ name: 'session_id', nullable: true })
  sessionId?: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;
}
