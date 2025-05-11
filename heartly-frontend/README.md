# Heartly: Advanced Management for ARFs and ARTFs

![Heartly Logo](./app/logo.png)

Heartly is a comprehensive, HIPAA-compliant management system designed to streamline operations and enhance resident care in Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs).

## Project Overview

Heartly aims to improve the quality of care, ensure regulatory compliance, and optimize facility management. It provides a seamless experience for owners, administrators, and direct support staff.

## Key Features

- **User Authentication & Authorization**

  - Role-based access control
  - Schedule-based access for Direct Support Staff
  - Multi-factor authentication
  - Secure session management

- **Facility Management**

  - Facility creation and configuration
  - Room management
  - Occupancy tracking

- **Staff Management**

  - Staff profiles and scheduling
  - Performance tracking
  - Certification management

- **Resident Management**

  - Comprehensive resident profiles
  - Medical history tracking
  - Daily notes and observations

- **Medication Management**

  - Medication scheduling and reminders
  - Administration recording
  - Compliance reporting

- **Incident Reporting**

  - Incident creation and categorization
  - Follow-up tracking
  - Analytics on occurrences

- **Documentation & Forms**

  - Custom form creation
  - Advanced search functionality
  - Report generation

- **Reporting & Analytics**

  - Customizable dashboards
  - Trend analysis
  - Automated report generation

- **Audit & Compliance**
  - Comprehensive action logging
  - HIPAA compliance checks
  - Security breach alerts

## Tech Stack

- **Frontend:** Next.js with App Router
- **Backend:** Supabase
- **UI Components:** NextUI v2
- **Styling:** Tailwind CSS
- **State Management:** React Context API, Supabase
- **Database:** PostgreSQL (via Supabase)
- **File Storage:** Supabase Storage
- **Authentication:** Supabase Auth

## Getting Started

#### Must be using minimum of `NODE v18`

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/heartly.git
   cd heartly
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local`
   - Update Supabase credentials in `.env.local`

4. Set up local Supabase instance:
   a. Install Docker Desktop:

   - Download and install Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Follow the installation instructions for your operating system

   b. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

   c. Initialize Supabase:

   ```bash
   npx supabase init
   ```

   d. Start the local Supabase instance:

   ```bash
   cd supabase
   npx supabase start
   ```

   This command will start all necessary Docker containers for your local Supabase instance.

   e. Once the local instance is running, you'll see output with your local Supabase credentials. Update your `.env.local` file with these credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Stopping the Local Supabase Instance

To stop the local Supabase instance when you're done:

```bash
npx supabase stop
```

<!-- ## Deployment

Deploy Heartly to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fheartly) -->

## Creating test user

1. Visit [http://localhost:3000/subscribe](http://localhost:3000/subscribe)
2. Enter an email address to subscribe
3. Open the email testing interface at [http://localhost:54324](http://localhost:54324)
4. Find your email and click the magic link
5. You will be redirected to the onboarding process

## Key Considerations

- **Accessibility:** WCAG 2.1 AA compliant
- **Performance:** Optimized for low-bandwidth scenarios
- **Scalability:** Microservices architecture for future growth
- **Data Privacy:** End-to-end encryption and strict access controls
- **User Experience:** Intuitive design with regular user feedback incorporation
- **Compliance:** Regular HIPAA compliance audits
- **Integration:** API endpoints for potential future integrations

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ by the Heartly Team
