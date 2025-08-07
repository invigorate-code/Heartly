'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // If token is present in URL, show reset form
  useState(() => {
    if (token) {
      setStep('reset');
    }
  });

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset/owner/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Password reset link sent to your email!');
        setStep('reset');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset/owner/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password reset successfully! Please log in with your new password.');
        router.push('/login');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {step === 'request' ? 'Reset Your Password' : 'Set New Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'request' 
              ? 'Enter your email to receive a password reset link' 
              : 'Create a new secure password for your account'
            }
          </p>
          
          {step === 'request' && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Only OWNER users can reset their own passwords. 
                ADMIN and STAFF users must contact their facility owner for password resets.
              </p>
            </div>
          )}
        </div>

        <Card className="shadow-lg">
          <CardHeader className="flex gap-3 pb-4">
            <div className="flex flex-col">
              <p className="text-md font-semibold">
                {step === 'request' ? '🔐 Password Reset Request' : '🔑 New Password'}
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {step === 'request' ? (
              <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="bordered"
                  size="lg"
                />

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  variant="bordered"
                  size="lg"
                />

                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  variant="bordered"
                  size="lg"
                />

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p><strong>Password Requirements:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Mix of uppercase and lowercase letters</li>
                    <li>Include numbers and special characters</li>
                    <li>Should be unique to this account</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!token}
                >
                  Reset Password
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Login
              </Link>
            </div>

            {step === 'request' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Need help? Contact your system administrator
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            For security purposes, password reset links expire after 1 hour
          </p>
        </div>
      </div>
    </div>
  );
}