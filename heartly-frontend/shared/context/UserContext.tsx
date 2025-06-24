"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { getLoggedInUser } from "@/app/api/poc-api-using-api-util/auth.ts";
import { UserEntity } from "@/generated/types/UserEntity.js";

type UserContextType = {
  user: UserEntity | null;
  getUserRole: () => string | undefined;
  userDisplayName: () => string | undefined;
  isOnboardingRequired: () => boolean;
  isOnboardingCompleted: () => boolean;
  isOwner: () => boolean;
};

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider componen\
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserEntity | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Skip API call if backend URL is not configured
      if (!process.env.NEXT_PUBLIC_NEST_API_URL) {
        console.warn(
          "Backend API URL not configured. Skipping user authentication.",
        );
        setUser(null);
        return;
      }

      try {
        const res = await getLoggedInUser();
        setUser(res.userProfile);
      } catch (err) {
        console.error("Error getting logged in user:", err);
        // Don't set user data if there's an error (backend not available)
        // This allows the frontend to work without backend
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  const getUserRole = () => user?.role;
  const userDisplayName = () => user?.firstName + " " + user?.lastName;
  const isOwner = () => user?.role === "OWNER";
  const isOnboardingCompleted = () => user?.onboarding_completed_at !== null;
  const isOnboardingRequired = () => isOwner() && !isOnboardingCompleted();

  const value = {
    user,
    getUserRole,
    userDisplayName,
    isOnboardingRequired,
    isOnboardingCompleted,
    isOwner,
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
