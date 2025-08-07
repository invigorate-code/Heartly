"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { getLoggedInUser } from "@/app/api/poc-api-using-api-util/auth";
import { UserEntity } from "@/generated/types/UserEntity.js";
import { useSessionContext } from "./SessionContext";

type UserContextType = {
  user: UserEntity | null;
  getUserRole: () => string | undefined;
  userDisplayName: () => string | undefined;
  isOnboardingRequired: () => boolean;
  isOnboardingCompleted: () => boolean;
  isOwner: () => boolean;
  getUserId: () => string | undefined;
  getTenantId: () => string | undefined;
  getUserEmail: () => string | undefined;
  isLoading: boolean;
};

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { sessionContext, isAuthenticated } = useSessionContext();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !sessionContext) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await getLoggedInUser();
        setUser(res.userProfile);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, sessionContext]);

  const getUserRole = () => user?.role || sessionContext?.role;
  const userDisplayName = () => user?.firstName + " " + user?.lastName;
  const isOwner = () => (user?.role || sessionContext?.role) === "OWNER";
  const isOnboardingCompleted = () => user?.onboarding_completed_at !== null;
  const isOnboardingRequired = () => isOwner() && !isOnboardingCompleted();
  
  // New session-based getters
  const getUserId = () => user?.id || sessionContext?.userId;
  const getTenantId = () => sessionContext?.tenantId;
  const getUserEmail = () => user?.email || sessionContext?.email;

  const value = {
    user,
    getUserRole,
    userDisplayName,
    isOnboardingRequired,
    isOnboardingCompleted,
    isOwner,
    getUserId,
    getTenantId,
    getUserEmail,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
