"use client";

import { logger } from "@/shared/utils/logger";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

export const useAuthActions = () => {
  const signUpAction = async (formData: FormData) => {
    const email = formData.get("username")?.toString();
    const actualEmail = formData.get("actualEmail")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const companyName = formData.get("companyName")?.toString();

    console.log(email, actualEmail, password, confirmPassword, firstName, lastName, companyName);

    // Validate all required fields
    if (
      !email ||
      !actualEmail ||
      !password ||
      !firstName ||
      !lastName ||
      !confirmPassword ||
      !companyName
    ) {
      throw new Error("All fields are required");
    }

    // Validate password match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      const createdUser = await EmailPassword.signUp({
        formFields: [
          { id: "email", value: email },
          { id: "actualEmail", value: actualEmail },
          { id: "password", value: password },
          { id: "firstName", value: firstName },
          { id: "lastName", value: lastName },
          { id: "company", value: companyName },
        ],
      });

      if (createdUser.status === "FIELD_ERROR") {
        throw new Error("Invalid form fields");
      }

      if (createdUser.status === "SIGN_UP_NOT_ALLOWED") {
        throw new Error("Sign up not allowed");
      }

      logger.info("User signup completed successfully", {
        userId: createdUser.user,
        email,
      });

      return {
        message:
          "Thanks for signing up! Please check your email for a verification link.",
        status: "success",
      };
    } catch (error) {
      throw error;
    }
  };

  const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await EmailPassword.signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        throw new Error("Invalid form fields");
      }

      if (response.status === "SIGN_IN_NOT_ALLOWED") {
        throw new Error("Sign in not allowed");
      }

      if (response.status === "WRONG_CREDENTIALS_ERROR") {
        throw new Error("Invalid email or password");
      }

      return {
        message: "Signed in successfully",
        status: "success",
      };
    } catch (error) {
      throw error;
    }
  };

  const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
      return {
        message: "Email is required",
        status: "error",
      };
    }

    try {
      const response = await EmailPassword.sendPasswordResetEmail({
        formFields: [{ id: "email", value: email }],
      });

      if (response.status === "FIELD_ERROR") {
        return {
          message: "Could not reset password",
          status: "error",
        };
      }

      if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
        return {
          message: "Password reset not allowed",
          status: "error",
        };
      }

      return {
        message:
          "Check your email for a link to reset your password.",
        status: "success",
      };
    } catch (error) {
      throw error;
    }
  };

  const resetPasswordAction = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      return {
        message: "Password and confirm password are required",
        status: "error",
      };
    }

    if (password !== confirmPassword) {
      return {
        message: "Passwords do not match",
        status: "error",
      };
    }

    try {
      const response = await EmailPassword.getResetPasswordTokenFromURL();

      if (response.length === 0) {
        return {
          message: "Password update failed",
          status: "error",
        };
      }

      return {
        message: "Password updated",
        status: "success",
      };
    } catch (error) {
      throw error;
    }
  };

  const signOutAction = async () => {
    await EmailPassword.signOut();
    return {
      message: "Signed out successfully",
      status: "success",
    };
  };

  return {
    signUpAction,
    signInAction,
    forgotPasswordAction,
    resetPasswordAction,
    signOutAction,
  };
};
