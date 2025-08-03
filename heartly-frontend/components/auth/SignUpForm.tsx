"use client";

import { signUpAction } from "@/app/(auth-pages)/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input, Button, Link, Divider } from "@heroui/react";
import { useState, Suspense } from "react";
import { EyeFilledIcon } from "@/components/icons/eye";
import { EyeSlashFilledIcon } from "@/components/icons/eyeSlash";
import { useSearchParams } from "next/navigation";

export function SignUpForm() {
  const [showPasswordText, setShowPasswordText] = useState(false);

  const toggleVisibility = () => setShowPasswordText((prev) => !prev);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpFormContent
        showPasswordText={showPasswordText}
        toggleVisibility={toggleVisibility}
      />
    </Suspense>
  );
}

function SignUpFormContent({ showPasswordText, toggleVisibility }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  if (status === "success") {
    return (
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-2xl font-bold">Success!</p>
        <p className="text-default-600">{message}</p>
        <Link href="/login" className="mt-4">
          <Button color="primary" className="w-full text-white">
            Go to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
      <p className="pb-2 text-2xl font-bold">Get Started with Heartly</p>
      <form className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Input name="firstName" placeholder="First Name" type="text" />
          <Input name="lastName" placeholder="Last Name" type="text" />
        </div>
        <Input name="email" placeholder="Email Address" type="email" />
        <Input name="tenantName" placeholder="Organization Name" type="text" />
        <div className="flex gap-3">
          <Input
            endContent={
              <div
                onClick={toggleVisibility}
                className="cursor-pointer"
                aria-label="toggle password visibility"
              >
                {showPasswordText ? (
                  <EyeFilledIcon className="text-2xl text-default-400" />
                ) : (
                  <EyeSlashFilledIcon className="text-2xl text-default-400" />
                )}
              </div>
            }
            name="password"
            placeholder="Password"
            type={showPasswordText ? "text" : "password"}
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm Password"
            type={showPasswordText ? "text" : "password"}
          />
        </div>
        <SubmitButton pendingText={"Signing Up..."} formAction={signUpAction}>
          {"Sign Up"}
        </SubmitButton>
        <Divider />
        <p className="text-center">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
