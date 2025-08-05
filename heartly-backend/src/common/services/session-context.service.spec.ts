import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { SessionContextService } from './session-context.service';

// Mock SuperTokens Session
jest.mock('supertokens-node/recipe/session');

describe('SessionContextService', () => {
  let service: SessionContextService;
  let mockSession: jest.Mocked<SessionContainer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionContextService],
    }).compile();

    service = await module.resolve<SessionContextService>(SessionContextService);

    // Create mock session
    mockSession = {
      getUserId: jest.fn().mockReturnValue('test-user-id'),
      getAccessTokenPayload: jest.fn().mockReturnValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      }),
      getHandle: jest.fn().mockReturnValue('test-session-handle'),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeFromRequest', () => {
    it('should initialize session context with valid session', async () => {
      // Mock Session.getSession to return our mock session
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      const mockRequest = {} as Request;

      await service.initializeFromRequest(mockRequest);

      expect(service.isAuthenticated()).toBe(true);
      expect(service.getUserId()).toBe('test-user-id');
      expect(service.getTenantId()).toBe('test-tenant-id');
      expect(service.getUserRole()).toBe('ADMIN');
      expect(service.getUserEmail()).toBe('test@example.com');
      expect(service.getSessionHandle()).toBe('test-session-handle');
    });

    it('should handle null session gracefully', async () => {
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(null);

      const mockRequest = {} as Request;

      await service.initializeFromRequest(mockRequest);

      expect(service.isAuthenticated()).toBe(false);
      expect(service.getSession()).toBeNull();
      expect(service.getSessionContext()).toBeNull();
    });

    it('should handle session errors gracefully', async () => {
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockRejectedValue(new Error('Session error'));

      const mockRequest = {} as Request;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.initializeFromRequest(mockRequest);

      expect(service.isAuthenticated()).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to initialize session context:',
        'Session error'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('session context access', () => {
    beforeEach(async () => {
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);
    });

    it('should return correct session context', () => {
      const context = service.getSessionContext();

      expect(context).toEqual({
        userId: 'test-user-id',
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
        sessionHandle: 'test-session-handle',
      });
    });

    it('should return session container', () => {
      expect(service.getSession()).toBe(mockSession);
    });

    it('should validate authentication status', () => {
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('unauthenticated access', () => {
    beforeEach(async () => {
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(null);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);
    });

    it('should throw error when accessing user ID unauthenticated', () => {
      expect(() => service.getUserId()).toThrow('User not authenticated');
    });

    it('should throw error when accessing tenant ID unauthenticated', () => {
      expect(() => service.getTenantId()).toThrow('User not authenticated');
    });

    it('should throw error when accessing user role unauthenticated', () => {
      expect(() => service.getUserRole()).toThrow('User not authenticated');
    });

    it('should throw error when accessing user email unauthenticated', () => {
      expect(() => service.getUserEmail()).toThrow('User not authenticated');
    });

    it('should throw error when accessing session handle unauthenticated', () => {
      expect(() => service.getSessionHandle()).toThrow('User not authenticated');
    });
  });

  describe('role checking', () => {
    beforeEach(async () => {
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(mockSession);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);
    });

    it('should correctly check for specific role', () => {
      expect(service.hasRole('ADMIN')).toBe(true);
      expect(service.hasRole('OWNER')).toBe(false);
      expect(service.hasRole('STAFF')).toBe(false);
    });

    it('should correctly check for any of multiple roles', () => {
      expect(service.hasAnyRole(['ADMIN', 'OWNER'])).toBe(true);
      expect(service.hasAnyRole(['OWNER', 'STAFF'])).toBe(false);
      expect(service.hasAnyRole(['ADMIN'])).toBe(true);
    });

    it('should return false for role checks when unauthenticated', async () => {
      // Re-initialize with no session
      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(null);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);

      expect(service.hasRole('ADMIN')).toBe(false);
      expect(service.hasAnyRole(['ADMIN', 'OWNER'])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle missing payload fields gracefully', async () => {
      const incompleteSession = {
        getUserId: jest.fn().mockReturnValue('test-user-id'),
        getAccessTokenPayload: jest.fn().mockReturnValue({
          // Missing some fields
          tenantId: 'test-tenant-id',
        }),
        getHandle: jest.fn().mockReturnValue('test-session-handle'),
      } as any;

      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(incompleteSession);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);

      expect(service.isAuthenticated()).toBe(true);
      expect(service.getTenantId()).toBe('test-tenant-id');
      expect(service.getUserRole()).toBeUndefined();
      expect(service.getUserEmail()).toBeUndefined();
    });

    it('should handle session with undefined getUserId', async () => {
      const badSession = {
        getUserId: jest.fn().mockReturnValue(undefined),
        getAccessTokenPayload: jest.fn().mockReturnValue({}),
        getHandle: jest.fn().mockReturnValue('test-session-handle'),
      } as any;

      const Session = require('supertokens-node/recipe/session').default;
      Session.getSession = jest.fn().mockResolvedValue(badSession);

      const mockRequest = {} as Request;
      await service.initializeFromRequest(mockRequest);

      expect(service.isAuthenticated()).toBe(true);
      expect(() => service.getUserId()).not.toThrow();
    });
  });
});