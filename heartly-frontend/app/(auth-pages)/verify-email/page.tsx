"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/api/poc-api-using-api-util/auth";

function VerifyEmailFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tenantId = searchParams.get("tenantId");

  useEffect(() => {
    if (token && tenantId) {
      const verifyEmailSubmission = async () => {
        const response = await verifyEmail(token, tenantId);
        console.log("response from verify email", response);
      };
      verifyEmailSubmission();
    }
  }, [token, tenantId]);

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
      <p className="pb-2 text-2xl font-bold">Verify your email</p>
    </div>
  );
}

export default VerifyEmailFormContent;
