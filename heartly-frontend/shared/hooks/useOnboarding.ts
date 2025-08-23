"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from './useSession';
import { validateFacilitiesStep } from '@/shared/lib/onboarding/facilitiesValidation';

export interface OnboardingStep {
  id: number;
  name: string;
  title: string;
  description: string;
  path: string;
  isRequired: boolean;
  validationFn: () => Promise<OnboardingStepValidation>;
}

export interface OnboardingStepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
  requiredActions: string[];
}

export interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  isComplete: boolean;
  lastUpdated: Date | null;
}

export interface UseOnboardingReturn {
  // State
  currentStep: number;
  onboardingState: OnboardingState;
  availableSteps: OnboardingStep[];
  isLoading: boolean;
  
  // Navigation
  canGoToStep: (stepId: number) => boolean;
  goToStep: (stepId: number) => Promise<boolean>;
  goToNextStep: () => Promise<boolean>;
  goToPreviousStep: () => Promise<boolean>;
  
  // Validation
  validateCurrentStep: () => Promise<OnboardingStepValidation>;
  completeCurrentStep: () => Promise<boolean>;
  
  // Persistence
  saveProgress: () => Promise<boolean>;
  refreshOnboardingState: () => Promise<void>;
  
  // Completion
  completeOnboarding: () => Promise<boolean>;
  
  // Utility
  getStepInfo: (stepId: number) => OnboardingStep | null;
  getProgressPercentage: () => number;
}

/**
 * Onboarding step definitions for ARF/ARTF facility setup
 * Based on healthcare compliance requirements and user workflow
 */
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 0,
    name: 'facilities',
    title: 'Facility Setup',
    description: 'Add and configure your care facilities',
    path: '/onboarding/facilities',
    isRequired: true,
    validationFn: async () => {
      const result = await validateFacilitiesStep();
      return {
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings,
        canProceed: result.canProceed,
        requiredActions: result.requiredActions,
      };
    },
  },
  {
    id: 1,
    name: 'staff-invite',
    title: 'Staff Invitations',
    description: 'Invite staff members to your facilities',
    path: '/onboarding/staff-invite',
    isRequired: true,
    validationFn: async () => {
      return {
        isValid: false,
        errors: [],
        warnings: [],
        canProceed: false,
        requiredActions: ['Complete staff setup'],
      };
    },
  },
];

/**
 * Custom hook for managing onboarding flow state and navigation
 * Provides comprehensive onboarding management for healthcare facilities
 */
