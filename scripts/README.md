# Scripts Directory

This directory contains various utility scripts for the Heartly project.

## Directory Structure

### `/build`
Build and type generation scripts:
- `generate-types.js` - Generates TypeScript types from NestJS entities

### `/git`
Git workflow and commit helper scripts:
- `amend-with-progress.sh` - Amend commits with progress updates
- `commit-clean-then-amend.sh` - Clean commit and amend workflow
- `commit-with-progress.sh` - Commit with progress tracking
- `dev-progress.sh` - Development progress tracking

### `/test`
Testing and validation scripts:
- `test-email-verification.sh` - Tests email verification flow
- `test-password-reset.sh` - Tests password reset functionality
- `test-password-reset-simple.sh` - Simple password reset test
- `test-roles-integration.sh` - Tests role-based access control
- `smoke-test-roles.js` - JavaScript smoke test for custom roles
- `test-terminal-detection.sh` - Terminal environment detection test

## Usage

### Running Test Scripts
```bash
# Run email verification tests
./scripts/test/test-email-verification.sh

# Run password reset tests
./scripts/test/test-password-reset.sh

# Run role integration tests
./scripts/test/test-roles-integration.sh

# Run JavaScript smoke tests
node scripts/test/smoke-test-roles.js
```

### Type Generation
```bash
# Generate TypeScript types from backend entities
pnpm run generate:types
```

### Git Workflow Scripts
```bash
# Commit with progress tracking
./scripts/git/commit-with-progress.sh

# Amend commit with progress
./scripts/git/amend-with-progress.sh
```

## Prerequisites

- Ensure the backend is running on `http://localhost:3001` for test scripts
- Have proper environment variables set for authentication tests
- Node.js and pnpm installed for type generation scripts