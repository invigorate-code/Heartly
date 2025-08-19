Of course! Here is the story breakdown formatted in Markdown.

# Heartly Application: Complete Story Breakdown

This document contains a detailed list of user stories for the Heartly application development. Each story is designed to be a small, manageable task suitable for a junior developer, with a clear objective, prompt, and acceptance criteria.

# Epic 0: Project Foundation & Strategic Alignment
> **Goal:** Establish two distinct, stable, and correctly configured projects: the NestJS backend API and the Next.js frontend client.

---
## Feature: NestJS Backend Setup

### FND-101: (NestJS Backend) Initialize Project
* **Objective:** Create the basic backend application structure.
* **Prompt:** Use the NestJS CLI (`@nestjs/cli`) to generate a new project named `heartly-api`.
* **Acceptance Criteria:** The command `npm run start:dev` successfully starts the backend server on `http://localhost:3000`.

### FND-102: (NestJS Backend) Install Core Dependencies
* **Objective:** Add necessary packages for database, validation, and configuration.
* **Prompt:** In the `heartly-api` project, run `npm install @nestjs/typeorm typeorm pg @nestjs/config zod`.
* **Acceptance Criteria:** All packages are added to `package.json` without errors.

### FND-103: (NestJS Backend) Configure Environment Variables
* **Objective:** Set up a secure way to manage configuration and secrets.
* **Prompt:** Import and configure the `ConfigModule` in `AppModule` to be global and load a `.env` file. Create a `.env` file and add placeholders for `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME`.
* **Acceptance Criteria:** The `ConfigService` can be injected and used to read a value from the `.env` file.

### FND-104: (NestJS Backend) Configure TypeORM Connection
* **Objective:** Connect the NestJS application to the PostgreSQL database.
* **Prompt:** In `AppModule`, import `TypeOrmModule.forRootAsync`, using the `ConfigService` to dynamically provide the connection options from your `.env` file. Set `synchronize: true` for development.
* **Acceptance Criteria:** The application starts without any database connection errors.

### FND-105: (NestJS Backend) Enable CORS
* **Objective:** Allow the frontend application to make requests to the backend.
* **Prompt:** In `main.ts`, enable CORS for the application by calling `app.enableCors()`. Configure it to allow requests specifically from your frontend's origin (e.g., `http://localhost:3001`).
* **Acceptance Criteria:** A fetch request from the frontend browser console to a backend endpoint does not result in a CORS error.

---
## Feature: Next.js Frontend Setup

### FND-110: (Next.js Frontend) Initialize Project
* **Objective:** Create the basic frontend application structure.
* **Prompt:** Use `create-next-app` to create a project named `heartly-client` with TypeScript, ESLint, and Tailwind CSS.
* **Acceptance Criteria:** `npm run dev` starts the server on `http://localhost:3001` and shows the default Next.js page.

### FND-111: (Next.js Frontend) Install Core Dependencies
* **Objective:** Add necessary packages for state management, API calls, and UI components.
* **Prompt:** In the `heartly-client` project, run `npm install axios zod @tanstack/react-query lucide-react react-hook-form`.
* **Acceptance Criteria:** All packages are added to `package.json` without errors.

### FND-112: (Next.js Frontend) Set Up Folder Structure
* **Objective:** Create a scalable directory structure for the frontend code.
* **Prompt:** Inside the `app` directory, create the following folders: `(auth)` for auth pages, `(app)` for protected app pages, `components/`, `lib/`, and `hooks/`.
* **Acceptance Criteria:** The specified directories are created in the project structure.

---
## Feature: Core Database Entities (TypeORM)

### FND-120: (NestJS Backend) Create Tenant Entity
* **Objective:** Define the database table for Tenants.
* **Prompt:** Create a `tenant.entity.ts` file. Define and export a `Tenant` class decorated with `@Entity()`. Add properties for `id` (primary, uuid), `name` (string), and `createdAt`/`updatedAt` timestamps.
* **Acceptance Criteria:** The `tenant` table is created in the database when the app starts.

