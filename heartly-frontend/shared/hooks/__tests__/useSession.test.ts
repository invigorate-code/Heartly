import { renderHook, act, waitFor } from '@testing-library/react';
import { useSession } from '../useSession';

// Mock SuperTokens Session
jest.mock('supertokens-auth-react/recipe/session', () => ({
  doesSessionExist: jest.fn(),
  getUserId: jest.fn(),
  getAccessTokenPayloadSecurely: jest.fn(),
  attemptRefreshingSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('useSession', () => {
  const mockSession = require('supertokens-auth-react/recipe/session');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset DOM event listeners
    Object.defineProperty(window, 'addEventListener', {
      value: jest.fn(),
      writable: true,
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn(),
      writable: true,
    });
    Object.defineProperty(window, 'dispatchEvent', {
      value: jest.fn(),
      writable: true,
    });
  });

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      mockSession.doesSessionExist.mockResolvedValue(false);
      
      const { result } = renderHook(() => useSession());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionContext).toBeNull();
    });

    it('should initialize session context when session exists', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
        sessionHandle: 'test-session-handle',
      });

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.sessionContext).toEqual({
        userId: 'test-user-id',
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
        sessionHandle: 'test-session-handle',
      });
    });

    it('should handle session initialization errors', async () => {
      mockSession.doesSessionExist.mockRejectedValue(new Error('Session error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionContext).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize session:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('role checking', () => {
    beforeEach(async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      });
    });

    it('should correctly check for specific role', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole('ADMIN')).toBe(true);
      expect(result.current.hasRole('OWNER')).toBe(false);
      expect(result.current.hasRole('STAFF')).toBe(false);
    });

    it('should correctly check for any of multiple roles', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasAnyRole(['ADMIN', 'OWNER'])).toBe(true);
      expect(result.current.hasAnyRole(['OWNER', 'STAFF'])).toBe(false);
      expect(result.current.hasAnyRole(['ADMIN'])).toBe(true);
    });

    it('should return false for role checks when not authenticated', async () => {
      mockSession.doesSessionExist.mockResolvedValue(false);
      
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasRole('ADMIN')).toBe(false);
      expect(result.current.hasAnyRole(['ADMIN', 'OWNER'])).toBe(false);
    });
  });

  describe('session refresh', () => {
    it('should refresh session successfully', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      });
      mockSession.attemptRefreshingSession.mockResolvedValue(true);

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshSession();
      });

      expect(mockSession.attemptRefreshingSession).toHaveBeenCalled();
    });

    it('should handle refresh session errors', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      });
      mockSession.attemptRefreshingSession.mockRejectedValue(new Error('Refresh failed'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshSession();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionContext).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to refresh session:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('sign out', () => {
    it('should sign out successfully', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      });
      mockSession.signOut.mockResolvedValue(undefined);

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSession.signOut).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionContext).toBeNull();
    });

    it('should handle sign out errors', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        role: 'ADMIN',
        email: 'test@example.com',
      });
      mockSession.signOut.mockRejectedValue(new Error('Sign out failed'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to sign out:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('event listeners', () => {
    it('should set up event listeners on mount', () => {
      mockSession.doesSessionExist.mockResolvedValue(false);
      
      renderHook(() => useSession());

      expect(window.addEventListener).toHaveBeenCalledWith('supertokens-session-created', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('supertokens-session-expired', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('supertokens-session-refreshed', expect.any(Function));
    });

    it('should clean up event listeners on unmount', () => {
      mockSession.doesSessionExist.mockResolvedValue(false);
      
      const { unmount } = renderHook(() => useSession());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('supertokens-session-created', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('supertokens-session-expired', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('supertokens-session-refreshed', expect.any(Function));
    });
  });

  describe('edge cases', () => {
    it('should handle missing session payload gracefully', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue(null);

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionContext).toBeNull();
    });

    it('should handle incomplete session payload', async () => {
      mockSession.doesSessionExist.mockResolvedValue(true);
      mockSession.getUserId.mockResolvedValue('test-user-id');
      mockSession.getAccessTokenPayloadSecurely.mockResolvedValue({
        tenantId: 'test-tenant-id',
        // Missing role and email
      });

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.sessionContext?.tenantId).toBe('test-tenant-id');
      expect(result.current.sessionContext?.role).toBeUndefined();
      expect(result.current.sessionContext?.email).toBeUndefined();
    });
  });
});