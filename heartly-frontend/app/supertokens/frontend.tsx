import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";

export const frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo: {
      appName: "heartly",
      apiDomain: "http://localhost:3001",
      websiteDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        // Define exactly these fields on your sign‑up form:
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "firstName",
                label: "First Name",
                placeholder: "Your first name",
                validate: async (value) => {
                  if (!value) return "First name is required";
                },
              },
              {
                id: "lastName",
                label: "Last Name",
                placeholder: "Your last name",
                validate: async (value) => {
                  if (!value) return "Last name is required";
                },
              },
              {
                id: "email", // this is your “username” field
                label: "Username",
                placeholder: "Choose a username",
                validate: async (value) => {
                  if (typeof value !== "string") {
                    return "Please provide a string input.";
                  }

                  // first we check for if it's an email
                  if (
                    value.match(
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ) !== null
                  ) {
                    return undefined;
                  }

                  // since it's not an email, we check for if it's a correct username
                  if (value.length < 3) {
                    return "Usernames must be at least 3 characters long.";
                  }
                  if (!value.match(/^[a-z0-9_-]+$/)) {
                    return "Username must contain only alphanumeric, underscore or hyphen characters.";
                  }
                },
              },
              {
                id: "actualEmail", // your optional real email
                label: "Email (optional)",
                placeholder: "For password resets",
                optional: true,
                validate: async (value) => {
                  if (value === "") {
                    // this means that the user did not provide an email
                    return undefined;
                  }
                  if (
                    value.match(
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ) === null
                  ) {
                    return "Email is invalid";
                  }
                },
              },
              {
                id: "company",
                label: "Company",
                placeholder: "Your company name",
                validate: async (value) => {
                  if (!value) return "Company is required";
                },
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Create a password",
                validate: async (value) => {
                  if (value.length < 8) {
                    return "Password must be 8+ characters";
                  }
                },
              },
            ],
          },
        },
      }), // initializes signin / sign up features
      Session.init({
        tokenTransferMethod: "cookie",
        // Configure session persistence settings to match backend
        sessionExpiredStatusCode: 401,
        invalidClaimStatusCode: 403,
        autoAddCredentials: true, // Automatically include credentials in requests
        // Enable pre-API hooks for session handling
        preAPIHook: async (context) => {
          // Add any headers or modifications before API calls
          return context;
        },
        onHandleEvent: (context) => {
          // Handle session events for better UX
          if (context.action === "SESSION_CREATED") {
            console.log("Session created successfully");
            // Store session creation timestamp for persistence tracking
            if (typeof window !== 'undefined') {
              localStorage.setItem('supertokens-session-created', Date.now().toString());
              window.dispatchEvent(new CustomEvent('supertokens-session-created'));
            }
          } else if (context.action === "SIGN_OUT") {
            console.log("User signed out");
            // Clear session persistence data
            if (typeof window !== 'undefined') {
              localStorage.removeItem('supertokens-session-created');
              localStorage.removeItem('supertokens-remember-me');
              window.dispatchEvent(new CustomEvent('supertokens-session-expired'));
            }
          } else if (context.action === "REFRESH_SESSION") {
            console.log("Session refreshed");
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('supertokens-session-refreshed'));
            }
          } else if (context.action === "UNAUTHORISED") {
            console.log("Unauthorized access - session may have expired");
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('supertokens-unauthorized'));
            }
          }
        },
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              // TODO: Override session refresh when SuperTokens API supports it
              // The refresh method may not be available in the current version
              // TODO: Add session persistence checking when API is available
            };
          },
        },
      }), // initializes session features with enhanced handling and persistence
      EmailVerification.init({
        mode: "REQUIRED", // or "OPTIONAL"
      }),
    ],
  };
};
