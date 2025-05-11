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
      Session.init(), // initializes session features
      EmailVerification.init({
        mode: "REQUIRED", // or "OPTIONAL"
      }),
    ],
  };
};
