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

The progress tracking system automatically generates a current progress summary at `docs/current-progress.md` with real-time metrics including:

- **Story Progress**: Overall and epic-specific completion rates
- **Team Progress**: Parallel team advancement tracking
- **Technical Progress**: Backend, frontend, and overall project metrics
- **Timestamp**: Last update time for reference

This file is updated and included in commits using various approaches to ensure progress updates are part of your commit history.

#### **🚀 Usage Options (Recommended Order):**

**Option 1: Clean Commit Then Amend (Working)**
```bash
# Stage your files
git add .

# Make clean commit then amend with progress
./scripts/commit-clean-then-amend.sh "Your commit message"
# or
git commit-clean-amend "Your commit message"
```

**Option 2: Amend Previous Commit (If no hooks conflict)**
```bash
# Make your normal commit
git add .
git commit -m "Your commit message"

# Then amend with progress
./scripts/amend-with-progress.sh
# or
git amend-progress
```

**Option 3: Commit with Progress (All-in-One)**
```bash
# Direct script usage
./scripts/commit-with-progress.sh "Your commit message"

# Git alias (easier to remember)
git commit-progress "Your commit message"
```

**Option 4: Traditional Git (Progress in separate commit)**
```bash
git add .
git commit -m "Your commit message"
# Progress file updated by prepare-commit-msg hook
```