export const useOnboarding = (): UseOnboardingReturn => {
  const router = useRouter();
  const { sessionContext, isAuthenticated } = useSession();
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 0,
    completedSteps: [],
    totalSteps: ONBOARDING_STEPS.length,
    isComplete: false,
    lastUpdated: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial onboarding state from backend
  const refreshOnboardingState = useCallback(async () => {
    if (!isAuthenticated || !sessionContext?.userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Call backend API to get user's current onboarding state
      const response = await fetch('/api/user/onboarding-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        const newState: OnboardingState = {
          currentStep: data.onboarding_step || 0,
          completedSteps: data.completed_steps || [],
          totalSteps: ONBOARDING_STEPS.length,
          isComplete: data.onboarding_completed_at != null,
          lastUpdated: data.onboarding_completed_at ? new Date(data.onboarding_completed_at) : null,
        };
        
        setOnboardingState(newState);
        setCurrentStep(newState.currentStep);
        
        console.log('Onboarding state loaded:', newState);
      } else {
        console.warn('Failed to load onboarding state:', response.statusText);
        // Use default state
        setOnboardingState({
          currentStep: 0,
          completedSteps: [],
          totalSteps: ONBOARDING_STEPS.length,
          isComplete: false,
          lastUpdated: null,
        });
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      // Use default state on error
      setOnboardingState({
        currentStep: 0,
        completedSteps: [],
        totalSteps: ONBOARDING_STEPS.length,
        isComplete: false,
        lastUpdated: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, sessionContext?.userId]);

  // Initialize onboarding state on mount
  useEffect(() => {
    refreshOnboardingState();
  }, [refreshOnboardingState]);

  // Save progress to backend
  const saveProgress = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !sessionContext?.userId) {
      return false;
    }

    try {
      const response = await fetch('/api/user/onboarding-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboarding_step: currentStep,
          completed_steps: onboardingState.completedSteps,
        }),
      });

      if (response.ok) {
        console.log('Onboarding progress saved successfully');
        return true;
      } else {
        console.error('Failed to save onboarding progress:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      return false;
    }
  }, [currentStep, onboardingState.completedSteps, isAuthenticated, sessionContext?.userId]);

  // Check if user can navigate to a specific step
  const canGoToStep = useCallback((stepId: number): boolean => {
    // Can always go to current step or any completed step
    if (stepId === currentStep || onboardingState.completedSteps.includes(stepId)) {
      return true;
    }
    
    // Can go to next step only if current step is completed
    if (stepId === currentStep + 1 && onboardingState.completedSteps.includes(currentStep)) {
      return true;
    }
    
    // Can go backwards if step exists
    if (stepId < currentStep && stepId >= 0) {
      return true;
    }
    
    return false;
  }, [currentStep, onboardingState.completedSteps]);

  // Navigate to specific step
  const goToStep = useCallback(async (stepId: number): Promise<boolean> => {
    if (!canGoToStep(stepId) || stepId < 0 || stepId >= ONBOARDING_STEPS.length) {
      console.warn(`Cannot navigate to step ${stepId}`);
      return false;
    }

    const step = ONBOARDING_STEPS[stepId];
    setCurrentStep(stepId);
    
    // Update state
    setOnboardingState(prev => ({
      ...prev,
      currentStep: stepId,
    }));

    // Save progress and navigate
    await saveProgress();
    router.push(step.path);
    return true;
  }, [canGoToStep, saveProgress, router]);

  // Navigate to next step
  const goToNextStep = useCallback(async (): Promise<boolean> => {
    const nextStep = currentStep + 1;
    if (nextStep >= ONBOARDING_STEPS.length) {
      // Try to complete onboarding
      return await completeOnboarding();
    }
    
    return await goToStep(nextStep);
  }, [currentStep, goToStep]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(async (): Promise<boolean> => {
    const previousStep = currentStep - 1;
    return await goToStep(previousStep);
  }, [currentStep, goToStep]);

  // Validate current step (to be overridden by specific step implementations)
  const validateCurrentStep = useCallback(async (): Promise<OnboardingStepValidation> => {
    const step = ONBOARDING_STEPS[currentStep];
    if (!step) {
      return {
        isValid: false,
        errors: ['Invalid step'],
        warnings: [],
        canProceed: false,
        requiredActions: [],
      };
    }

    return await step.validationFn();
  }, [currentStep]);

  // Mark current step as completed
  const completeCurrentStep = useCallback(async (): Promise<boolean> => {
    const validation = await validateCurrentStep();
    
    if (!validation.canProceed) {
      console.warn('Cannot complete current step:', validation.errors);
      return false;
    }

    const newCompletedSteps = [...onboardingState.completedSteps];
    if (!newCompletedSteps.includes(currentStep)) {
      newCompletedSteps.push(currentStep);
    }

    setOnboardingState(prev => ({
      ...prev,
      completedSteps: newCompletedSteps,
    }));

    const success = await saveProgress();
    
    if (success) {
      console.log(`Step ${currentStep} completed successfully`);
    }
    
    return success;
  }, [validateCurrentStep, currentStep, onboardingState.completedSteps, saveProgress]);

  // Complete entire onboarding process
  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setOnboardingState(prev => ({
          ...prev,
          isComplete: true,
          lastUpdated: new Date(),
        }));

        console.log('Onboarding completed successfully');
        
        // Redirect to dashboard
        router.push('/dashboard');
        return true;
      } else {
        console.error('Failed to complete onboarding:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [router]);

  // Get step information
  const getStepInfo = useCallback((stepId: number): OnboardingStep | null => {
    return ONBOARDING_STEPS.find(step => step.id === stepId) || null;
  }, []);

  // Calculate progress percentage
  const getProgressPercentage = useCallback((): number => {
    const completedCount = onboardingState.completedSteps.length;
    const totalCount = ONBOARDING_STEPS.length;
    return Math.round((completedCount / totalCount) * 100);
  }, [onboardingState.completedSteps]);

  return {
    // State
    currentStep,
    onboardingState,
    availableSteps: ONBOARDING_STEPS,
    isLoading,
    
    // Navigation
    canGoToStep,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    
    // Validation
    validateCurrentStep,
    completeCurrentStep,
    
    // Persistence
    saveProgress,
    refreshOnboardingState,
    
    // Completion
    completeOnboarding,
    
    // Utility
    getStepInfo,
    getProgressPercentage,
  };
};