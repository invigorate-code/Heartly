'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function TempPasswordChangePage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tempToken = searchParams.get('token');
    if (!tempToken) {
      toast.error('Invalid temporary password token');
      router.push('/login');
      return;
    }
    setToken(tempToken);
  }, [searchParams, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
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
      toast.error('Invalid temporary password token');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset/temp-password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempPasswordToken: token,
          newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully! Please log in with your new password.');
        router.push('/login');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your administrator has provided you with a temporary password. 
            Please create a new secure password below.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-amber-500 text-lg">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> This is a one-time password change. 
                Your temporary password will no longer work after this process.
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="flex gap-3 pb-4">
            <div className="flex flex-col">
              <p className="text-md font-semibold">🔑 Create Your New Password</p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                variant="bordered"
                size="lg"
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="bordered"
                size="lg"
              />

              <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-md">
                <p className="font-medium text-gray-800 mb-2">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character (!@#$%^&*)</li>
                  <li>Should be unique to this account</li>
                  <li>Avoid common words or personal information</li>
                </ul>
              </div>

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Set New Password
              </Button>
            </form>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                What happens next?
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Your new password will be active immediately</li>
                <li>• You'll be redirected to the login page</li>
                <li>• Use your email and new password to sign in</li>
                <li>• Your temporary password will be deactivated</li>
              </ul>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Having trouble? Contact your administrator for assistance
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}