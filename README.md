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

Let me know if you want badges, deployment notes, or production instructions too.
