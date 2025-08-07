import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { PasswordResetService } from '../services/password-reset.service';
import {
  OwnerPasswordResetRequestDto,
  OwnerPasswordResetConfirmDto,
  AdminPasswordResetDto,
  TempPasswordChangeDto,
  GenerateTempPasswordResponseDto,
  PasswordResetAuditResponseDto,
} from '../dto/password-reset.dto';
import { 
  PasswordResetPermissionGuard, 
  PasswordResetPermissions, 
  PasswordResetAction 
} from '../../../guards/password-reset-permission.guard';

@ApiTags('Password Reset')
@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('owner/initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Initiate owner password reset',
    description: 'Send password reset email to OWNER user. Only OWNER users can use self-service password reset.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset link sent to your email' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Only OWNER users can self-reset passwords' })
  async initiateOwnerPasswordReset(
    @Body() dto: OwnerPasswordResetRequestDto,
    @Req() request: Request,
  ) {
    return this.passwordResetService.initiateOwnerPasswordReset(dto, request);
  }

  @Post('owner/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Confirm owner password reset',
    description: 'Complete password reset using token from email',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async confirmOwnerPasswordReset(
    @Body() dto: OwnerPasswordResetConfirmDto,
    @Req() request: Request,
  ) {
    return this.passwordResetService.confirmOwnerPasswordReset(dto, request);
  }

  @Post('admin/reset-user')
  @UseGuards(SuperTokensAuthGuard, PasswordResetPermissionGuard)
  @PasswordResetPermissions(PasswordResetAction.ADMIN_RESET_OTHERS)
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Administrative password reset',
    description: 'OWNER/ADMIN can reset other users passwords. Generates temporary password.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Temporary password generated successfully',
    type: GenerateTempPasswordResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Target user not found' })
  async adminResetUserPassword(
    @Body() dto: AdminPasswordResetDto,
    @Session() session: SessionContainer,
    @Req() request: Request,
  ): Promise<GenerateTempPasswordResponseDto> {
    return this.passwordResetService.adminResetUserPassword(dto, session, request);
  }

  @Post('temp-password/change')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Change password using temporary password',
    description: 'User sets new password using temporary password token',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password updated successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired temporary password token' })
  async changeTempPassword(
    @Body() dto: TempPasswordChangeDto,
    @Req() request: Request,
  ) {
    return this.passwordResetService.changeTempPassword(dto, request);
  }

  @Get('audit-history')
  @UseGuards(SuperTokensAuthGuard, PasswordResetPermissionGuard)
  @PasswordResetPermissions(PasswordResetAction.VIEW_AUDIT_HISTORY)
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get password reset audit history',
    description: 'OWNER/ADMIN can view password reset audit logs for their tenant',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Audit history retrieved successfully',
    type: [PasswordResetAuditResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getPasswordResetHistory(
    @Session() session: SessionContainer,
  ): Promise<PasswordResetAuditResponseDto[]> {
    return this.passwordResetService.getPasswordResetHistory(session);
  }

  @Get('audit-history/:userId')
  @UseGuards(SuperTokensAuthGuard, PasswordResetPermissionGuard)
  @PasswordResetPermissions(PasswordResetAction.VIEW_AUDIT_HISTORY)
  @VerifySession()
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'User ID to get audit history for' })
  @ApiOperation({ 
    summary: 'Get password reset audit history for specific user',
    description: 'OWNER/ADMIN can view password reset audit logs for specific user',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User audit history retrieved successfully',
    type: [PasswordResetAuditResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getUserPasswordResetHistory(
    @Param('userId') userId: string,
    @Session() session: SessionContainer,
  ): Promise<PasswordResetAuditResponseDto[]> {
    return this.passwordResetService.getPasswordResetHistory(session, userId);
  }
}