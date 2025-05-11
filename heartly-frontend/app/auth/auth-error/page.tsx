"use client";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Button } from "@heroui/react";

import { CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full max-w-md">
          <CardHeader>
            <p className="text-center text-red-600">Authentication Error</p>
          </CardHeader>
          <CardBody>
            <p className="text-center">
              There was a problem with your authentication request. The link may
              have expired or is invalid.
            </p>
          </CardBody>
          <CardFooter className="flex justify-center">
            <Button onPress={() => router.push("/auth/login")}>
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