### FND-121: (NestJS Backend) Create User Entity
* **Objective:** Define the database table for Users, linking to SuperTokens and Tenants.
* **Prompt:** Create a `user.entity.ts` file. Define a `User` entity. The `id` column should be a string and the primary key, intended to store the SuperTokens `userId`. Add columns for `email`, `role`, and a `tenantId` (string). Create a `ManyToOne` relationship to the `Tenant` entity.
* **Acceptance Criteria:** The `user` table, with a foreign key to the `tenant` table, is created in the database.

### FND-122: (NestJS Backend) Create Resident Entity
* **Objective:** Define the database table for Residents.
* **Prompt:** Create a `resident.entity.ts` file. Define a `Resident` entity with columns for `id`, `firstName`, `lastName`, `dateOfBirth`, `status`, and `roomNumber`. Add a `ManyToOne` relationship to the `Tenant` entity.
* **Acceptance Criteria:** The `resident` table, with a foreign key to the `tenant` table, is created in the database.

### FND-123: (NestJS Backend) Create DailyNote Entity
* **Objective:** Define the database table for daily notes.
* **Prompt:** Create a `daily-note.entity.ts` file. Define a `DailyNote` entity. Add columns for `mood`, `notes`, and `activities`. Add `ManyToOne` relationships to both the `Resident` and `User` entities.
* **Acceptance Criteria:** The `daily_note` table, with foreign keys to the `resident` and `user` tables, is created.

# Epic 1: Secure Multi-Tenant Foundation
> **Goal:** Implement a secure, multi-tenant authentication system with role-based access and a mandatory email verification flow.

---
## Feature: SuperTokens Backend Integration (NestJS)

### SEC-201: (NestJS Backend) Install SuperTokens
* **Objective:** Add the SuperTokens library to the backend.
* **Prompt:** In the `heartly-api` project, run `npm install supertokens-node`.
* **Acceptance Criteria:** The package is added to `package.json` successfully.

### SEC-202: (NestJS Backend) Configure SuperTokens Middleware
* **Objective:** Initialize the SuperTokens recipes and middleware.
* **Prompt:** Create an `AuthModule` in NestJS. Configure the SuperTokens `AuthMiddleware` in `main.ts`. In the `AuthModule`, set up the `appInfo` and a `recipeList` using the `EmailPassword` and `Session` recipes.
* **Acceptance Criteria:** The app starts, and the default SuperTokens auth endpoints are available on the backend.

### SEC-203: (NestJS Backend) Override Sign-Up Logic
* **Objective:** Intercept the default sign-up process to link a new user to your `User` table.
* **Prompt:** In the `EmailPassword` recipe config, override the `signUpPOST` function. After the original function succeeds, use the returned user `id` and `email` to create a new record in your own `user` table using your injected `UserRepository`. Assign a default `tenantId` for now.
* **Acceptance Criteria:** A new user signs up, and a corresponding record appears in both the SuperTokens tables and your local `user` table.

### SEC-204: (NestJS Backend) Override Session Creation Logic
* **Objective:** Add custom data (`tenantId`, `role`) to the user's session token.
* **Prompt:** In the `Session` recipe config, override `createNewSession`. After the original function runs, get the `userId`, look up the user in your `user` table to get their `tenantId` and `role`, and then merge this data into the session's access token payload.
* **Acceptance Criteria:** A logged-in user's session token contains the `tenantId` and `role`.

---
## Feature: SuperTokens Frontend Integration (Next.js)

### SEC-210: (Next.js Frontend) Install SuperTokens
* **Objective:** Add the SuperTokens library to the frontend.
* **Prompt:** In the `heartly-client` project, run `npm install supertokens-auth-react`.
* **Acceptance Criteria:** The package is added to `package.json` successfully.

### SEC-211: (Next.js Frontend) Configure SuperTokens Provider
* **Objective:** Connect the frontend to the backend's auth system.
* **Prompt:** Create a SuperTokens config file. In the root layout, wrap the application with the SuperTokens provider. Configure it with the `appInfo` and the `apiDomain` pointing to your NestJS backend (e.g., `http://localhost:3000`).
* **Acceptance Criteria:** The frontend app loads and can successfully make requests to the backend auth endpoints.

### SEC-212: (Next.js Frontend) Implement Pre-Built Login UI
* **Objective:** Display a functional login/signup form.
* **Prompt:** Create a page at `/auth`. On this page, render the pre-built `SignInAndUp` UI component from `supertokens-auth-react`.
* **Acceptance Criteria:** The `/auth` route shows a working login and sign-up form.

