# AI Guidance: Handling SuperTokens in Heartly

## Overview
Heartly uses [SuperTokens](https://supertokens.com) for authentication and session management across both its backend (NestJS) and frontend (Next.js) applications. This file provides AI agents with guidance on how to interact with, extend, or document SuperTokens usage in the Heartly codebase.

---

## 1. How SuperTokens is Used in Heartly

### Backend (NestJS)
- **SuperTokens is integrated via the `supertokens-nestjs` and `supertokens-node` packages.**
- **Recipes enabled:**
  - EmailPassword (sign up/sign in)
  - Session (session management, using cookies)
  - EmailVerification (optional or required, depending on config)
  - UserMetadata and UserRoles (for tenant and role management)
- **Customizations:**
  - Custom sign-in logic to map user emails and IDs.
  - Custom email delivery logic for password reset and verification.
  - User metadata is updated to include tenant IDs.
  - Session validation and role-based access are enforced via NestJS guards and decorators.
- **Endpoints:**
  - `/auth/getUserSession` (returns session and user profile)
  - `/auth/reset-password` (creates password reset link)
  - Other endpoints use SuperTokens guards for session/role validation.

#### Backend Code Snippets

**SuperTokens Initialization (NestJS):**
```ts
// heartly-backend/src/utils/modules-set.ts
const SuperTokensInitModule = SuperTokensModule.forRoot({
  framework: 'express',
  supertokens: {
    connectionURI: 'http://localhost:3567',
    apiKey: process.env.NEXT_PUBLIC_ST_API_KEY,
  },
  appInfo: {
    appName: 'heartly',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init({ /* ...customizations... */ }),
    Session.init({ getTokenTransferMethod: () => 'cookie' }),
    EmailVerification.init({ mode: 'OPTIONAL' }),
    // ...other recipes
  ],
});
```

**Custom Sign-In Logic:**
```ts
// heartly-backend/src/utils/modules-set.ts (inside EmailPassword.init)
override: {
  functions: (original) => ({
    ...original,
    signIn: async function (input) {
      // Custom mapping of email to userId for multi-tenancy
      if (isInputEmail(input.email)) {
        const userId = (await getUserUsingEmail(input.email))?.id;
        if (userId !== undefined) {
          const superTokensUser = await SuperTokens.getUser(userId);
          if (superTokensUser !== undefined) {
            const loginMethod = superTokensUser.loginMethods.find(
              (lM) => lM.recipeUserId.getAsString() === userId && lM.recipeId === 'emailpassword',
            );
            if (loginMethod !== undefined) {
              input.email = loginMethod.email!;
            }
          }
        }
      }
      return original.signIn(input);
    },
  }),
},
```

**Session Validation in Controller:**
```ts
// heartly-backend/src/api/auth/auth.controller.ts
@UseGuards(SuperTokensAuthGuard)
@Post('/getUserSession')
@VerifySession()
async getUserSession(@Session() session: SessionContainer) {
  const user = await this.userService.findById(session.getUserId());
  return {
    session: session.getAccessTokenPayload(),
    userProfile: user,
  };
}
```

**Role-Based Access Example:**
```ts
// heartly-backend/src/api/auth/auth.controller.ts
@Get('/user/:userId')
@VerifySession({ roles: ['admin'] })
async deleteUser(@Session() session: SessionContainer) {
  // Only accessible by admin users
}
```

**Custom Email Delivery:**
```ts
// heartly-backend/src/utils/modules-set.ts (inside EmailPassword.init)
emailDelivery: {
  override: (original) => ({
    ...original,
    sendEmail: async function (input) {
      input.user.email = (await getEmailUsingUserId(input.user.id))!;
      return original.sendEmail(input);
    },
  }),
},
```

**Onboarding Logic (User Metadata):**
```ts
// heartly-backend/src/api/auth/auth.service.ts
await UserMetadata.updateUserMetadata(user.id, {
  tenantId: user.tenantId,
});
```

---

### Frontend (Next.js)
- **SuperTokens is integrated via the `supertokens-auth-react` package.**
- **Recipes enabled:**
  - EmailPassword (sign up/sign in UI)
  - Session (session management)
  - EmailVerification (required or optional)
- **Customizations:**
  - Sign-up form includes extra fields: firstName, lastName, company, etc.
  - Middleware (`middleware.ts` and `utils/supertokens/middleware.ts`) protects routes and redirects users based on session and onboarding status.
  - Uses API endpoints to verify session and fetch user profile.
  - Context providers and hooks (e.g., `UserContext`) manage user state and role-based UI.

#### Frontend Code Snippets

**SuperTokens Initialization (Next.js):**
```ts
// heartly-frontend/app/supertokens/frontend.tsx
export const frontendConfig = (): SuperTokensConfig => ({
  appInfo: {
    appName: 'heartly',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init({
      signInAndUpFeature: {
        signUpForm: {
          formFields: [
            { id: 'firstName', label: 'First Name', validate: async (v) => !v && 'First name is required' },
            { id: 'lastName', label: 'Last Name', validate: async (v) => !v && 'Last name is required' },
            { id: 'company', label: 'Company', validate: async (v) => !v && 'Company is required' },
            { id: 'password', label: 'Password', validate: async (v) => v.length < 8 && 'Password must be 8+ characters' },
          ],
        },
      },
    }),
    Session.init(),
    EmailVerification.init({ mode: 'REQUIRED' }),
  ],
});
```

**Middleware for Route Protection and Onboarding:**
```ts
// heartly-frontend/utils/supertokens/middleware.ts
export async function updateSession(req: NextRequest) {
  // ...
  const loggedInUserResponse = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_API_URL}/api/auth/getUserSession`,
    {
      method: 'POST',
      headers: { Cookie: req.headers.get('cookie') || '' },
      credentials: 'include',
    }
  );
  const response = await loggedInUserResponse.json();
  const isAuthenticated = response?.status === 'OK';
  const isOnboardingCompleted = response?.userProfile?.onboarding_completed_at != null;
  const isOwner = response?.userProfile?.role === 'OWNER';
  const isOnboardingRequired = isOwner && !isOnboardingCompleted;
  // ...redirect logic based on session and onboarding
}
```

**User Context for Role-Based UI:**
```tsx
// heartly-frontend/shared/context/UserContext.tsx
const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  useEffect(() => {
    getLoggedInUser()
      .then(res => setUser(res.userProfile))
      .catch(err => console.error(err));
  }, []);
  const getUserRole = () => user?.role;
  const isOwner = () => user?.role === 'OWNER';
  const isOnboardingCompleted = () => user?.onboarding_completed_at !== null;
  // ...
  return <UserContext.Provider value={{ user, getUserRole, isOwner, isOnboardingCompleted }}>{children}</UserContext.Provider>;
};
```

**Sign-Up Action with Extra Fields:**
```ts
// heartly-frontend/app/(auth-pages)/actions.ts
const signUpAction = async (formData: FormData) => {
  // ...
  const createdUser = await EmailPassword.signUp({
    formFields: [
      { id: 'email', value: email },
      { id: 'actualEmail', value: actualEmail },
      { id: 'password', value: password },
      { id: 'firstName', value: firstName },
      { id: 'lastName', value: lastName },
      { id: 'company', value: companyName },
    ],
  });
  // ...
};
```

---

## 2. Key Integration Points
- **Session Management:**
  - Sessions are managed via cookies (backend and frontend must agree on domains and paths).
  - Session validation is required for protected routes and API endpoints.
- **User Metadata:**
  - Tenant IDs and other metadata are stored using SuperTokens' UserMetadata recipe.
- **Role-Based Access:**
  - Roles are enforced both in backend (NestJS guards) and frontend (UI logic, redirects).
- **Email Verification:**
  - Email verification is required or optional depending on config; custom email delivery logic is present.
- **Onboarding Flow:**
  - Special logic for owners who have not completed onboarding (redirects, UI state).

---

## 3. Best Practices for AI-Driven Automation or Documentation
- **Always reference the correct SuperTokens recipes and configuration for both backend and frontend.**
- **When generating code or docs:**
  - Document custom form fields and validation logic.
  - Note any custom email delivery or session logic.
  - Highlight the use of UserMetadata for tenant management.
  - Explain the onboarding flow and its impact on authentication.
- **For automation:**
  - Ensure session cookies are handled correctly in API calls.
  - Use the `/auth/getUserSession` endpoint to validate sessions and fetch user profiles.
  - Respect role-based and onboarding-based redirects in the frontend.
- **For documentation:**
  - Link to SuperTokens official docs for general concepts, but document Heartly-specific customizations and flows.

---

## 4. Caveats and Heartly-Specific Customizations
- **Custom sign-in logic** in the backend maps user emails and IDs to support multi-tenancy.
- **Custom email delivery** is used for password reset and verification emails.
- **Onboarding logic**: Owners who have not completed onboarding are redirected to onboarding pages until finished.
- **Role-based access**: Both backend and frontend enforce roles; ensure any new features respect this pattern.
- **Session validation**: Always use SuperTokens session validation for protected routes and APIs.
- **Supabase references**: Some legacy or parallel code references Supabase Auth; prefer SuperTokens for new features unless otherwise specified.

---

## References
- [SuperTokens Official Documentation](https://supertokens.com/docs)
- Heartly backend: `heartly-backend/src/api/auth/`, `heartly-backend/src/utils/middleware/auth.middleware.ts`, `heartly-backend/src/utils/modules-set.ts`
- Heartly frontend: `heartly-frontend/app/supertokens/`, `heartly-frontend/utils/supertokens/middleware.ts`, `heartly-frontend/shared/context/UserContext.tsx` 