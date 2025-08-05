"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, UseSessionReturn } from '@/shared/hooks/useSession';

const SessionContext = createContext<UseSessionReturn | undefined>(undefined);

/**
 * Session Provider component that wraps the app and provides session context
 */
export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const sessionState = useSession();

  return (
    <SessionContext.Provider value={sessionState}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Custom hook to use the Session Context
 * Must be used within a SessionProvider
 */
export const useSessionContext = (): UseSessionReturn => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};