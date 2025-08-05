import { useState, useEffect } from 'react';
import { getBasicUserInfo, BasicUserInfoResponse } from '@/app/api/poc-api-using-api-util/auth';

interface UseEmailVerificationReturn {
  isVerified: boolean | null;
  isLoading: boolean;
  error: string | null;
  userEmail: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to check if the current user's email is verified
 * Returns null for loading state, true/false for verification status
 */
export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userInfo: BasicUserInfoResponse = await getBasicUserInfo();
      
      setIsVerified(userInfo.isEmailVerified);
      setUserEmail(userInfo.email);
    } catch (err) {
      console.error('Error checking email verification status:', err);
      setError('Failed to check email verification status');
      setIsVerified(null);
      setUserEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const refetch = async () => {
    await fetchVerificationStatus();
  };

  return {
    isVerified,
    isLoading,
    error,
    userEmail,
    refetch,
  };
};

/**
 * Hook that returns a boolean indicating if the user needs email verification
 * Useful for conditional rendering
 */
export const useRequiresEmailVerification = () => {
  const { isVerified, isLoading } = useEmailVerification();
  
  // Return true if we know the user is not verified
  // Return false if verified or still loading (to avoid flash)
  return !isLoading && isVerified === false;
};