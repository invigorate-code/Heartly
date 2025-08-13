"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  sendEmailVerificationLink,
  signOut,
  getBasicUserInfo,
} from "@/app/api/poc-api-using-api-util/auth";

export default function EmailVerificationRequired() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Get user email and verification status from backend
    const getUserInfo = async () => {
      try {
        const userInfo = await getBasicUserInfo();
        if (userInfo.email) {
          setUserEmail(userInfo.email);
        }

        // If user is actually verified, redirect to dashboard
        if (userInfo.isEmailVerified) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error getting user info:", error);
        // If we can't get user info, user is probably not logged in
        router.push("/login");
      }
    };

    getUserInfo();
  }, [router]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please try signing in again.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await sendEmailVerificationLink(userEmail);
      setIsSuccess(true);
      setMessage(
        "Verification email sent! Please check your inbox and spam folder.",
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      setMessage("Failed to send verification email. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback to manual redirect
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Email Verification Required
            </h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                You need to verify your email address before you can access the
                dashboard.
              </p>
              {userEmail && (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Email: {userEmail}
                </p>
              )}
            </div>

            {message && (
              <div
                className={`rounded-md p-4 ${
                  isSuccess
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleResendEmail}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button
                variant="light"
                size="lg"
                className="w-full"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try
                resending.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
