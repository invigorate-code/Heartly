// audit-log.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserRole } from '../user/entities/user.entity';
import { CreateUserActionAuditLogDto } from './dto/create-user-action-audit-log.dto';
import { QueryUserActionAuditLogDto } from './dto/query-user-action-audit-log.dto';
import { UserActionAuditLogResDto } from './dto/user-action-audit-log.res.dto';
import { UserActionAuditLogEntity } from './entities/user-action-audit-log.entity';
import { UserActionAuditLogService } from './user-action-audit-log.service';

@ApiTags('user-action-audit-logs')
@UseGuards(SuperTokensAuthGuard)
@Controller('user-action-audit-logs')
export class UserActionAuditLogController {
  constructor(
    private readonly UserActionAuditLogService: UserActionAuditLogService,
  ) {}

  // Only ADMIN and OWNER roles can view logs
  @Get()
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async getAllLogs(
    @Query() query: QueryUserActionAuditLogDto,
    @Session() session: SessionContainer, // Optional: to access session data if needed
  ): Promise<UserActionAuditLogResDto[]> {
    return this.UserActionAuditLogService.getLogs(query, session);
  }

  // Optional: Endpoint to manually create an audit log
  @Post()
  @VerifySession({
    roles: [UserRole.ADMIN, UserRole.OWNER],
  })
  async createUserActionAuditLog(
    @Body() dto: CreateUserActionAuditLogDto,
    @Session() session: SessionContainer,
  ): Promise<UserActionAuditLogEntity> {
    return this.UserActionAuditLogService.createUserActionAuditLog(
      dto,
      session,
    );
  }

  // Endpoint to get logs by actor
  @Get('users/:userId')
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async getLogsByUser(
    @Param('userId') userId: string,
    @Query() query: QueryUserActionAuditLogDto,
    @Session() session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    return this.UserActionAuditLogService.getLogsByUser(userId, query, session);
  }

  // Endpoint to get logs by client
  @Get('clients/:clientId')
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async getLogsByClient(
    @Param('clientId') clientId: string,
    @Query() query: QueryUserActionAuditLogDto,
    @Session() session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    return this.UserActionAuditLogService.getLogsByClient(
      clientId,
      query,
      session,
    );
  }

  // Endpoint to get logs for a target user
  @Get('targets/users/:targetUserId')
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async getLogsByTargetUser(
    @Param('targetUserId') targetUserId: string,
    @Query() query: QueryUserActionAuditLogDto,
    @Session() session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    return this.UserActionAuditLogService.getLogsByTargetUser(
      targetUserId,
      query,
      session,
    );
  }

  // Endpoint to get logs by facility
  @Get('facilities/:targetFacilityId')
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async getLogsByFacility(
    @Param('targetFacilityId') targetFacilityId: string,
    @Query() query: QueryUserActionAuditLogDto,
    @Session() session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    return this.UserActionAuditLogService.getLogsByFacility(
      targetFacilityId,
      query,
      session,
    );
  }

  // Generic search endpoint: any FK filter + action/keyword
  @Get('search')
  @VerifySession({ roles: [UserRole.ADMIN, UserRole.OWNER] })
  async searchLogs(
    @Session() session: SessionContainer,
    @Query()
    params: {
      userId?: string;
      clientId?: string;
      targetUserId?: string;
      targetFacilityId?: string;
    } & QueryUserActionAuditLogDto,
  ): Promise<UserActionAuditLogResDto[]> {
    const { userId, clientId, targetUserId, targetFacilityId, ...query } =
      params;
    return this.UserActionAuditLogService.searchLogs(
      { userId, clientId, targetUserId, targetFacilityId },
      query,
      session,
    );
  }
}
