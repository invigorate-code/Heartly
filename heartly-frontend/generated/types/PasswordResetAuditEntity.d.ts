export interface PasswordResetAuditEntity {
  id: string;
  tenantId: string;
  resetByUserId: string;
  targetUserId: string;
  resetMethod: PasswordResetMethod;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  tempPasswordToken?: string;
  tempPasswordUsed: boolean;
  createdAt: Date;
  expiresAt?: Date;
  usedAt?: Date;
}
