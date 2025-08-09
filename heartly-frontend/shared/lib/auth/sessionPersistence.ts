/**
 * Session persistence utilities for managing browser session state
 */

export interface SessionPersistenceState {
  sessionCreated: number | null;
  rememberMe: boolean;
  lastActivity: number | null;
}

/**
 * Keys for localStorage
 */
const STORAGE_KEYS = {
  SESSION_CREATED: 'supertokens-session-created',
  REMEMBER_ME: 'supertokens-remember-me',
  REMEMBER_ME_PREFERENCE: 'supertokens-remember-me-preference',
  LAST_ACTIVITY: 'supertokens-last-activity',
} as const;

/**
 * Get session persistence state from localStorage
 */
export const getSessionPersistenceState = (): SessionPersistenceState => {
  if (typeof window === 'undefined') {
    return {
      sessionCreated: null,
      rememberMe: false,
      lastActivity: null,
    };
  }

  return {
    sessionCreated: parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_CREATED) || '0') || null,
    rememberMe: localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true',
    lastActivity: parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || '0') || null,
  };
};

/**
 * Set session created timestamp
 */
export const setSessionCreated = (timestamp: number = Date.now()): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SESSION_CREATED, timestamp.toString());
    updateLastActivity();
  }
};

/**
 * Set remember me flag
 */
export const setRememberMe = (rememberMe: boolean): void => {
  if (typeof window !== 'undefined') {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  }
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = (timestamp: number = Date.now()): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, timestamp.toString());
  }
};

/**
 * Clear all session persistence data
 */
export const clearSessionPersistence = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SESSION_CREATED);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    // Don't clear preference - user's choice should persist across sessions
    
    // Broadcast logout event to other tabs/windows
    broadcastLogoutEvent();
  }
};

/**
 * Broadcast logout event to other tabs/windows
 */
export const broadcastLogoutEvent = (): void => {
  if (typeof window !== 'undefined') {
    // Use localStorage event to communicate between tabs
    localStorage.setItem('heartly-logout-broadcast', Date.now().toString());
    localStorage.removeItem('heartly-logout-broadcast');
    
    // Also use BroadcastChannel API if available
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('heartly-auth');
      channel.postMessage({ type: 'LOGOUT', timestamp: Date.now() });
      channel.close();
    }
  }
};

/**
 * Listen for logout events from other tabs/windows
 */
export const setupLogoutListener = (onLogout: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Listen for localStorage changes (works across tabs)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'heartly-logout-broadcast') {
      console.log('Logout event received from another tab');
      onLogout();
    }
  };

  // Listen for BroadcastChannel messages
  let channel: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel('heartly-auth');
    channel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        console.log('Logout event received via BroadcastChannel');
        onLogout();
      }
    };
  }

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    if (channel) {
      channel.close();
    }
  };
};

/**
 * Check if session should persist based on user preference and activity
 */
export const shouldPersistSession = (): boolean => {
  const state = getSessionPersistenceState();
  
  if (!state.rememberMe || !state.sessionCreated || !state.lastActivity) {
    return false;
  }

  // Check if session is too old (max 40 hours as per backend config)
  const sessionAge = Date.now() - state.sessionCreated;
  const maxSessionAge = 40 * 60 * 60 * 1000; // 40 hours in milliseconds
  
  if (sessionAge > maxSessionAge) {
    return false;
  }

  // Check if user has been inactive too long (max 24 hours)
  const inactivityPeriod = Date.now() - state.lastActivity;
  const maxInactivity = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (inactivityPeriod > maxInactivity) {
    return false;
  }

  return true;
};

/**
 * Get user's remember me preference
 */
export const getRememberMePreference = (): boolean => {
  if (typeof window === 'undefined') {
    return true; // Default to true
  }
  
  const preference = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME_PREFERENCE);
  return preference === null ? true : preference === 'true';
};

/**
 * Set user's remember me preference
 */
export const setRememberMePreference = (preference: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME_PREFERENCE, preference.toString());
  }
};

/**
 * Set up activity tracking to update last activity timestamp
 */
export const setupActivityTracking = (): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  let activityTimeout: NodeJS.Timeout | null = null;

  const handleActivity = () => {
    // Debounce activity updates to avoid excessive localStorage writes
    if (activityTimeout) {
      clearTimeout(activityTimeout);
    }
    
    activityTimeout = setTimeout(() => {
      updateLastActivity();
    }, 30000); // Update every 30 seconds at most
  };

  // Add event listeners
  activityEvents.forEach(event => {
    window.addEventListener(event, handleActivity, { passive: true });
  });

  // Initial activity update
  handleActivity();

  // Return cleanup function
  return () => {
    if (activityTimeout) {
      clearTimeout(activityTimeout);
    }
    
    activityEvents.forEach(event => {
      window.removeEventListener(event, handleActivity);
    });
  };
};

/**
 * Initialize session persistence on app startup
 */
export const initializeSessionPersistence = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Clean up old session data if it shouldn't persist
  if (!shouldPersistSession()) {
    clearSessionPersistence();
  }

  // Set up activity tracking
  setupActivityTracking();

  // Listen for page visibility changes to update activity
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      updateLastActivity();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Listen for beforeunload to save final activity timestamp
  const handleBeforeUnload = () => {
    updateLastActivity();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
};

/**
 * Session persistence debug information
 */
export const getSessionPersistenceDebugInfo = () => {
  const state = getSessionPersistenceState();
  const shouldPersist = shouldPersistSession();
  const preference = getRememberMePreference();

  return {
    state,
    shouldPersist,
    preference,
    sessionAge: state.sessionCreated ? Date.now() - state.sessionCreated : null,
    inactivityPeriod: state.lastActivity ? Date.now() - state.lastActivity : null,
    sessionAgeHours: state.sessionCreated ? (Date.now() - state.sessionCreated) / (1000 * 60 * 60) : null,
    inactivityHours: state.lastActivity ? (Date.now() - state.lastActivity) / (1000 * 60 * 60) : null,
  };
};