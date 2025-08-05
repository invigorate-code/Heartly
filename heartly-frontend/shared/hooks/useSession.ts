"use client";
import { useState, useEffect, useCallback } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { 
  updateLastActivity, 
  shouldPersistSession, 
  clearSessionPersistence,
  initializeSessionPersistence 
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

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      await Session.signOut();
      clearSessionPersistence(); // Clear persistence data on sign out
      setSession(null);
      setSessionContext(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      clearSessionPersistence(); // Clear even if sign out fails
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

    // Add event listeners for session changes
    window.addEventListener('supertokens-session-created', handleSessionChange);
    window.addEventListener('supertokens-session-expired', handleSessionChange);
    window.addEventListener('supertokens-session-refreshed', handleSessionChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('supertokens-session-created', handleSessionChange);
      window.removeEventListener('supertokens-session-expired', handleSessionChange);
      window.removeEventListener('supertokens-session-refreshed', handleSessionChange);
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
  };
};