---
## Feature: Required Post-Login Email Verification

### SEC-220: (NestJS Backend) Configure 'REQUIRED' Verification Mode
* **Objective:** Enforce email verification for API access.
* **Prompt:** In the NestJS SuperTokens config, import and initialize the `EmailVerification` recipe. Set its `mode` to `'REQUIRED'`.
* **Acceptance Criteria:** An API endpoint protected by a session guard now fails for logged-in but unverified users.

### SEC-221: (Next.js Frontend) Create the 'Please Verify' Page UI
* **Objective:** Build the static page for unverified users.
* **Prompt:** Create a new page component at `/please-verify`. It should display a simple message like "Please check your inbox to verify your email." and a button to resend the email.
* **Acceptance Criteria:** The page at `/please-verify` renders correctly.

### SEC-222: (Next.js Frontend) Implement 'Resend Email' Button
* **Objective:** Make the resend button functional.
* **Prompt:** In the `/please-verify` page, add an `onClick` handler to the button that calls the `sendVerificationEmail()` function from the SuperTokens `EmailVerification` recipe.
* **Acceptance Criteria:** Clicking the button successfully triggers a new verification email to be sent.

### SEC-223: (Next.js Frontend) Implement Application Guard
* **Objective:** Protect the main application from unverified users.
* **Prompt:** In the layout for the protected part of your app (e.g., `app/(app)/layout.tsx`), wrap the children with the `<EmailVerificationAuth>` component from SuperTokens. Configure its `onEmailNotVerified` prop to redirect the user to `/please-verify`.
* **Acceptance Criteria:** An unverified user who logs in is immediately redirected to `/please-verify` and cannot access the main app. A verified user can.

# Epic 2: Seamless Data Migration & Onboarding
> **Goal:** Build a user-friendly, multi-step wizard for importing resident data from a CSV file.

---
## Feature: CSV Import Backend (NestJS)

### MIG-301: (NestJS Backend) Create CSV Upload Controller Endpoint
* **Objective:** Create the API endpoint that accepts the CSV file.
* **Prompt:** In a `DataImportController`, create a `POST` endpoint at `/import/validate-residents`. Use the `FileInterceptor` from NestJS to handle a single file upload named `file`.
* **Acceptance Criteria:** The endpoint can receive a file upload from a tool like Postman without errors.

### MIG-302: (NestJS Backend) Implement CSV Parsing Logic
* **Objective:** Read the data from the uploaded CSV file buffer.
* **Prompt:** Create a `DataImportService`. Create a method that accepts a file buffer. Inside this method, use the `papaparse` library to parse the buffer into an array of JavaScript objects.
* **Acceptance Criteria:** The service method correctly converts a CSV buffer into an array of objects.

### MIG-303: (NestJS Backend) Implement Row Validation Logic
* **Objective:** Validate each row from the CSV against a defined schema.
* **Prompt:** In the `DataImportService`, create a Zod schema for a resident import row. Modify the parsing method to loop through each parsed object, use Zod's `safeParse` on it, and separate the rows into two arrays: `validRows` and `invalidRows` (with error messages). Return this object.
* **Acceptance Criteria:** The service method correctly separates valid and invalid rows from a parsed CSV.

### MIG-304: (NestJS Backend) Create Data Commit Endpoint
* **Objective:** Create an endpoint to save the validated data to the database.
* **Prompt:** In the `DataImportController`, create a `POST` endpoint at `/import/commit-residents`. It should expect an array of valid resident data in its body.
* **Acceptance Criteria:** The endpoint is created and can receive an array of objects.

### MIG-305: (NestJS Backend) Implement Transactional Database Save
* **Objective:** Save the imported residents in an all-or-nothing transaction.
* **Prompt:** In the `DataImportService`, create a `commitResidents` method. It should inject the `ResidentRepository`. Use TypeORM's `manager.transaction` to loop through the array of valid residents and save each one. If any save fails, the entire transaction should be rolled back.
* **Acceptance Criteria:** If 10 valid residents are sent, 10 records are created. If one out of 10 is invalid and causes an error, 0 records are created.

---
## Feature: Data Import Wizard Frontend (Next.js)

