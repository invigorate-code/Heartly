import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthOptional } from '@/decorators/auth-optional.decorator';
import { Public } from '@/decorators/public.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { RequiresFacilityAccess } from '@/decorators/facility-access.decorator';
import { EnhancedAuthGuard } from './enhanced-auth.guard';
import { RolesGuard } from './roles.guard';
import { TenantContextGuard } from './tenant-context.guard';
import { FacilityAccessGuard } from './facility-access.guard';

@ApiTags('guards-test')
@Controller('test/guards')
export class GuardsTestController {
  @Get('public')
  @Public()
  async testPublic() {
    return { message: 'Public endpoint - no authentication required' };
  }

  @Get('auth-optional')
  @AuthOptional()
  @UseGuards(EnhancedAuthGuard)
  async testAuthOptional(@Req() request: Request) {
    const userId = request['userId'];
    return {
      message: 'Optional auth endpoint',
      authenticated: !!userId,
      userId: userId || null,
    };
  }

  @Get('authenticated')
  @UseGuards(EnhancedAuthGuard)
  async testAuthenticated(@Req() request: Request) {
    return {
      message: 'Authenticated endpoint',
      userId: request['userId'],
      tenantId: request['tenantId'],
      userRole: request['userRole'],
    };
  }

  @Get('admin-only')
  @UseGuards(EnhancedAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async testAdminOnly(@Req() request: Request) {
    return {
      message: 'Admin/Owner only endpoint',
      userId: request['userId'],
      tenantId: request['tenantId'],
      userRole: request['userRole'],
    };
  }

  @Get('tenant-context')
  @UseGuards(EnhancedAuthGuard, TenantContextGuard)
  async testTenantContext(@Req() request: Request) {
    return {
      message: 'Tenant context validated',
      userId: request['userId'],
      tenantId: request['tenantId'],
      userRole: request['userRole'],
    };
  }

  @Get('facility/:facilityId')
  @UseGuards(EnhancedAuthGuard, FacilityAccessGuard)
  @RequiresFacilityAccess()
  async testFacilityAccess(
    @Param('facilityId') facilityId: string,
    @Req() request: Request
  ) {
    return {
      message: 'Facility access validated',
      facilityId,
      userId: request['userId'],
      tenantId: request['tenantId'],
      userRole: request['userRole'],
    };
  }

  @Post('full-security/:facilityId')
  @UseGuards(EnhancedAuthGuard, RolesGuard, TenantContextGuard, FacilityAccessGuard)
  @Roles('ADMIN', 'OWNER')
  @RequiresFacilityAccess()
  async testFullSecurity(
    @Param('facilityId') facilityId: string,
    @Req() request: Request
  ) {
    return {
      message: 'Full security validation passed',
      facilityId,
      userId: request['userId'],
      tenantId: request['tenantId'],
      userRole: request['userRole'],
      checks: [
        'Authentication verified',
        'Email verification confirmed',
        'Admin/Owner role validated',
        'Tenant context verified',
        'Facility access confirmed',
      ],
    };
  }
}