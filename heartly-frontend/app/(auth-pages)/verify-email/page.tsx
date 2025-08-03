"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/app/api/poc-api-using-api-util/auth";
import { Card, CardBody, Spinner } from "@heroui/react";

function VerifyEmailFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const tenantId = searchParams.get("tenantId");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token && tenantId) {
      const verifyEmailSubmission = async () => {
        try {
          const response = await verifyEmail(token, tenantId);
          console.log("response from verify email", response);
          setStatus("success");
          setMessage(
            "Email verified successfully! Redirecting to dashboard...",
          );

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } catch (error) {
          console.error("Email verification error:", error);
          setStatus("error");
          setMessage(
            "Failed to verify email. The link may be expired or invalid.",
          );
        }
      };
      verifyEmailSubmission();
    } else {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or tenant ID.");
    }
  }, [token, tenantId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Email Verification</h1>

          {status === "loading" && (
            <div className="space-y-4">
              <Spinner size="lg" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-800">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-800">{message}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default VerifyEmailFormContent;
