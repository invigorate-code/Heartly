"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input, Button, Link, Alert } from "@heroui/react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Divider } from "@heroui/divider";
import {
  signInUser,
  SignInUserResponse,
} from "@/app/api/poc-api-using-api-util/index";
import { redirect } from "next/navigation";

export function LoginForm() {
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<SignInUserResponse>();
  const [confirmLinkSent, setConfirmLinkSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    signInUser(formData)
      .then((response) => {
        redirect("/dashboard");
      })
      .catch((error) => {
        console.dir(error);
        setError(error);
      });
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
      <Alert
        color={confirmLinkSent ? "success" : "danger"}
        description={
          error?.reason === "Email not verified"
            ? emailNotVerifiedComponent()
            : (error?.reason ?? "")
        }
        isVisible={error !== undefined}
        title={error?.status}
        variant="faded"
      />
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
        <SubmitButton pendingText="Signing In...">"Sign In"</SubmitButton>
        <Divider />
        <p className="text-center">
          Don't have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
