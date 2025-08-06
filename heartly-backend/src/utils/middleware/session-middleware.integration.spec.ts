import { SessionContextService } from '@/common/services/session-context.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { RlsContextMiddleware } from './rls-context.middleware';
import { SessionContextInitMiddleware } from './session-context-init.middleware';

// Mock SuperTokens Session
jest.mock('supertokens-node/recipe/session');

describe('Session Middleware Integration', () => {
  let rlsContextMiddleware: RlsContextMiddleware;
  let sessionContextInitMiddleware: SessionContextInitMiddleware;
  let sessionContextService: SessionContextService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(async () => {
    // Mock DataSource
    mockDataSource = {
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RlsContextMiddleware,
        SessionContextInitMiddleware,
        SessionContextService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    rlsContextMiddleware =
      module.get<RlsContextMiddleware>(RlsContextMiddleware);
    sessionContextInitMiddleware = module.get<SessionContextInitMiddleware>(
      SessionContextInitMiddleware,
    );
    sessionContextService = await module.resolve<SessionContextService>(SessionContextService);
    
    // Mock the moduleRef.resolve method to return our service instance
    jest.spyOn(sessionContextInitMiddleware['moduleRef'], 'resolve').mockResolvedValue(sessionContextService);

    // Setup mocks
    mockRequest = {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };
    mockResponse = {};
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('SessionContextInitMiddleware', () => {
    it('should initialize session context service with authenticated request', async () => {
      const mockSession = {
        getUserId: () => 'test-user-id',
        getAccessTokenPayload: () => ({
          tenantId: 'test-tenant-id',
          role: 'ADMIN',
          email: 'test@example.com',
        }),
        getHandle: () => 'test-session-handle',
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      await sessionContextInitMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(sessionContextService.isAuthenticated()).toBe(true);
      expect(sessionContextService.getUserId()).toBe('test-user-id');
    });

    it('should handle unauthenticated request gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(null);

      await sessionContextInitMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(sessionContextService.isAuthenticated()).toBe(false);
    });

    it('should handle session errors gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest
        .fn()
        .mockRejectedValue(new Error('Session error'));

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await sessionContextInitMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to initialize session context:',
        'Session error'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('RlsContextMiddleware', () => {
    it('should set database context for authenticated user', async () => {
      const mockSession = {
        getUserId: () => 'test-user-id',
        getAccessTokenPayload: () => ({
          tenantId: 'test-tenant-id',
          role: 'ADMIN',
          email: 'test@example.com',
        }),
        getHandle: () => 'test-session-handle',
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      mockDataSource.query.mockResolvedValue([]);

      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();

      // Verify database context was set
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.tenant_id', $1, true)`,
        ['test-tenant-id'],
      );
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_id', $1, true)`,
        ['test-user-id'],
      );
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_role', $1, true)`,
        ['ADMIN'],
      );
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.session_id', $1, true)`,
        ['test-session-handle'],
      );
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.ip_address', $1, true)`,
        ['127.0.0.1'],
      );
      expect(mockDataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_agent', $1, true)`,
        ['test-user-agent'],
      );
    });

    it('should handle unauthenticated request gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(null);

      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockDataSource.query).not.toHaveBeenCalled();
    });

    it('should handle session errors gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest
        .fn()
        .mockRejectedValue(new Error('Session error'));

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RLS Context Middleware error:',
        'Session error',
      );
      expect(mockDataSource.query).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle database errors gracefully', async () => {
      const mockSession = {
        getUserId: () => 'test-user-id',
        getAccessTokenPayload: () => ({
          tenantId: 'test-tenant-id',
          role: 'ADMIN',
        }),
        getHandle: () => 'test-session-handle',
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      mockDataSource.query.mockRejectedValue(new Error('Database error'));

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RLS Context Middleware error:',
        'Database error'
      );
      expect(mockNext).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should skip context setting when tenant or role missing', async () => {
      const mockSession = {
        getUserId: () => 'test-user-id',
        getAccessTokenPayload: () => ({
          // Missing tenantId or role
          email: 'test@example.com',
        }),
        getHandle: () => 'test-session-handle',
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockDataSource.query).not.toHaveBeenCalled();
    });
  });

  describe('Middleware Chain Integration', () => {
    it('should work correctly when both middlewares are chained', async () => {
      const mockSession = {
        getUserId: () => 'test-user-id',
        getAccessTokenPayload: () => ({
          tenantId: 'test-tenant-id',
          role: 'ADMIN',
          email: 'test@example.com',
        }),
        getHandle: () => 'test-session-handle',
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);
      mockDataSource.query.mockResolvedValue([]);

      // First middleware: SessionContextInitMiddleware
      await sessionContextInitMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(sessionContextService.isAuthenticated()).toBe(true);

      // Reset next mock for second middleware
      mockNext.mockClear();

      // Second middleware: RlsContextMiddleware
      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockDataSource.query).toHaveBeenCalledTimes(6); // All context variables set
    });

    it('should handle error in first middleware without affecting second', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest
        .fn()
        .mockRejectedValueOnce(new Error('Init error'))
        .mockResolvedValueOnce(null);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // First middleware with error
      await sessionContextInitMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to initialize session context:',
        'Init error'
      );

      mockNext.mockClear();

      // Second middleware should still work
      await rlsContextMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});
