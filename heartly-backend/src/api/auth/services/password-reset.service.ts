import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import * as crypto from 'crypto';
// import * as bcrypt from 'bcrypt';
import SuperTokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { PasswordResetAuditEntity, PasswordResetMethod } from '../entities/password-reset-audit.entity';
import {
  OwnerPasswordResetRequestDto,
  OwnerPasswordResetConfirmDto,
  AdminPasswordResetDto,
  TempPasswordChangeDto,
  GenerateTempPasswordResponseDto,
  PasswordResetAuditResponseDto,
} from '../dto/password-reset.dto';
import { UserService } from '../../user/user.service';
import { MailService } from '../../../mail/mail.service';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetAuditEntity)
    private readonly auditRepository: Repository<PasswordResetAuditEntity>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Owner self-service password reset - initiate reset
   */
  async initiateOwnerPasswordReset(
    dto: OwnerPasswordResetRequestDto,
    request: Request,
  ): Promise<{ message: string }> {
    try {
      // Check if user exists and is an OWNER
      const user = await SuperTokens.listUsersByAccountInfo('public', {
        email: dto.email,
      });

      if (user.length === 0) {
        throw new NotFoundException('User not found');
      }

      const targetUser = user[0];
      
      // Check if user has OWNER role
      const { roles } = await UserRoles.getRolesForUser('public', targetUser.id);
      if (!roles.includes(UserRole.OWNER)) {
        throw new ForbiddenException('Only OWNER users can self-reset passwords');
      }

      // Get tenant context for the user
      const tenantContext = await this.getUserTenantContext(targetUser.id);
      if (!tenantContext) {
        throw new BadRequestException('User tenant context not found');
      }

      // Generate password reset token using SuperTokens
      const loginMethod = targetUser.loginMethods.find(lm => lm.recipeId === 'emailpassword');
      if (!loginMethod?.email) {
        throw new BadRequestException('User email not found');
      }
      const response = await EmailPassword.createResetPasswordToken(
        tenantContext.tenantId,
        targetUser.id,
        loginMethod.email,
      );

      if (response.status !== 'OK') {
        throw new BadRequestException('Failed to generate password reset token');
      }

      // Log the password reset attempt
      await this.logPasswordResetAudit({
        tenantId: tenantContext.tenantId,
        resetByUserId: targetUser.id,
        targetUserId: targetUser.id,
        resetMethod: PasswordResetMethod.SELF_SERVICE,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: true,
      });

      // Send password reset email (handled by SuperTokens)
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      // Log failed attempt
      if (error instanceof NotFoundException) {
        // Don't log for non-existent users to prevent user enumeration
        throw error;
      }

      throw error;
    }
  }

  /**
   * Owner self-service password reset - confirm with token
   */
  async confirmOwnerPasswordReset(
    dto: OwnerPasswordResetConfirmDto,
    request: Request,
  ): Promise<{ message: string }> {
    try {
      // Reset password using SuperTokens
      const response = await EmailPassword.resetPasswordUsingToken(
        'public', // tenantId for password reset
        dto.token,
        dto.newPassword,
      );

      if (response.status !== 'OK') {
        if (response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
          throw new BadRequestException('Invalid or expired password reset token');
        }
        throw new BadRequestException('Failed to reset password');
      }

      // Get user info for audit logging
      const user = await SuperTokens.getUser((response as any).userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const tenantContext = await this.getUserTenantContext((response as any).userId);
      if (!tenantContext) {
        throw new BadRequestException('User tenant context not found');
      }

      // Log successful password reset
      await this.logPasswordResetAudit({
        tenantId: tenantContext.tenantId,
        resetByUserId: (response as any).userId,
        targetUserId: (response as any).userId,
        resetMethod: PasswordResetMethod.SELF_SERVICE,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: true,
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Administrative password reset by OWNER/ADMIN
   */
  async adminResetUserPassword(
    dto: AdminPasswordResetDto,
    session: SessionContainer,
    request: Request,
  ): Promise<GenerateTempPasswordResponseDto> {
    const adminUserId = session.getUserId();
    const adminTenantId = session.getAccessTokenPayload().tenantId;

    // Verify admin has permission to reset this user's password
    await this.verifyResetPermission(adminUserId, dto.targetUserId, adminTenantId);

    try {
      // Generate secure temporary password
      const tempPassword = this.generateSecurePassword();
      const tempPasswordToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Hash the temporary password for storage
      // const hashedTempPassword = await bcrypt.hash(tempPassword, 12);
      const hashedTempPassword = tempPassword; // Temporary: will be fixed after bcrypt native module is rebuilt

      // Create audit record with temporary password info
      const auditRecord = await this.logPasswordResetAudit({
        tenantId: adminTenantId,
        resetByUserId: adminUserId,
        targetUserId: dto.targetUserId,
        resetMethod: PasswordResetMethod.TEMP_PASSWORD,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: true,
        tempPasswordToken,
        expiresAt,
      });

      // Get target user info for email
      const targetUser = await SuperTokens.getUser(dto.targetUserId);
      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      // Send temporary password email if requested
      if (dto.sendEmail !== false) {
        await this.sendTempPasswordEmail(
          targetUser,
          tempPassword,
          tempPasswordToken,
          expiresAt,
          dto.reason,
        );
      }

      return {
        tempPassword,
        tempPasswordToken,
        expiresAt,
        auditId: auditRecord.id,
      };
    } catch (error) {
      // Log failed attempt
      await this.logPasswordResetAudit({
        tenantId: adminTenantId,
        resetByUserId: adminUserId,
        targetUserId: dto.targetUserId,
        resetMethod: PasswordResetMethod.ADMINISTRATIVE,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: false,
        errorMessage: error.message,
      });

      throw error;
    }
  }

  /**
   * User changes password using temporary password
   */
  async changeTempPassword(
    dto: TempPasswordChangeDto,
    request: Request,
  ): Promise<{ message: string }> {
    // Find and validate temporary password record
    const auditRecord = await this.auditRepository.findOne({
      where: {
        tempPasswordToken: dto.tempPasswordToken,
        resetMethod: PasswordResetMethod.TEMP_PASSWORD,
      },
    });

    if (!auditRecord || !auditRecord.isValidTempPassword()) {
      throw new BadRequestException('Invalid or expired temporary password token');
    }

    try {
      // Update user's password using SuperTokens
      const response = await EmailPassword.updateEmailOrPassword({
        recipeUserId: SuperTokens.convertToRecipeUserId(auditRecord.targetUserId),
        password: dto.newPassword,
      });

      if (response.status !== 'OK') {
        throw new BadRequestException('Failed to update password');
      }

      // Mark temporary password as used
      auditRecord.markTempPasswordUsed();
      await this.auditRepository.save(auditRecord);

      // Log successful password change
      await this.logPasswordResetAudit({
        tenantId: auditRecord.tenantId,
        resetByUserId: auditRecord.targetUserId,
        targetUserId: auditRecord.targetUserId,
        resetMethod: PasswordResetMethod.TEMP_PASSWORD,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: true,
      });

      return { message: 'Password updated successfully' };
    } catch (error) {
      // Log failed attempt
      await this.logPasswordResetAudit({
        tenantId: auditRecord.tenantId,
        resetByUserId: auditRecord.targetUserId,
        targetUserId: auditRecord.targetUserId,
        resetMethod: PasswordResetMethod.TEMP_PASSWORD,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        success: false,
        errorMessage: error.message,
      });

      throw error;
    }
  }

  /**
   * Get password reset audit history
   */
  async getPasswordResetHistory(
    session: SessionContainer,
    targetUserId?: string,
  ): Promise<PasswordResetAuditResponseDto[]> {
    const adminUserId = session.getUserId();
    const tenantId = session.getAccessTokenPayload().tenantId;

    // Verify admin has permission
    const { roles } = await UserRoles.getRolesForUser(tenantId, adminUserId);
    if (!roles.includes(UserRole.OWNER) && !roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .where('audit.tenantId = :tenantId', { tenantId });

    if (targetUserId) {
      queryBuilder.andWhere('audit.targetUserId = :targetUserId', { targetUserId });
    }

    const records = await queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .limit(100)
      .getMany();

    return records.map((record) => ({
      id: record.id,
      resetByUserId: record.resetByUserId,
      targetUserId: record.targetUserId,
      resetMethod: record.resetMethod,
      success: record.success,
      errorMessage: record.errorMessage,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
    }));
  }

  /**
   * Verify admin has permission to reset target user's password
   */
  private async verifyResetPermission(
    adminUserId: string,
    targetUserId: string,
    tenantId: string,
  ): Promise<void> {
    // Get admin roles
    const { roles: adminRoles } = await UserRoles.getRolesForUser(tenantId, adminUserId);
    
    // Get target user roles
    const { roles: targetRoles } = await UserRoles.getRolesForUser(tenantId, targetUserId);

    // OWNER can reset anyone in their tenant
    if (adminRoles.includes(UserRole.OWNER)) {
      return;
    }

    // ADMIN can only reset STAFF users
    if (adminRoles.includes(UserRole.ADMIN)) {
      if (targetRoles.includes(UserRole.STAFF)) {
        return;
      }
      throw new ForbiddenException('ADMIN users can only reset STAFF passwords');
    }

    throw new ForbiddenException('Insufficient permissions to reset passwords');
  }

  /**
   * Generate secure temporary password
   */
  private generateSecurePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special char

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Send temporary password email
   */
  private async sendTempPasswordEmail(
    user: any,
    tempPassword: string,
    tempPasswordToken: string,
    expiresAt: Date,
    reason?: string,
  ): Promise<void> {
    const loginMethod = user.loginMethods.find(lm => lm.recipeId === 'emailpassword');
    if (!loginMethod?.email) {
      throw new BadRequestException('User email not found');
    }

    // Send email with temporary password
    await this.mailService['mailerService'].sendMail({
      to: loginMethod.email,
      subject: 'Temporary Password - Heartly',
      template: 'temp-password',
      context: {
        tempPassword,
        expiresAt: expiresAt.toLocaleString(),
        reason: reason || 'Administrative password reset',
        loginUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    });
  }

  /**
   * Log password reset audit record
   */
  private async logPasswordResetAudit(data: {
    tenantId: string;
    resetByUserId: string;
    targetUserId: string;
    resetMethod: PasswordResetMethod;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
    tempPasswordToken?: string;
    expiresAt?: Date;
  }): Promise<PasswordResetAuditEntity> {
    const auditRecord = this.auditRepository.create(data);
    return await this.auditRepository.save(auditRecord);
  }

  /**
   * Get user tenant context (helper method)
   */
  private async getUserTenantContext(userId: string): Promise<any> {
    // This should match the logic from supertokens-helper.ts
    // For now, returning a simple implementation
    const user = await SuperTokens.getUser(userId);
    if (!user) return null;

    return {
      tenantId: 'public', // This should be replaced with actual tenant logic
      userId,
      email: user.loginMethods[0]?.email,
    };
  }
}