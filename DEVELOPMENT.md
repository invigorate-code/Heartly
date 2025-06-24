# Heartly Development Setup

## Quick Start

The app has been debugged and is now working correctly. Here's how to run it:

### Frontend Only (Current Setup)

```bash
pnpm run dev
# or
cd heartly-frontend && pnpm run dev
```

This will start the Next.js frontend on http://localhost:3000

### Full Stack Development

To run both frontend and backend:

1. **Frontend** (Terminal 1):

```bash
pnpm run dev:frontend
```

2. **Backend** (Terminal 2):

```bash
pnpm run dev:backend
```

## What Was Fixed

1. **Missing Dependencies**: Installed frontend dependencies with `pnpm install`
2. **Environment Configuration**: Created `.env.local` with backend API URL
3. **Middleware Error Handling**: Updated middleware to gracefully handle missing backend
4. **Dev Script Configuration**: Added proper dev scripts to package.json

## Environment Variables

The frontend requires these environment variables (configured in `heartly-frontend/.env.local`):

```env
NEXT_PUBLIC_NEST_API_URL=http://localhost:3001
```

## Current Status

✅ **Frontend**: Running successfully on port 3000
⚠️ **Backend**: Not currently running, but frontend handles this gracefully
✅ **Build System**: Working correctly
✅ **Dependencies**: All installed

## Notes

- The middleware will show "Session verification error" messages when the backend is not running, but this is expected and handled gracefully
- The app will show the landing page and allow navigation even without the backend
- For full functionality (authentication, etc.), both frontend and backend need to be running

## Next Steps

1. Set up backend environment variables if needed
2. Configure database connection for backend
3. Set up proper authentication flow with SuperTokens
