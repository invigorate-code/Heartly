"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input, Button, Link, Alert } from "@heroui/react";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Divider } from "@heroui/react";
import { signInUser, SignInUserResponse } from "@/app/api/poc-api-using-api-util/index";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [confirmLinkSent, setConfirmLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const errorMessageParser = (error: string) => {
    switch(error) {
      case "WRONG_CREDENTIALS_ERROR":
        return "Invalid username or password";
      case "EMAIL_NOT_VERIFIED_ERROR":
        return "Email not verified";
      default:
        return error;
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);

    const formData = {
      formFields: [
        {
          id: "email",
          value: username,
        },
        {
          id: "password",
          value: password,
        },
      ],
    };

    try {
      const response = await signInUser(formData);
      console.log("Login response:", response);

      // Check if user's email is verified from the login response
      if (response.user && response.user.loginMethods && response.user.loginMethods.length > 0) {
        // Find the email password login method
        const emailLoginMethod = response.user.loginMethods.find(
          (method) => method.recipeId === 'emailpassword'
        );
        
        const isEmailVerified = emailLoginMethod?.verified || false;
        console.log("Email verified from login response:", isEmailVerified);

        if (isEmailVerified) {
          router.push("/dashboard");
        } else {
          router.push("/email-verification-required");
        }
      } else {
        // This should not happen with SuperTokens, but handle gracefully
        console.error("No user login methods in response");
        router.push("/email-verification-required");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setShowPasswordText((prev) => !prev);

  const regenConfirmLink = async (email: string) => {
    // TODO: Implement this
    console.log("Regenerating confirmation link for email:", email);
    setConfirmLinkSent(true);
  };

  const emailNotVerifiedComponent = () => {
    return (
      <div>
        <p>Email not verified</p>
        {confirmLinkSent ? (
          <p>Confirmation link sent</p>
        ) : (
          <Button
            onPress={() => regenConfirmLink(username)}
            size="sm"
            variant="faded"
        >
            Regenerate Confirmation Link
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
      <p className="pb-2 text-2xl font-bold">Welcome Back</p>
      {error && <Alert
        color={confirmLinkSent ? "success" : "danger"}
        description={error === "Email not verified" ? emailNotVerifiedComponent() : ""}
        isVisible={!!error}
        title={errorMessageParser(error ?? "")}
        variant="faded"
      />}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          name="email"
          placeholder="Enter Username or Email"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          validate={(value) => {
            if (
              value.match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ) !== null
            ) {
              if (value.length < 8) {
                return "Please enter a valid email address";
              }
            }
            if (value.length < 3) {
              return "Username must be at least 3 characters long";
            }

            return value === "admin" ? "Nice try!" : null;
          }}
        />
        <Input
          endContent={
            <Button
              isIconOnly
              onPress={toggleVisibility}
              aria-label={showPasswordText ? "Hide password" : "Show password"}
            >
              <Icon
                className="pointer-events-none text-2xl text-default-400"
                icon={
                  showPasswordText
                    ? "solar:eye-closed-linear"
                    : "solar:eye-bold"
                }
              />
            </Button>
          }
          name="password"
          placeholder="Password"
          type={showPasswordText ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton pendingText="Signing In..." disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </SubmitButton>
        <Divider />
        <p className="text-center">
          Don't have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
