#!/bin/bash

# Stop Test Environment Script
# Stops Docker containers used for testing

echo "🛑 Stopping Test Environment"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$PROJECT_ROOT"

# Stop test containers
echo -e "${YELLOW}🔄 Stopping test containers...${NC}"
docker compose -f docker-compose.test.yml down

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test environment stopped successfully${NC}"
else
    echo -e "${RED}❌ Failed to stop test environment${NC}"
    exit 1
fi