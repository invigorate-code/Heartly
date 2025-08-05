"use client";
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@heroui/react';

interface RememberMeCheckboxProps {
  onRememberMeChange?: (rememberMe: boolean) => void;
  defaultChecked?: boolean;
}

/**
 * Remember Me checkbox component for login forms
 * Handles localStorage persistence of remember me preference
 */
export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
  onRememberMeChange,
  defaultChecked = true, // Default to true for better UX
}) => {
  const [rememberMe, setRememberMe] = useState(defaultChecked);

  // Load saved preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('supertokens-remember-me-preference');
      const shouldRemember = savedPreference === 'true' || (savedPreference === null && defaultChecked);
      setRememberMe(shouldRemember);
      onRememberMeChange?.(shouldRemember);
    }
  }, [defaultChecked, onRememberMeChange]);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('supertokens-remember-me-preference', checked.toString());
      
      // Set the actual remember me flag for session creation
      if (checked) {
        localStorage.setItem('supertokens-remember-me', 'true');
      } else {
        localStorage.removeItem('supertokens-remember-me');
      }
    }
    
    onRememberMeChange?.(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        isSelected={rememberMe}
        onValueChange={handleRememberMeChange}
        size="sm"
        color="primary"
        classNames={{
          base: "inline-flex max-w-md w-full bg-content1 m-0",
          label: "text-small text-foreground-600",
        }}
      >
        Keep me signed in
      </Checkbox>
      <div className="text-xs text-foreground-400 ml-2">
        (Recommended for personal devices)
      </div>
    </div>
  );
};