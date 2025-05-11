# Next.js Component Guide for React Developers: Task App Edition

## Table of Contents
1. [Server Components vs. Client Components](#server-components-vs-client-components)
2. [File-based Routing](#file-based-routing)
3. [Data Fetching](#data-fetching)
4. [Layouts and Pages](#layouts-and-pages)
5. [Image Optimization](#image-optimization)
6. [Styling in Next.js](#styling-in-nextjs)
7. [Best Practices](#best-practices)

## Server Components vs. Client Components

> **Key Concept:** Understanding when to use Server Components vs Client Components is crucial for optimizing your Next.js application.

Next.js uses React Server Components by default, which can significantly improve performance [^1].

### When to Use Server Components

Use Server Components for:
- Static or infrequently updated content
- SEO-critical pages
- Data fetching directly from the server
- Reducing client-side JavaScript bundle size

**Example: Task List (Server Component)**

```tsx
// app/tasks/page.tsx
async function getTasks() {
  const res = await fetch('https://api.example.com/tasks')
  return res.json()
}

export default async function TaskList() {
  const tasks = await getTasks()
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}
```

### When to Use Client Components

Use Client Components for:
- Interactive UI elements
- Components that use state or effects
- Components that need to access browser APIs

To use a Client Component, add `'use client'` at the top of the file:

**Example: Task Counter (Client Component)**

```tsx
'use client'

import { useState } from 'react'

export default function TaskCounter() {
  const [completedTasks, setCompletedTasks] = useState(0)
  return (
    <div>
      <p>Completed Tasks: {completedTasks}</p>
      <button onClick={() => setCompletedTasks(completedTasks + 1)}>
        Mark Task as Complete
      </button>
    </div>
  )
}
```

### Mixing Server and Client Components

You can use Client Components within Server Components, but not vice versa. Here's an example of how to combine them:

**Example: Task Dashboard (Mixing Server and Client Components)**

```tsx
// app/dashboard/page.tsx
import TaskList from './TaskList'
import TaskCounter from './TaskCounter'

export default async function Dashboard() {
  return (
    <div>
      <h1>Task Dashboard</h1>
      <TaskList /> {/* Server Component */}
      <TaskCounter /> {/* Client Component */}
    </div>
  )
}

// app/dashboard/TaskList.tsx
async function getTasks() {
  const res = await fetch('https://api.example.com/tasks')
  return res.json()
}

export default async function TaskList() {
  const tasks = await getTasks()
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}

// app/dashboard/TaskCounter.tsx
'use client'

import { useState } from 'react'

export default function TaskCounter() {
  const [completedTasks, setCompletedTasks] = useState(0)
  return (
    <div>
      <p>Completed Tasks: {completedTasks}</p>
      <button onClick={() => setCompletedTasks(completedTasks + 1)}>
        Mark Task as Complete
      </button>
    </div>
  )
}
```

In this example, the `Dashboard` component is a Server Component that includes both a Server Component (`TaskList`) and a Client Component (`TaskCounter`). This approach allows you to benefit from server-side rendering for the task list while still providing interactive functionality for the task counter.

## File-based Routing

Next.js uses a file-based routing system. Place your components in the `app` directory:

- `app/page.tsx` → `/` (Task Dashboard)
- `app/tasks/page.tsx` → `/tasks` (Task List)
- `app/tasks/[id]/page.tsx` → `/tasks/:id` (Individual Task View)

## Data Fetching

Next.js provides several ways to fetch data:

1. Server Components (preferred for most cases):

```tsx
// app/tasks/page.tsx
async function getTasks() {
  const res = await fetch('https://api.example.com/tasks')
  return res.json()
}

export default async function Tasks() {
  const tasks = await getTasks()
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          <p>Due: {task.dueDate}</p>
        </li>
      ))}
    </ul>
  )
}
```

2. Client-side fetching (for frequently updating data):

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function LiveTaskUpdates() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('https://api.example.com/tasks/live')
      setTasks(await res.json())
    }
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title} - {task.status}</li>
      ))}
    </ul>
  )
}
```

## Layouts and Pages

Use layouts for shared UI across multiple pages:

```tsx
// app/layout.tsx
import Link from 'next/link'

export default function TaskAppLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/tasks">Tasks</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>© 2023 Task App</footer>
      </body>
    </html>
  )
}
```

Pages are rendered within layouts:

```tsx
// app/page.tsx
export default function Dashboard() {
  return <h1>Welcome to your Task Dashboard!</h1>
}
```

## Image Optimization

Use the `next/image` component for automatic image optimization:

```tsx
import Image from 'next/image'

export default function TaskIcon({ iconUrl }) {
  return (
    <Image
      src={iconUrl}
      alt="Task Icon"
      width={24}
      height={24}
    />
  )
}
```

## Styling in Next.js

Next.js supports various styling options:

1. CSS Modules (recommended for component-scoped styles):

```tsx
// TaskItem.module.css
.taskItem {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.completed {
  background-color: #e6ffe6;
}

// TaskItem.tsx
import styles from './TaskItem.module.css'

export default function TaskItem({ task }) {
  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
      <h3>{task.title}</h3>
      <p>Due: {task.dueDate}</p>
    </div>
  )
}
```

2. Global CSS:

```tsx
// app/globals.css
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

3. Tailwind CSS (if you prefer utility-first CSS):

```tsx
export default function TaskCard({ task }) {
  return (
    <div className="p-4 m-2 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">{task.title}</h2>
      <p className="text-gray-600">Due: {task.dueDate}</p>
      <span className={`px-2 py-1 rounded ${task.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>
    </div>
  )
}
```

## Best Practices

1. Use Server Components by default, only switching to Client Components when necessary for interactivity.
2. Leverage Next.js's automatic code splitting by using dynamic imports for large dependencies:

```tsx
import dynamic from 'next/dynamic'

const TaskChart = dynamic(() => import('./TaskChart'))
```

3. Utilize the `next/link` component for client-side navigation:

```tsx
import Link from 'next/link'

export default function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Link href={`/tasks/${task.id}`}>{task.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

4. Use the `loading.js` file for creating loading UI:

```tsx
// app/tasks/loading.js
export default function Loading() {
  return <p>Loading tasks...</p>
}
```

5. Implement error handling with `error.js`:

```tsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Error loading tasks!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

Remember, this guide covers the basics of Next.js 13+ with the App Router. Always refer to the [official Next.js documentation](https://nextjs.org/docs) for the most up-to-date information and advanced features.