### MIG-310: (Next.js Frontend) Create Wizard State Management
* **Objective:** Set up the state to manage the wizard's steps and data.
* **Prompt:** Create a parent component `ImportWizard`. Use `useState` to manage the current step (e.g., 'upload', 'validate', 'commit'). Also have state for the `file`, `validRows`, and `invalidRows`.
* **Acceptance Criteria:** The component renders and can switch between different steps based on state changes.

### MIG-311: (Next.js Frontend) Build File Upload UI
* **Objective:** Create the UI for the first step where the user selects a file.
* **Prompt:** Create an `UploadStep` component. Use `react-dropzone` to create a file drop area. When a file is selected, call a function passed in props to update the parent's `file` state.
* **Acceptance Criteria:** The user can select a file, and the parent component's state is updated.

### MIG-312: (Next.js Frontend) Implement API Call to Validate
* **Objective:** Connect the upload step to the backend validation endpoint.
* **Prompt:** In the `UploadStep` component, add a "Validate File" button. Its `onClick` handler should use `axios` to post the selected file as `multipart/form-data` to the NestJS `/import/validate-residents` endpoint. The response data should be used to update the parent's state.
* **Acceptance Criteria:** Clicking the button sends the file and updates the parent state with the validation results from the API.

### MIG-313: (Next.js Frontend) Build Validation Results UI
* **Objective:** Display a summary of the validation and a table of errors.
* **Prompt:** Create a `ValidationStep` component. It should receive `validRows` and `invalidRows` as props. Display a summary like "X records are valid, Y records have errors." Render the `invalidRows` in a table showing the row's data and the specific validation error message.
* **Acceptance Criteria:** The component correctly displays the summary and error details.

### MIG-314: (Next.js Frontend) Implement API Call to Commit
* **Objective:** Add a button to save the valid data.
* **Prompt:** In the `ValidationStep` component, add a "Commit Valid Records" button. Its `onClick` handler should use `axios` to POST the `validRows` array to the NestJS `/import/commit-residents` endpoint.
* **Acceptance Criteria:** Clicking the button sends the valid data to the backend for saving.

# Epic 3: Transformative MVP Experience & Intelligent Workflows
> **Goal:** Build the innovative, user-centric features that differentiate Heartly from basic CRUD applications.

---
## Feature: Conversational Daily Note Form

### UXT-401: (Next.js Frontend) Build Multi-Step Form Shell
* **Objective:** Create the parent component to manage the steps of the form.
* **Prompt:** Create a `ConversationalNoteForm` component. Use `useState` to track the current step number. Use `react-hook-form` to initialize the form state. Render different child components based on the current step.
* **Acceptance Criteria:** The component renders the first step, and "Next"/"Previous" buttons correctly change the step number in state.

### UXT-402: (Next.js Frontend) Build 'Mood' Slider Step UI
* **Objective:** Create the UI for the first question.
* **Prompt:** Create a `MoodStep` component. It should display the question "How was the resident's mood today?". Add a standard HTML `<input type="range" min="1" max="10" />`. Use the `register` function from `react-hook-form` to connect it to the parent form state.
* **Acceptance Criteria:** The slider's value is correctly registered in the parent component's form state.

### UXT-403: (Next.js Frontend) Build 'Activities' Toggles Step UI
* **Objective:** Create the UI for the second question.
* **Prompt:** Create an `ActivitiesStep` component. It should display the question "What activities did the resident participate in?". Render a series of checkboxes for common activities. Use the `register` function from `react-hook-form` for each checkbox.
* **Acceptance Criteria:** The selected activities are correctly registered as an array in the parent component's form state.

### UXT-404: (Next.js Frontend) Build 'Notes' Text Area Step UI
* **Objective:** Create the UI for the final question.
* **Prompt:** Create a `NotesStep` component with a `<textarea>` for free-text notes. Use the `register` function from `react-hook-form` to connect it to the parent form state.
* **Acceptance Criteria:** The text entered is correctly registered in the parent component's form state.

### UXT-405: (NestJS Backend) Create 'Save Daily Note' Endpoint
* **Objective:** Build the API endpoint to save the completed form data.
* **Prompt:** In a `DailyNotesController`, create a `POST` endpoint. It should expect a DTO (Data Transfer Object) with fields for `mood`, `activities`, `notes`, and `residentId`. Use a session guard to protect it.
* **Acceptance Criteria:** The endpoint is created and can receive the form data.

