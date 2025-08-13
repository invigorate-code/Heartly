#!/bin/bash

# Run Tests with Docker Script
# Starts Docker containers, runs tests, and cleans up

echo "🧪 Running Tests with Docker Environment"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$PROJECT_ROOT"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    ./scripts/test/stop-test-env.sh
}

# Set up trap to ensure cleanup on script exit
trap cleanup EXIT

# Start test environment
./scripts/test/start-test-env.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start test environment${NC}"
    exit 1
fi

# Create .env file for backend if it doesn't exist
if [ ! -f "./heartly-backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend .env file...${NC}"
    cat > ./heartly-backend/.env << EOF
NODE_ENV=test
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=15432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=heartly_test
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
JWT_SECRET=test-jwt-secret-key
JWT_EXPIRES_IN=1h
REDIS_HOST=localhost
REDIS_PORT=16379
REDIS_PASSWORD=redispass
SUPERTOKENS_CONNECTION_URI=http://localhost:13567
SUPERTOKENS_API_KEY=test-api-key
SUPERTOKENS_WEBSITE_DOMAIN=http://localhost:3000
SUPERTOKENS_API_DOMAIN=http://localhost:3001
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=noreply@heartly.com
EOF
fi

# Run database migrations
echo ""
echo -e "${BLUE}📊 Running database migrations...${NC}"
cd ./heartly-backend
pnpm run migration:up

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

# Run backend tests
echo ""
echo -e "${BLUE}🧪 Running backend unit tests...${NC}"
pnpm run test

UNIT_TEST_RESULT=$?

# Run e2e tests
echo ""
echo -e "${BLUE}🧪 Running backend e2e tests...${NC}"
pnpm run test:e2e

E2E_TEST_RESULT=$?

# Back to project root
cd "$PROJECT_ROOT"

# Run frontend tests if needed
if [ "$1" == "--with-frontend" ]; then
    echo ""
    echo -e "${BLUE}🧪 Running frontend tests...${NC}"
    cd ./heartly-frontend
    pnpm run test
    FRONTEND_TEST_RESULT=$?
    cd "$PROJECT_ROOT"
else
    FRONTEND_TEST_RESULT=0
fi

# Summary
echo ""
echo "================================"
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "================================"

if [ $UNIT_TEST_RESULT -eq 0 ]; then
    echo -e "Backend Unit Tests: ${GREEN}✅ PASSED${NC}"
else
    echo -e "Backend Unit Tests: ${RED}❌ FAILED${NC}"
fi

if [ $E2E_TEST_RESULT -eq 0 ]; then
    echo -e "Backend E2E Tests:  ${GREEN}✅ PASSED${NC}"
else
    echo -e "Backend E2E Tests:  ${RED}❌ FAILED${NC}"
fi

if [ "$1" == "--with-frontend" ]; then
    if [ $FRONTEND_TEST_RESULT -eq 0 ]; then
        echo -e "Frontend Tests:     ${GREEN}✅ PASSED${NC}"
    else
        echo -e "Frontend Tests:     ${RED}❌ FAILED${NC}"
    fi
fi

echo ""

# Exit with appropriate code
if [ $UNIT_TEST_RESULT -ne 0 ] || [ $E2E_TEST_RESULT -ne 0 ] || [ $FRONTEND_TEST_RESULT -ne 0 ]; then
    exit 1
fi

exit 0