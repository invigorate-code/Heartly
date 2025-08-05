import Session from 'supertokens-auth-react/recipe/session';

/**
 * Utility functions for session management in the frontend
 */

export interface SessionInfo {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
}

/**
 * Get enhanced session information from access token payload
 */
export const getSessionInfo = async (): Promise<SessionInfo | null> => {
  try {
    const sessionExists = await Session.doesSessionExist();
    if (!sessionExists) {
      return null;
    }

    const userId = await Session.getUserId();
    const payload = await Session.getAccessTokenPayloadSecurely();

    if (!payload) {
      return null;
    }

    return {
      userId,
      tenantId: payload.tenantId,
      role: payload.role,
      email: payload.email,
    };
  } catch (error) {
    console.error('Failed to get session info:', error);
    return null;
  }
};

/**
 * Check if user has a specific role
 */
export const hasRole = async (role: string): Promise<boolean> => {
  const sessionInfo = await getSessionInfo();
  return sessionInfo?.role === role || false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = async (roles: string[]): Promise<boolean> => {
  const sessionInfo = await getSessionInfo();
  return sessionInfo ? roles.includes(sessionInfo.role) : false;
};

/**
 * Get current user's tenant ID
 */
export const getCurrentTenantId = async (): Promise<string | null> => {
  const sessionInfo = await getSessionInfo();
  return sessionInfo?.tenantId || null;
};

/**
 * Check if session exists and is valid
 */
export const isSessionValid = async (): Promise<boolean> => {
  try {
    return await Session.doesSessionExist();
  } catch (error) {
    console.error('Failed to check session validity:', error);
    return false;
  }
};

/**
 * Safely attempt to refresh the session
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    const refreshed = await Session.attemptRefreshingSession();
    if (refreshed) {
      // Emit custom event for session refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('supertokens-session-refreshed'));
      }
    }
    return refreshed;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return false;
  }
};

/**
 * Sign out user and clear session
 */
export const signOut = async (): Promise<void> => {
  try {
    await Session.signOut();
    
    // Emit custom event for session cleanup
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supertokens-session-expired'));
    }
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
};

/**
 * Handle session timeout
 */
export const handleSessionTimeout = (): void => {
  console.warn('Session has timed out');
  
  // Attempt to refresh session first
  refreshSession().then((refreshed) => {
    if (!refreshed) {
      // If refresh failed, sign out user
      signOut().catch(console.error);
    }
  });
};

/**
 * Set up session event listeners
 */
export const setupSessionEventListeners = (): (() => void) => {
  const handleSessionExpired = () => {
    console.log('Session expired, redirecting to login');
    signOut().catch(console.error);
  };

  const handleUnauthorized = () => {
    console.log('Unauthorized access, refreshing session');
    handleSessionTimeout();
  };

  // Add event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('supertokens-session-expired', handleSessionExpired);
    window.addEventListener('supertokens-unauthorized', handleUnauthorized);
  }

  // Return cleanup function
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('supertokens-session-expired', handleSessionExpired);
      window.removeEventListener('supertokens-unauthorized', handleUnauthorized);
    }
  };
};

/**
 * Create authenticated fetch wrapper that includes session handling
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const sessionExists = await Session.doesSessionExist();
  
  if (!sessionExists) {
    throw new Error('No valid session found');
  }

  try {
    // Make request with session handling
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important for cookie-based sessions
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle session expiry
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed) {
        // Retry request with refreshed session
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
      } else {
        // Session refresh failed, sign out user
        await signOut();
        throw new Error('Session expired and refresh failed');
      }
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch failed:', error);
    throw error;
  }
};