### UXT-406: (Next.js Frontend) Implement Form Submission
* **Objective:** Connect the frontend form's submit button to the backend API.
* **Prompt:** In the `ConversationalNoteForm` component, the final step should have a "Submit" button. The `onSubmit` handler (from `react-hook-form`) should use `axios` to `POST` the complete form data to the NestJS endpoint.
* **Acceptance Criteria:** Submitting the form successfully saves a new `DailyNote` record in the database.

---
## Feature: Dynamic Dashboard System

### UXT-410: (NestJS Backend) Create Dashboard Layout Endpoints
* **Objective:** Build API endpoints to save and retrieve a user's custom dashboard layout.
* **Prompt:** In a `DashboardController`, create two endpoints: a `GET` endpoint at `/dashboard/layout` to retrieve the layout, and a `POST` endpoint at `/dashboard/layout` to save it. The layout can be stored as a JSON column on the `User` entity.
* **Acceptance Criteria:** The endpoints can successfully save and retrieve a JSON object representing the dashboard layout for the logged-in user.

### UXT-411: (Next.js Frontend) Create Basic Widget Components
* **Objective:** Build a few placeholder components to display on the dashboard.
* **Prompt:** Create two simple components: `ComplianceScoreWidget` and `RecentNotesWidget`. For now, they can just display a title and some static text inside a styled card.
* **Acceptance Criteria:** Both components render correctly when placed on a page.

### UXT-412: (Next.js Frontend) Implement Drag-and-Drop Grid
* **Objective:** Create the main dashboard layout where widgets can be moved.
* **Prompt:** Install `react-grid-layout`. Create a `DashboardGrid` component. Use the `<ResponsiveGridLayout>` component. Fetch the user's layout from the backend on mount. If no layout exists, use a default one.
* **Acceptance Criteria:** The dashboard renders with widgets in their default or saved positions.

### UXT-413: (Next.js Frontend) Implement Layout Saving
* **Objective:** Make layout changes persistent.
* **Prompt:** In the `DashboardGrid` component, implement the `onLayoutChange` callback. When the user drags or resizes a widget, this function should be called. Use a debounce utility to prevent too many API calls, then `POST` the new layout to the backend to save it.
* **Acceptance Criteria:** A user can move a widget, refresh the page, and the widget will remain in its new position.

# Epic 4: Pixel-Perfect PDF & Compliance Reporting
> **Goal:** Generate compliant PDF documents from application data.

---
## Feature: PDF Generation Service (NestJS)

### PDF-501: (NestJS Backend) Install Puppeteer
* **Objective:** Add the headless browser library to the backend.
* **Prompt:** In the `heartly-api` project, run `npm install puppeteer`.
* **Acceptance Criteria:** The package is added to `package.json`.

### PDF-502: (NestJS Backend) Create an HTML Template
* **Objective:** Create the visual layout for a PDF form using HTML.
* **Prompt:** Create an HTML file named `mar-template.html` in a `templates` folder. Use HTML tables and CSS to create the layout for a Medication Administration Record (MAR). Use placeholder syntax like `{{residentName}}` for dynamic data.
* **Acceptance Criteria:** Opening the HTML file in a browser shows a well-formatted, empty MAR form.

### PDF-503: (NestJS Backend) Create PDF Generation Service
* **Objective:** Build a service that can convert the HTML template into a PDF.
* **Prompt:** Create an injectable `PdfService`. Create a method `generatePdfFromTemplate(templateName, data)`. This method should read the HTML template file, replace the placeholders with values from the `data` object, launch Puppeteer, set the page content to the modified HTML, and return the generated PDF as a buffer.
* **Acceptance Criteria:** The service can take data and return a valid PDF buffer.

### PDF-504: (NestJS Backend) Create PDF Download Endpoint
* **Objective:** Create an API endpoint to trigger the PDF generation and download.
* **Prompt:** In a `PdfController`, create a `GET` endpoint like `/export/resident/:id/mar`. This endpoint should fetch the required data for that resident, call the `PdfService` to generate the PDF buffer, set the response headers (`Content-Type: application/pdf`), and send the buffer as the response.
* **Acceptance Criteria:** Visiting the endpoint in a browser triggers a download of a PDF file containing the correct resident data.