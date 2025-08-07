import { SuperTokensModule } from 'supertokens-nestjs';
import SuperTokens from 'supertokens-node';
import { User } from 'supertokens-node/lib/build/types';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Session from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import UserRoles from 'supertokens-node/recipe/userroles';
import {
  checkIfEmailAndCompanyNameAvailable,
  createSubscriberProfileAndTenantRecord,
  getEmailUsingUserId,
  getUserTenantContext,
  getUserUsingEmail,
  isInputEmail,
} from './supertokens-helper';

export const SuperTokensInitModule = SuperTokensModule.forRoot({
  framework: 'express',
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: 'heartly',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init({
      override: {
        functions: (original) => {
          return {
            ...original,
            signIn: async function (input) {
              console.log('signIn', input);
              if (isInputEmail(input.email)) {
                const userId = (await getUserUsingEmail(input.email))?.id;
                if (userId !== undefined) {
                  const superTokensUser = await SuperTokens.getUser(userId);
                  if (superTokensUser !== undefined) {
                    // we find the right login method for this user
                    // based on the user ID.
                    const loginMethod = superTokensUser.loginMethods.find(
                      (lM) =>
                        lM.recipeUserId.getAsString() === userId &&
                        lM.recipeId === 'emailpassword',
                    );

                    if (loginMethod !== undefined) {
                      input.email = loginMethod.email!;
                    }
                  }
                }
              }
              return original.signIn(input);
            },
          };
        },
        apis: (original) => {
          return {
            ...original,
            generatePasswordResetTokenPOST: async function (input) {
              const emailOrUsername = input.formFields.find(
                (i) => i.id === 'email',
              )!.value as string;
              if (isInputEmail(emailOrUsername)) {
                const userId = (await getUserUsingEmail(emailOrUsername))?.id;
                if (userId !== undefined) {
                  const superTokensUser = await SuperTokens.getUser(userId);
                  if (superTokensUser !== undefined) {
                    // we find the right login method for this user
                    // based on the user ID.
                    const loginMethod = superTokensUser.loginMethods.find(
                      (lM) =>
                        lM.recipeUserId.getAsString() === userId &&
                        lM.recipeId === 'emailpassword',
                    );
                    if (loginMethod !== undefined) {
                      // we replace the input form field's array item
                      // to contain the username instead of the email.
                      input.formFields = input.formFields.filter(
                        (i) => i.id !== 'email',
                      );
                      input.formFields = [
                        ...input.formFields,
                        {
                          id: 'email',
                          value: loginMethod.email!,
                        },
                      ];
                    }
                  }
                }
              }

              const username = input.formFields.find((i) => i.id === 'email')!
                .value as string;
              const superTokensUsers: User[] =
                await SuperTokens.listUsersByAccountInfo(input.tenantId, {
                  email: username,
                });
              // from the list of users that have this email, we now find the one
              // that has this email with the email password login method.
              const targetUser = superTokensUsers.find(
                (u) =>
                  u.loginMethods.find(
                    (lM) =>
                      lM.hasSameEmailAs(username) &&
                      lM.recipeId === 'emailpassword',
                  ) !== undefined,
              );

              if (targetUser !== undefined) {
                if ((await getEmailUsingUserId(targetUser.id)) === undefined) {
                  return {
                    status: 'GENERAL_ERROR',
                    message:
                      'You need to add an email to your account for resetting your password. Please contact support.',
                  };
                }
              }
              return original.generatePasswordResetTokenPOST!(input);
            },
            signUpPOST: async function (input) {
              const email = input.formFields.find((f) => f.id === 'actualEmail')
                ?.value as string;
              const companyName = input.formFields.find(
                (f) => f.id === 'company',
              )?.value as string;
              const isEmailAndCompanyNameAvailable =
                await checkIfEmailAndCompanyNameAvailable(email, companyName);

              if (isEmailAndCompanyNameAvailable !== null) {
                return {
                  status: 'GENERAL_ERROR',
                  message: isEmailAndCompanyNameAvailable,
                };
              }

              const response = await original.signUpPOST!(input);

              if (response.status === 'OK') {
                const tenant = await createSubscriberProfileAndTenantRecord(
                  input.formFields,
                  response.user.id,
                );
                
                // Assign SuperTokens role to the new user
                try {
                  await UserRoles.addRoleToUser(
                    tenant.id, // tenantId
                    response.user.id, // userId
                    'OWNER' // role - new users are owners of their tenant
                  );
                } catch (error) {
                  console.error('Failed to assign role to user:', error);
                }
              }

              return response;
            },
            signInPOST: async function (input) {
              if (
                isInputEmail(
                  input.formFields.find((f) => f.id === 'email')!
                    .value as string,
                )
              ) {
                const userId = (
                  await getUserUsingEmail(
                    input.formFields.find((f) => f.id === 'email')!
                      .value as string,
                  )
                )?.id;
                if (userId !== undefined) {
                  const superTokensUser = await SuperTokens.getUser(userId);
                  if (superTokensUser !== undefined) {
                    // we find the right login method for this user
                    // based on the user ID.
                    const authProfile = superTokensUser.loginMethods.find(
                      (profile) =>
                        profile.recipeUserId.getAsString() === userId &&
                        profile.recipeId === 'emailpassword',
                    );

                    if (authProfile !== undefined) {
                      input.formFields = input.formFields.filter(
                        (i) => i.id !== 'email',
                      );
                      input.formFields = [
                        ...input.formFields,
                        {
                          id: 'email',
                          value: authProfile.email!,
                        },
                      ];
                    }
                  }
                }
              }
              return original.signInPOST!(input);
            },
          };
        },
      },
      signUpFeature: {
        formFields: [
          {
            id: 'email',
            validate: async (value) => {
              if (typeof value !== 'string') {
                return 'Please provide a string input.';
              }

              // first we check for if it's an email
              if (
                value.match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ) !== null
              ) {
                return undefined;
              }

              // since it's not an email, we check for if it's a correct username
              if (value.length < 3) {
                return 'Usernames must be at least 3 characters long.';
              }
              if (!value.match(/^[a-z0-9_-]+$/)) {
                return 'Username must contain only alphanumeric, underscore or hyphen characters.';
              }
            },
          },
          {
            id: 'actualEmail',
            validate: async (value) => {
              if (value === '') {
                console.log('value is empty');
                // this means that the user did not provide an email
                return undefined;
              }
              if (
                value.match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ) === null
              ) {
                return 'Email is invalid';
              }

              if ((await getUserUsingEmail(value)) !== undefined) {
                return 'Email already in use. Please sign in, or use another email';
              }
            },
            optional: true,
          },
          {
            id: 'firstName',
            validate: async (value) => {
              if (!value) return 'First name is required';
            },
          },
          {
            id: 'lastName',
            validate: async (value) => {
              if (!value) return 'Last name is required';
            },
          },
          {
            id: 'company',
            validate: async (value) => {
              if (!value) return 'Company is required';
            },
          },
          {
            id: 'password',
            validate: async (value) => {
              if (value.length < 8) {
                return 'Password must be 8+ characters';
              }
            },
          },
        ],
      },
      emailDelivery: {
        override: (original) => {
          return {
            ...original,
            sendEmail: async function (input) {
              input.user.email = (await getEmailUsingUserId(input.user.id))!;

              // Custom email content for Heartly branding
              if (input.type === 'PASSWORD_RESET') {
                const customInput = {
                  ...input,
                  // Add custom email template content here
                };
                return original.sendEmail(customInput);
              }

              return original.sendEmail(input);
            },
          };
        },
      },
    }), // initializes signin / sign up features
    Session.init({
      getTokenTransferMethod: () => 'cookie',
      // Configure session persistence and security
      sessionExpiredStatusCode: 401,
      invalidClaimStatusCode: 403,
      cookieDomain:
        process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
      cookieSecure: process.env.NODE_ENV === 'production',
      cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      override: {
        functions: (original) => {
          return {
            ...original,
            createNewSession: async function (input) {
              // Get user tenant context before creating session
              const tenantContext = await getUserTenantContext(input.userId);

              if (tenantContext) {
                // Add tenant context to the access token payload
                const accessTokenPayload = {
                  ...input.accessTokenPayload,
                  tenantId: tenantContext.tenantId,
                  role: tenantContext.role,
                  email: tenantContext.email,
                };

                return original.createNewSession({
                  ...input,
                  accessTokenPayload,
                });
              }

              return original.createNewSession(input);
            },
          };
        },
      },
    }), // initializes session features with tenant context and persistence
    EmailVerification.init({
      mode: 'REQUIRED', // Email verification is required for all new user accounts
      emailDelivery: {
        override: (originalImplementation) => {
          return {
            ...originalImplementation,
            sendEmail: async function (input) {
              input.user.email = (await getEmailUsingUserId(input.user.id))!;

              // Customize verification email with Heartly branding
              const customInput = {
                ...input,
                emailVerifyLink: input.emailVerifyLink.replace(
                  'http://localhost:3000/auth/verify-email',
                  'http://localhost:3000/verify-email',
                ),
                // Custom email template variables can be added here
                tenantId: input.tenantId || 'public',
              };

              return originalImplementation.sendEmail(customInput);
            },
          };
        },
      },
    }),
    UserRoles.init(),
    Dashboard.init(),
    UserMetadata.init(),
  ],
});
