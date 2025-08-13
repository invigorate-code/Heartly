import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('custom_roles')
@Index(['tenantId', 'name'], { unique: true }) // Unique role names per tenant
export class CustomRoleEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  permissions!: string[];

  @Column({ type: 'boolean', default: false })
  isSystem!: boolean; // true for OWNER, ADMIN, STAFF

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Relationships
  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: TenantEntity;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  // Inherited from AbstractEntity: createdAt and updatedAt

  // Helper methods
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  addPermission(permission: string): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: string): void {
    this.permissions = this.permissions.filter((p) => p !== permission);
  }
}
