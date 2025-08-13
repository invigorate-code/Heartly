import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PasswordResetMethod {
  SELF_SERVICE = 'self_service',
  ADMINISTRATIVE = 'administrative',
  TEMP_PASSWORD = 'temp_password',
}

@Entity('password_reset_audit')
@Index(['tenantId'])
@Index(['resetByUserId'])
@Index(['targetUserId'])
@Index(['createdAt'])
export class PasswordResetAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tenant_id' })
  @Index()
  tenantId!: string;

  @Column({ name: 'reset_by_user_id' })
  @Index()
  resetByUserId!: string;

  @Column({ name: 'target_user_id' })
  @Index()
  targetUserId!: string;

  @Column({
    name: 'reset_method',
    type: 'enum',
    enum: PasswordResetMethod,
  })
  resetMethod!: PasswordResetMethod;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @Column({ name: 'success', default: false })
  success!: boolean;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ name: 'temp_password_token', nullable: true })
  tempPasswordToken?: string;

  @Column({ name: 'temp_password_used', default: false })
  tempPasswordUsed!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt?: Date;

  // Helper methods
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isValidTempPassword(): boolean {
    return (
      this.resetMethod === PasswordResetMethod.TEMP_PASSWORD &&
      !this.tempPasswordUsed &&
      !this.isExpired()
    );
  }

  markTempPasswordUsed(): void {
    this.tempPasswordUsed = true;
    this.usedAt = new Date();
  }
}
