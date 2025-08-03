## 🛠 Development Setup (with `pnpm` workspace)

This project is a monorepo managed with [`pnpm`](https://pnpm.io/), containing:

* 🧪 `heartly-frontend`: Next.js frontend
* 🧠 `heartly-backend`: NestJS backend
* 🔄 `shared`: Shared types/utilities used by both frontend and backend

### 📦 Requirements

* Node.js ≥ 16.13
* [`pnpm`](https://pnpm.io/installation) (`npm install -g pnpm`)

---

### 📁 Project Structure

```
/
├── heartly-frontend      # Next.js app
├── heartly-backend       # NestJS app
├── shared                # Shared types/utilities
├── package.json          # Root workspace scripts
└── pnpm-workspace.yaml   # Declares workspace packages
```

---

### 🚀 Getting Started

#### 1. Install dependencies

From the root directory:

```bash
pnpm install
```

This installs dependencies for all workspace packages (`frontend`, `backend`, and `shared`).

---

#### 2. Start development

```bash
pnpm dev
```

This will concurrently start:

* `heartly-frontend` on its default port (`localhost:3000`)
* `heartly-backend` on its default port (`localhost:3001`, etc.)

---

### 🧩 Shared Package

The `shared/` folder contains TypeScript interfaces, types, and utils shared between frontend and backend.

To use it:

```ts
import { UserProfile } from 'shared';
```

To manually build shared types:

```bash
pnpm --filter shared run build
```

---

### 🔧 Scripts

In the root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter heartly-frontend dev\" \"pnpm --filter heartly-backend start:dev\""
  }
}
```

> Requires `concurrently` (installed as a devDependency)

---

### 📊 Current Project Status

#### **🎯 Story Progress**
- **Total Stories**: 50 planned across 3 epics
- **Completed**: 1 story (2%)
- **Current Epic**: Epic 1 - The Foundation Crisis
- **Next Priority**: Complete Database Schema & Authentication

#### **🔄 Team Status**
- **Team A**: 0/7 stories completed (Core Infrastructure & Security)
- **Team B**: 0/10 stories completed (User Experience & Integration)
- **Work Approach**: Parallel Teams (A & B)

#### **🏥 Healthcare Compliance**
- **HIPAA Compliance**: 62% (5/8 checks)
- **Audit Logging**: ✅ Active
- **Database Security**: ✅ RLS policies
- **Authentication**: ✅ SuperTokens integration

#### **💻 Technical Metrics**
- **Backend API Endpoints**: 10
- **Frontend Components**: 39
- **Total Test Files**: 82
- **Database Entities**: 3
- **Database Migrations**: 1

### 📈 Auto-Generated Progress Summary

The prepare-commit-msg hook automatically generates a current progress summary at `docs/current-progress.md` with real-time metrics including:

- **Story Progress**: Overall and epic-specific completion rates
- **Team Progress**: Parallel team advancement tracking
- **Technical Progress**: Backend, frontend, and overall project metrics
- **Timestamp**: Last update time for reference

This file is updated every time you run `git commit` and is automatically staged for commit, ensuring progress updates are included in your commit history.
