"use client";

import React from 'react';
import { Progress, Card, CardBody, Button, Chip } from '@heroui/react';
import { useOnboarding } from '@/shared/hooks/useOnboarding';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface OnboardingProgressProps {
  showNavigation?: boolean;
  showValidation?: boolean;
  className?: string;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  showNavigation = true,
  showValidation = true,
  className = '',
}) => {
  const {
    currentStep,
    onboardingState,
    availableSteps,
    isLoading,
    canGoToStep,
    goToPreviousStep,
    goToNextStep,
    getStepInfo,
    getProgressPercentage,
    validateCurrentStep,
    completeCurrentStep,
  } = useOnboarding();

  const [validation, setValidation] = React.useState<any>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isProgressing, setIsProgressing] = React.useState(false);

  const currentStepInfo = getStepInfo(currentStep);
  const progressPercentage = getProgressPercentage();

  // Validate current step when component mounts or step changes
  React.useEffect(() => {
    if (showValidation && !isLoading) {
      handleValidation();
    }
  }, [currentStep, isLoading, showValidation]);

  const handleValidation = async () => {
    if (!currentStepInfo) return;
    
    try {
      setIsValidating(true);
      const result = await validateCurrentStep();
      setValidation(result);
    } catch (error) {
      console.error('Validation failed:', error);
      setValidation({
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        canProceed: false,
        requiredActions: ['Please try again'],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    if (!validation?.canProceed) {
      await handleValidation();
      return;
    }

    try {
      setIsProgressing(true);
      
      // Complete current step first
      const completed = await completeCurrentStep();
      if (!completed) {
        console.error('Failed to complete current step');
        return;
      }

      // Move to next step
      await goToNextStep();
    } catch (error) {
      console.error('Error progressing to next step:', error);
    } finally {
      setIsProgressing(false);
    }
  };

  const handlePrevious = async () => {
    try {
      setIsProgressing(true);
      await goToPreviousStep();
    } catch (error) {
      console.error('Error going to previous step:', error);
    } finally {
      setIsProgressing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading onboarding status...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardBody className="gap-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Onboarding Progress</h3>
            <Chip 
              color={onboardingState.isComplete ? 'success' : 'primary'} 
              variant="flat"
              size="sm"
            >
              {onboardingState.isComplete ? 'Complete' : `${progressPercentage}%`}
            </Chip>
          </div>
          
          <Progress 
            value={progressPercentage} 
            color={onboardingState.isComplete ? 'success' : 'primary'}
            className="w-full"
          />
          
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {availableSteps.length}: {currentStepInfo?.title}
          </div>
        </div>

        {/* Step Information */}
        {currentStepInfo && (
          <div className="space-y-2">
            <h4 className="font-medium">{currentStepInfo.title}</h4>
            <p className="text-sm text-gray-600">{currentStepInfo.description}</p>
            
            {currentStepInfo.isRequired && (
              <Chip color="warning" variant="flat" size="sm">
                Required Step
              </Chip>
            )}
          </div>
        )}

        {/* Validation Feedback */}
        {showValidation && validation && (
          <div className="space-y-3">
            {/* Errors */}
            {validation.errors && validation.errors.length > 0 && (
              <div className="space-y-2">
                {validation.errors.map((error: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-danger text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {validation.warnings && validation.warnings.length > 0 && (
              <div className="space-y-2">
                {validation.warnings.map((warning: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-warning text-sm">
                    <InformationCircleIcon className="h-4 w-4" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Required Actions */}
            {validation.requiredActions && validation.requiredActions.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Required Actions:</div>
                {validation.requiredActions.map((action: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Success State */}
            {validation.isValid && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Step validation passed! Ready to proceed.</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="bordered"
              onPress={handlePrevious}
              disabled={currentStep === 0 || isProgressing}
              className="min-w-20"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {isValidating && (
                <div className="text-sm text-gray-500">Validating...</div>
              )}
              
              {validation && !isValidating && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleValidation}
                  className="text-xs"
                >
                  Re-validate
                </Button>
              )}
            </div>

            <Button
              color="primary"
              onPress={handleNext}
              disabled={!validation?.canProceed || isProgressing}
              isLoading={isProgressing}
              className="min-w-20"
            >
              {currentStep === availableSteps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-gray-500 pt-4 border-t">
            <summary>Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
              {JSON.stringify({ 
                currentStep, 
                onboardingState, 
                validation 
              }, null, 2)}
            </pre>
          </details>
        )}
      </CardBody>
    </Card>
  );
};