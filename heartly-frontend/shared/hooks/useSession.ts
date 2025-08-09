"use client";
import { useState, useEffect, useCallback } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { 
  updateLastActivity, 
  shouldPersistSession, 
  clearSessionPersistence,
  initializeSessionPersistence,
  setupLogoutListener,
  broadcastLogoutEvent
} from '@/shared/lib/auth/sessionPersistence';

export interface SessionContext {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
  sessionHandle: string;
}

export interface UseSessionReturn {
  session: any; // SuperTokens session object
  sessionContext: SessionContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
  signOutAllSessions: () => Promise<void>;
}

/**
 * Custom hook for managing SuperTokens session state and context
 * Provides access to enhanced session data including tenant context
 */
export const useSession = (): UseSessionReturn => {
  const [session, setSession] = useState<any>(null);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and context
  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if session should persist based on user activity and preferences
      if (!shouldPersistSession()) {
        clearSessionPersistence();
      }
      
      // Check if session exists
      const sessionExists = await Session.doesSessionExist();
      
      if (sessionExists) {
        // Update activity timestamp for session persistence
        updateLastActivity();
        
        // Get session access token payload
        const accessTokenPayload = await Session.getAccessTokenPayloadSecurely();
        
        // Extract enhanced session context from payload
        if (accessTokenPayload) {
          const userId = await Session.getUserId();
          
          setSessionContext({
            userId,
            tenantId: accessTokenPayload.tenantId,
            role: accessTokenPayload.role,
            email: accessTokenPayload.email,
            sessionHandle: accessTokenPayload.sessionHandle || 'unknown',
          });
          
          setSession({
            userId,
            accessTokenPayload,
          });
        }
      } else {
        // Clear session persistence data if no session exists
        clearSessionPersistence();
        setSession(null);
        setSessionContext(null);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
      clearSessionPersistence();
      setSession(null);
      setSessionContext(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh session data
  const refreshSession = useCallback(async () => {
    try {
      await Session.attemptRefreshingSession();
      await initializeSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setSession(null);
      setSessionContext(null);
    }
  }, [initializeSession]);

  // Sign out user from current session
  const signOut = useCallback(async () => {
    try {
      console.log('Initiating logout for current session...');
      
      // Call backend logout endpoint for audit logging
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Backend logout successful:', result);
        }
      } catch (backendError) {
        console.warn('Backend logout call failed, proceeding with client logout:', backendError);
      }

      // Sign out from SuperTokens
      await Session.signOut();
      
      // Clear persistence data and broadcast to other tabs
      clearSessionPersistence();
      
      // Clear local state
      setSession(null);
      setSessionContext(null);
      
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Failed to sign out:', error);
      
      // Even if sign out fails, clear local state
      clearSessionPersistence();
      setSession(null);
      setSessionContext(null);
    }
  }, []);

  // Sign out user from all sessions
  const signOutAllSessions = useCallback(async () => {
    try {
      console.log('Initiating logout for all sessions...');
      
      // Call backend logout-all-sessions endpoint
      try {
        const response = await fetch('/api/auth/logout-all-sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Backend logout all sessions successful:', result);
        }
      } catch (backendError) {
        console.warn('Backend logout all sessions call failed, proceeding with client logout:', backendError);
      }

      // Sign out from SuperTokens (this will invalidate current session)
      await Session.signOut();
      
      // Clear persistence data and broadcast to other tabs
      clearSessionPersistence();
      
      // Clear local state
      setSession(null);
      setSessionContext(null);
      
      console.log('Logout all sessions completed successfully');
    } catch (error) {
      console.error('Failed to sign out from all sessions:', error);
      
      // Even if sign out fails, clear local state
      clearSessionPersistence();
      setSession(null);
      setSessionContext(null);
    }
  }, []);

  // Role checking functions
  const hasRole = useCallback((role: string): boolean => {
    return sessionContext?.role === role;
  }, [sessionContext]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return sessionContext ? roles.includes(sessionContext.role) : false;
  }, [sessionContext]);

  // Initialize on mount and listen for session changes
  useEffect(() => {
    // Initialize session persistence system
    initializeSessionPersistence();
    
    // Initialize session
    initializeSession();

    // Listen for session changes
    const handleSessionChange = () => {
      initializeSession();
    };

    // Handle logout events from other tabs
    const handleCrossTabLogout = () => {
      console.log('Cross-tab logout detected, clearing session state');
      setSession(null);
      setSessionContext(null);
    };

    // Set up cross-tab logout listener
    const cleanupLogoutListener = setupLogoutListener(handleCrossTabLogout);

    // Add event listeners for session changes
    window.addEventListener('supertokens-session-created', handleSessionChange);
    window.addEventListener('supertokens-session-expired', handleSessionChange);
    window.addEventListener('supertokens-session-refreshed', handleSessionChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('supertokens-session-created', handleSessionChange);
      window.removeEventListener('supertokens-session-expired', handleSessionChange);
      window.removeEventListener('supertokens-session-refreshed', handleSessionChange);
      cleanupLogoutListener();
    };
  }, [initializeSession]);

  return {
    session,
    sessionContext,
    isLoading,
    isAuthenticated: session !== null && sessionContext !== null,
    hasRole,
    hasAnyRole,
    refreshSession,
    signOut,
    signOutAllSessions,
  };
};