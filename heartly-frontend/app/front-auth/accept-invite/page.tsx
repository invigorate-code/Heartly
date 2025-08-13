"use client";

import type React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-6">
          <h1 className="text-2xl font-semibold">Accept Invitation</h1>
        </CardHeader>
        <CardBody>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-yellow-800">
              This page is being migrated from Supabase to SuperTokens authentication.
              Invitation acceptance will be available through the backend API.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}