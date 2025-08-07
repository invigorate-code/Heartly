// lib/api.js
import { UserEntity } from "@/generated/types/UserEntity";
import axios, { AxiosResponse } from "axios";
import { SessionContainerInterface } from "supertokens-node/lib/build/recipe/session/types";
import { User } from "supertokens-node/lib/build/types";

export type LoggedInUserResponse = {
  status: "OK";
  session: any;
  userProfile: UserEntity;
};

export type BasicUserInfoResponse = {
  status: "OK" | "UNAUTHORIZED" | "ERROR";
  userId?: string;
  email?: string;
  isEmailVerified?: boolean;
  tenantIds?: string[];
  message?: string;
};

// TODO: Implement proper auth API with SuperTokens
export const authApi = {
  getLoggedInUser: async () => {
    console.log("authApi.getLoggedInUser - needs SuperTokens implementation");
    return null;
  },
  logout: async () => {
    console.log("authApi.logout - needs SuperTokens implementation");
    return null;
  }
};

type FormField = {
  id: string;
  value: string;
};

export type SignUpUserFormFields = {
  formFields: FormField[];
};

export type SignInUserFormFields = {
  formFields: FormField[];
};

export type SignInUserResponse = {
  status: "OK" | "SIGN_IN_NOT_ALLOWED" | "WRONG_CREDENTIALS_ERROR";
  reason?: string;
  user?: User;
  session?: SessionContainerInterface;
};

const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for sending and receiving cookies (like SuperTokens session cookies)
  timeout: 5000, // 5 second timeout
});

// Add response interceptor to handle network errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
      console.warn(
        "Backend server is not available. Frontend will work in offline mode.",
      );
    }
    return Promise.reject(error);
  },
);

// --- Auth Endpoints ---
export const testAuth = async (): Promise<string | null | unknown> => {
  return new Promise((resolve, reject) => {
    api
      .get("/api/auth/")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error getting logged in user:", error);
        reject(error);
      });
  });
};

export const signInUser = async (
  formFields: SignInUserFormFields,
): Promise<SignInUserResponse> => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/signin", formFields)
      .then((response: AxiosResponse<SignInUserResponse>) => {
        console.log("response from auth api", response);
        if (response.data.status.toString() === "OK") {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        console.error("Error signing in user:", error);
        reject(error);
      });
  });
};

export const signUpUser = async (
  formFields: SignUpUserFormFields,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/signup", formFields)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error signing up user:", error);
        reject(error);
      });
  });
};

export const getLoggedInUser = async (): Promise<LoggedInUserResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      // First check if user is verified using getBasicUserInfo
      const basicInfo = await getBasicUserInfo();
      
      if (basicInfo.status !== "OK") {
        reject(new Error("User not authenticated"));
        return;
      }
      
      if (!basicInfo.isEmailVerified) {
        reject(new Error("Email not verified - cannot get full user session"));
        return;
      }
      
      // User is verified, safe to call getUserSession
      api
        .post("/api/auth/getUserSession")
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("Error getting logged in user:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Error checking user verification status:", error);
      reject(error);
    }
  });
};

export const getBasicUserInfo = async (): Promise<BasicUserInfoResponse> => {
  return new Promise((resolve, reject) => {
    api
      .post("/api/auth/getBasicUserInfo")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error getting basic user info:", error);
        reject(error);
      });
  });
};

// Note: The NestJS '/auth/user/:userId' endpoint with role-based authentication
// typically involves a DELETE request to remove a user. The frontend call
// would likely look like this:
export const deleteUser = async (userId) => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/api/auth/user/${userId}`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error deleting user:", error);
        reject(error);
      });
  });
};

export const getUserProfile = async () => {
  return new Promise((resolve, reject) => {
    api
      .get("/api/auth/user/profile")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error getting user profile:", error);
        reject(error);
      });
  });
};

export const createResetPasswordLink = async (userId, email) => {
  return new Promise((resolve, reject) => {
    api
      .post("/api/auth/reset-password", {
        userId,
        email,
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error creating reset password link:", error);
        reject(error);
      });
  });
};

export const sendEmailVerificationLink = async (email: string) => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/send-email-verification-link", { email })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error sending email verification link:", error);
        reject(error);
      });
  });
};

export const verifyEmail = async (token: string, tenantId: string) => {
  return new Promise((resolve, reject) => {
    api
      .post("/api/auth/verify-email", { token, tenantId })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error verifying email:", error);
        reject(error);
      });
  });
};

export const signOut = async () => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/signOut")
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("Error signing out:", error);
        reject(error);
      });
  });
};
