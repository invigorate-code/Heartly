import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UserRole } from '../api/user/entities/user.entity';
import { SuperTokensRolesService } from '../utils/supertokens/roles.service';
import { SuperTokensRolesGuard } from './supertokens-roles.guard';

jest.mock('supertokens-node/recipe/userroles');

describe('SuperTokensRolesGuard', () => {
  let guard: SuperTokensRolesGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;
  let mockSession: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperTokensRolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: SuperTokensRolesService,
          useValue: {
            // Mock the service methods if needed
          },
        },
      ],
    }).compile();

    guard = module.get<SuperTokensRolesGuard>(SuperTokensRolesGuard);
    reflector = module.get<Reflector>(Reflector);

    // Mock session
    mockSession = {
      getUserId: jest.fn().mockReturnValue('test-user-id'),
      getTenantId: jest.fn().mockResolvedValue('test-tenant-id'),
      getAccessTokenPayload: jest
        .fn()
        .mockReturnValue({ role: UserRole.STAFF }),
    };

    // Mock request
    mockRequest = {
      session: mockSession,
    };

    // Mock execution context
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should return true when user has required role', async () => {
      const requiredRoles = [UserRole.STAFF, UserRole.ADMIN];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.STAFF],
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(UserRoles.getRolesForUser).toHaveBeenCalledWith(
        'test-tenant-id',
        'test-user-id',
      );
    });

    it('should throw ForbiddenException when user lacks required role', async () => {
      const requiredRoles = [UserRole.ADMIN, UserRole.OWNER];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.STAFF],
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException(
          'User does not have required roles: ADMIN, OWNER',
        ),
      );
    });

    it('should throw UnauthorizedException when session is missing', async () => {
      const requiredRoles = [UserRole.ADMIN];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      mockRequest.session = null;

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Session not found'),
      );
    });

    it('should throw ForbiddenException when session role does not match SuperTokens roles', async () => {
      const requiredRoles = [UserRole.ADMIN];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      // User has ADMIN in SuperTokens but session shows STAFF
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.ADMIN],
      });

      mockSession.getAccessTokenPayload.mockReturnValue({
        role: UserRole.STAFF,
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException(
          'Session role does not match user roles. Please re-authenticate.',
        ),
      );
    });

    it('should handle multiple roles correctly', async () => {
      const requiredRoles = [UserRole.OWNER];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      // User has multiple roles including the required one
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.OWNER],
      });

      mockSession.getAccessTokenPayload.mockReturnValue({
        role: UserRole.OWNER,
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle errors from SuperTokens gracefully', async () => {
      const requiredRoles = [UserRole.ADMIN];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      (UserRoles.getRolesForUser as jest.Mock).mockRejectedValue(
        new Error('SuperTokens error'),
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Failed to verify user roles'),
      );
    });
  });
});
