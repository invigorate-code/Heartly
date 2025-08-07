'use client';

import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import Link from 'next/link';
import { UserRole } from '@/shared/types/types';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Password Recovery
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Password reset options based on your account role
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {/* Owner Self-Service */}
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <span className="text-2xl">👑</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Facility Owner</h3>
                  <p className="text-sm text-green-600">Self-service password reset available</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>✅ You can reset your password independently</strong>
                  </p>
                  <ul className="mt-2 text-xs text-green-700 space-y-1">
                    <li>• Receive reset link via email</li>
                    <li>• Set new password immediately</li>
                    <li>• No administrator approval needed</li>
                  </ul>
                </div>
                
                <Link href="/password-reset">
                  <Button color="success" size="lg" className="w-full">
                    Reset My Password
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Admin/Staff - Managed Reset */}
          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">Admin & Staff Users</h3>
                  <p className="text-sm text-orange-600">Password reset requires administrator assistance</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-md">
                  <p className="text-sm text-orange-800">
                    <strong>🔒 For security reasons, your password must be reset by an administrator</strong>
                  </p>
                  <ul className="mt-2 text-xs text-orange-700 space-y-1">
                    <li>• Contact your facility owner or system administrator</li>
                    <li>• They will generate a temporary password for you</li>
                    <li>• You'll receive the temporary password via email</li>
                    <li>• Set your new permanent password on first login</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">How to Request a Password Reset:</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center justify-center font-bold">1</span>
                      <p>Contact your facility owner or administrator directly</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center justify-center font-bold">2</span>
                      <p>Provide your email address and reason for reset</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center justify-center font-bold">3</span>
                      <p>Wait for temporary password via email</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center justify-center font-bold">4</span>
                      <p>Log in and set your new permanent password</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Security Information */}
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Security & Compliance</h3>
                  <p className="text-sm text-blue-600">HIPAA-compliant password management</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Why role-based password reset?</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Enhanced Security:</strong> Prevents unauthorized access to sensitive patient data</li>
                  <li>• <strong>HIPAA Compliance:</strong> Maintains proper access controls for healthcare environments</li>
                  <li>• <strong>Audit Trail:</strong> All password resets are logged for compliance reviews</li>
                  <li>• <strong>Administrative Control:</strong> Facility owners maintain oversight of user access</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Login
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need technical support? Contact your system administrator or facility IT support
          </p>
        </div>
      </div>
    </div>
  );
}