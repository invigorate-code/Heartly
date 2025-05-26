"use client";

import { useAuthActions } from "@/app/(auth-pages)/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input, Button, Link, Divider, Alert } from "@heroui/react";
import { useState, Suspense } from "react";
import { EyeFilledIcon } from "@/components/icons/eye.tsx";
import { EyeSlashFilledIcon } from "@/components/icons/eyeSlash.tsx";
import { useSearchParams } from "next/navigation";
import { signUpUser } from "@/app/api/poc-api-using-api-util/auth";

const SignUpForm = () => {
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
};

function SignUpFormContent({ showPasswordText, toggleVisibility }) {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [actualEmail, setActualEmail] = useState("");
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleError = (errorMessage: string): string => {
    if (errorMessage === "This email already exists. Please sign in instead.") {
      return "This username already exists. Please sign in instead.";
    }

    switch (errorMessage) {
      case "This email already exists. Please sign in instead.":
        return "This username already exists. Please try a different username.";
      case "COMPANY_NAME_ALREADY_IN_USE":
        return "This company name already exists. Please try a different company name.";
      case "EMAIL_ALREADY_IN_USE":
        return "This email already exists. Please try a different email.";
      default:
        return errorMessage;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    const formData = {
      formFields: [
        {
          id: "firstName",
          value: firstName,
        },
        {
          id: "lastName",
          value: lastName,
        },
        {
          id: "actualEmail",
          value: actualEmail,
        },
        {
          id: "email",
          value: username,
        },
        {
          id: "company",
          value: companyName,
        },
        {
          id: "password",
          value: password,
        },
      ],
    };
    const response = await signUpUser(formData);
    console.log("response from signup page", response);
    if (response.status == "OK") {
      console.log("User created successfully from signup page");
      setStatus(response.status);
      setUser(response.user);
    } else {
      if (response.status == "FIELD_ERROR") {
        setStatus(response.status);
        setErrorMessage(response.formFields[0].error);
      } else if (response.status == "GENERAL_ERROR") {
        setStatus(response.status);
        setErrorMessage(response.message);
      }
      console.error("User creation failed from signup page");
      console.log("error response from signup page", response);
    }
  };

  if (status === "OK") {
    return (
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-2xl font-bold">Success!</p>
        <p className="text-default-600">
          You have successfully signed up. Please check your email for
          verification.
        </p>
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
      {errorMessage && <Alert color="danger" title={handleError(errorMessage)} />}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Input
            name="firstName"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Input
          name="actualEmail"
          placeholder="Email Address"
          type="email"
          value={actualEmail}
          onChange={(e) => setActualEmail(e.target.value)}
        />
        <Input
          name="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          name="companyName"
          placeholder="Organization Name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm Password"
            type={showPasswordText ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <SubmitButton pendingText={"Signing Up..."}>{"Sign Up"}</SubmitButton>
        <Divider />
        <p className="text-center">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
