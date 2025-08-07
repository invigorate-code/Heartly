#!/bin/bash

# Start Test Environment Script
# Starts Docker containers needed for running tests locally

echo "🐳 Starting Test Environment"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$PROJECT_ROOT"

# Stop any existing test containers
echo -e "${YELLOW}🔄 Stopping any existing test containers...${NC}"
docker compose -f docker-compose.test.yml down 2>/dev/null

# Start test containers
echo -e "${YELLOW}🚀 Starting test containers...${NC}"
docker compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"

# Wait for PostgreSQL
echo -n "Waiting for PostgreSQL..."
until docker exec postgres-test pg_isready -U postgres > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo -e " ${GREEN}✅${NC}"

# Wait for Redis
echo -n "Waiting for Redis..."
until docker exec redis-test redis-cli --raw ping > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo -e " ${GREEN}✅${NC}"

# Wait for SuperTokens
echo -n "Waiting for SuperTokens..."
until curl --fail http://localhost:13567/hello > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo -e " ${GREEN}✅${NC}"

echo ""
echo -e "${GREEN}✅ Test environment is ready!${NC}"
echo ""
echo "Services running:"
echo "  - PostgreSQL: localhost:15432"
echo "  - Redis: localhost:16379"
echo "  - SuperTokens: localhost:13567"
echo "  - PostgreSQL (SuperTokens): localhost:15433"
echo ""
echo "To stop the test environment, run:"
echo "  ./scripts/test/stop-test-env.sh"
echo ""