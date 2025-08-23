/**
 * @jest-environment jsdom
 */

import {
  getSessionPersistenceState,
  setSessionCreated,
  setRememberMe,
  updateLastActivity,
  clearSessionPersistence,
  shouldPersistSession,
  broadcastLogoutEvent,
  setupLogoutListener,
  getSessionPersistenceDebugInfo,
} from '../sessionPersistence';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: any) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(data: any) {
    // In a real test, you might want to trigger the onmessage of other instances
  }

  close() {
    // Mock close functionality
  }
}

(global as any).BroadcastChannel = MockBroadcastChannel;

describe('Session Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getSessionPersistenceState', () => {
    it('should return default state when localStorage is empty', () => {
      const state = getSessionPersistenceState();
      expect(state).toEqual({
        sessionCreated: null,
        rememberMe: false,
        lastActivity: null,
      });
    });

    it('should return stored state when localStorage has data', () => {
      const now = Date.now();
      localStorageMock.setItem('supertokens-session-created', now.toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');
      localStorageMock.setItem('supertokens-last-activity', now.toString());

      const state = getSessionPersistenceState();
      expect(state).toEqual({
        sessionCreated: now,
        rememberMe: true,
        lastActivity: now,
      });
    });
  });

  describe('setSessionCreated', () => {
    it('should set session created timestamp', () => {
      const now = Date.now();
      setSessionCreated(now);

      expect(localStorageMock.getItem('supertokens-session-created')).toBe(now.toString());
      expect(localStorageMock.getItem('supertokens-last-activity')).toBeTruthy();
    });

    it('should use current timestamp if none provided', () => {
      const beforeCall = Date.now();
      setSessionCreated();
      const afterCall = Date.now();

      const stored = parseInt(localStorageMock.getItem('supertokens-session-created')!);
      expect(stored).toBeGreaterThanOrEqual(beforeCall);
      expect(stored).toBeLessThanOrEqual(afterCall);
    });
  });

  describe('setRememberMe', () => {
    it('should set remember me flag', () => {
      setRememberMe(true);
      expect(localStorageMock.getItem('supertokens-remember-me')).toBe('true');

      setRememberMe(false);
      expect(localStorageMock.getItem('supertokens-remember-me')).toBeNull();
    });
  });

  describe('updateLastActivity', () => {
    it('should update last activity timestamp', () => {
      const now = Date.now();
      updateLastActivity(now);

      expect(localStorageMock.getItem('supertokens-last-activity')).toBe(now.toString());
    });
  });

  describe('clearSessionPersistence', () => {
    it('should clear all session data except preference', () => {
      // Set up some data
      localStorageMock.setItem('supertokens-session-created', Date.now().toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');
      localStorageMock.setItem('supertokens-last-activity', Date.now().toString());
      localStorageMock.setItem('supertokens-remember-me-preference', 'false');

      clearSessionPersistence();

      expect(localStorageMock.getItem('supertokens-session-created')).toBeNull();
      expect(localStorageMock.getItem('supertokens-remember-me')).toBeNull();
      expect(localStorageMock.getItem('supertokens-last-activity')).toBeNull();
      // Preference should still be there
      expect(localStorageMock.getItem('supertokens-remember-me-preference')).toBe('false');
    });
  });

  describe('shouldPersistSession', () => {
    it('should return false when no session data exists', () => {
      expect(shouldPersistSession()).toBe(false);
    });

    it('should return false when rememberMe is false', () => {
      const now = Date.now();
      localStorageMock.setItem('supertokens-session-created', now.toString());
      localStorageMock.setItem('supertokens-last-activity', now.toString());
      localStorageMock.setItem('supertokens-remember-me', 'false');

      expect(shouldPersistSession()).toBe(false);
    });

    it('should return true for recent active session with rememberMe', () => {
      const now = Date.now();
      localStorageMock.setItem('supertokens-session-created', now.toString());
      localStorageMock.setItem('supertokens-last-activity', now.toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');

      expect(shouldPersistSession()).toBe(true);
    });

    it('should return false for old session', () => {
      const oldTime = Date.now() - (41 * 60 * 60 * 1000); // 41 hours ago
      const now = Date.now();
      
      localStorageMock.setItem('supertokens-session-created', oldTime.toString());
      localStorageMock.setItem('supertokens-last-activity', now.toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');

      expect(shouldPersistSession()).toBe(false);
    });

    it('should return false for inactive session', () => {
      const now = Date.now();
      const oldActivity = now - (25 * 60 * 60 * 1000); // 25 hours ago
      
      localStorageMock.setItem('supertokens-session-created', now.toString());
      localStorageMock.setItem('supertokens-last-activity', oldActivity.toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');

      expect(shouldPersistSession()).toBe(false);
    });
  });

  describe('broadcastLogoutEvent', () => {
    it('should set and remove logout broadcast key', () => {
      const originalSetItem = localStorageMock.setItem;
      const originalRemoveItem = localStorageMock.removeItem;
      
      const setItemSpy = jest.fn(originalSetItem);
      const removeItemSpy = jest.fn(originalRemoveItem);
      
      localStorageMock.setItem = setItemSpy;
      localStorageMock.removeItem = removeItemSpy;

      broadcastLogoutEvent();

      expect(setItemSpy).toHaveBeenCalledWith('heartly-logout-broadcast', expect.any(String));
      expect(removeItemSpy).toHaveBeenCalledWith('heartly-logout-broadcast');

      // Restore original methods
      localStorageMock.setItem = originalSetItem;
      localStorageMock.removeItem = originalRemoveItem;
    });
  });

  describe('setupLogoutListener', () => {
    it('should call onLogout when storage event is triggered', () => {
      const onLogout = jest.fn();
      const cleanup = setupLogoutListener(onLogout);

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'heartly-logout-broadcast',
        newValue: Date.now().toString(),
      });

      window.dispatchEvent(storageEvent);

      expect(onLogout).toHaveBeenCalled();

      cleanup();
    });

    it('should not call onLogout for other storage events', () => {
      const onLogout = jest.fn();
      const cleanup = setupLogoutListener(onLogout);

      // Simulate storage event for different key
      const storageEvent = new StorageEvent('storage', {
        key: 'other-key',
        newValue: 'value',
      });

      window.dispatchEvent(storageEvent);

      expect(onLogout).not.toHaveBeenCalled();

      cleanup();
    });
  });

  describe('getSessionPersistenceDebugInfo', () => {
    it('should return comprehensive debug information', () => {
      const now = Date.now();
      localStorageMock.setItem('supertokens-session-created', now.toString());
      localStorageMock.setItem('supertokens-last-activity', now.toString());
      localStorageMock.setItem('supertokens-remember-me', 'true');

      const debugInfo = getSessionPersistenceDebugInfo();

      expect(debugInfo).toHaveProperty('state');
      expect(debugInfo).toHaveProperty('shouldPersist');
      expect(debugInfo).toHaveProperty('preference');
      expect(debugInfo).toHaveProperty('sessionAge');
      expect(debugInfo).toHaveProperty('inactivityPeriod');
      expect(debugInfo).toHaveProperty('sessionAgeHours');
      expect(debugInfo).toHaveProperty('inactivityHours');
      
      expect(debugInfo.shouldPersist).toBe(true);
      expect(debugInfo.sessionAge).toBeGreaterThanOrEqual(0);
      expect(debugInfo.inactivityPeriod).toBeGreaterThanOrEqual(0);
    });
  });
});