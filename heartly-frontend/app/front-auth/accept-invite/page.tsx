"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Card, CardBody, CardFooter, CardHeader, Input } from "@heroui/react";
import { Button } from "@heroui/react";

export default function AcceptInvitePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the token from URL
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || type !== "invite") {
      addToast({
        title: "Error",
        description: "Invalid invitation link",
        color: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      addToast({
        title: "Error",
        description: "Passwords do not match",
        color: "danger",
      });
      return;
    }

    setIsLoading(true);

    try {
      // verify the token
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "invite",
      });

      if (verifyError) throw verifyError;
      // update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      addToast({
        title: "Success",
        description: "Your account has been activated",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to confirm account",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Invalid Invitation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">{tokenError}</p>
          <div className="mt-4 text-center">
            <Button onPress={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h3>Set Your Password</h3>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Input
                    label="Password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Complete Registration"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
