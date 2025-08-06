#!/bin/bash

# Test script for SuperTokens Roles Integration (Epic 1 Story 2.3)
# This script validates the role-based access control implementation

echo "🧪 Testing SuperTokens Roles Integration - Epic 1 Story 2.3"
echo "=========================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_BASE="http://localhost:3001"
FRONTEND_BASE="http://localhost:3000"

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    echo -e "\n${BLUE}🔍 Testing: $test_name${NC}"
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Run the test command and capture both stdout and HTTP status
    response=$(eval "$test_command" 2>&1)
    status=$?
    
    # Extract HTTP status code if it's a curl command
    if [[ "$test_command" == *"curl"* ]]; then
        http_status=$(echo "$response" | tail -n1)
        if [[ "$http_status" == "$expected_status" ]]; then
            echo -e "${GREEN}✅ PASS: HTTP $http_status${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL: Expected HTTP $expected_status, got $http_status${NC}"
        fi
    else
        if [[ $status -eq 0 ]]; then
            echo -e "${GREEN}✅ PASS${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL${NC}"
        fi
    fi
}

# Function to check if file exists
check_file() {
    local file_path="$1"
    local description="$2"
    
    if [[ -f "$file_path" ]]; then
        echo -e "${GREEN}✅ Found: $description${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ Missing: $description${NC}"
    fi
    TESTS_RUN=$((TESTS_RUN + 1))
}

echo -e "\n${YELLOW}📁 Checking Backend Implementation Files...${NC}"

# Check backend files
check_file "heartly-backend/src/utils/supertokens/roles.service.ts" "SuperTokens Roles Service"
check_file "heartly-backend/src/utils/supertokens/roles.module.ts" "SuperTokens Roles Module"
check_file "heartly-backend/src/guards/supertokens-roles.guard.ts" "SuperTokens Roles Guard"
check_file "heartly-backend/src/guards/supertokens-permissions.guard.ts" "SuperTokens Permissions Guard"
check_file "heartly-backend/src/decorators/permissions.decorator.ts" "Permissions Decorator"

echo -e "\n${YELLOW}📁 Checking Test Files...${NC}"

# Check test files
check_file "heartly-backend/src/guards/supertokens-roles.guard.spec.ts" "Roles Guard Unit Tests"
check_file "heartly-backend/src/utils/supertokens/roles.service.spec.ts" "Roles Service Unit Tests"
check_file "heartly-backend/test/role-based-access.e2e-spec.ts" "E2E Integration Tests"

echo -e "\n${YELLOW}📁 Checking Frontend Implementation Files...${NC}"

# Check frontend files
check_file "heartly-frontend/components/auth/RoleBasedAccess.tsx" "Role-Based Access Components"
check_file "heartly-frontend/components/auth/__tests__/RoleBasedAccess.test.tsx" "Frontend Component Tests"
check_file "heartly-frontend/app/dashboard/settings/RoleBasedSettingsExample.tsx" "Role-Based Settings Example"

echo -e "\n${YELLOW}🔍 Checking Code Integration...${NC}"

# Check if roles are properly integrated in controllers
if grep -q "SuperTokensRolesGuard" heartly-backend/src/api/*/\*.controller.ts; then
    echo -e "${GREEN}✅ Found: SuperTokensRolesGuard usage in controllers${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: SuperTokensRolesGuard usage in controllers${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

# Check if @Roles decorator is used
if grep -q "@Roles(" heartly-backend/src/api/*/\*.controller.ts; then
    echo -e "${GREEN}✅ Found: @Roles decorator usage${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: @Roles decorator usage${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

# Check if role assignment is in signup flow
if grep -q "UserRoles.addRoleToUser" heartly-backend/src/utils/supertokens/supertokensInitConfig.ts; then
    echo -e "${GREEN}✅ Found: Role assignment in signup flow${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: Role assignment in signup flow${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

# Check if role assignment is in invitation flow
if grep -q "UserRoles.addRoleToUser" heartly-backend/src/api/auth/auth.service.ts; then
    echo -e "${GREEN}✅ Found: Role assignment in invitation flow${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: Role assignment in invitation flow${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

# Check if roles module is imported
if grep -q "SuperTokensRolesModule" heartly-backend/src/utils/modules-set.ts; then
    echo -e "${GREEN}✅ Found: SuperTokensRolesModule imported in app${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: SuperTokensRolesModule import${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

echo -e "\n${YELLOW}🎨 Checking Frontend Integration...${NC}"

# Check if navigation uses role-based filtering
if grep -q "allowedRoles" heartly-frontend/components/sidebar/navitems.tsx; then
    echo -e "${GREEN}✅ Found: Role-based navigation filtering${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Missing: Role-based navigation filtering${NC}"
fi
TESTS_RUN=$((TESTS_RUN + 1))

echo -e "\n${YELLOW}📋 Running Backend Tests...${NC}"

# Check if we're in the right directory
if [[ -d "heartly-backend" ]]; then
    cd heartly-backend
    
    # Run role guard tests
    run_test "SuperTokens Roles Guard Unit Tests" "npm test -- guards/supertokens-roles.guard.spec.ts --passWithNoTests" 0
    
    # Run roles service tests  
    run_test "SuperTokens Roles Service Unit Tests" "npm test -- utils/supertokens/roles.service.spec.ts --passWithNoTests" 0
    
    cd ..
else
    echo -e "${YELLOW}⚠️  Skipping backend tests - not in project root${NC}"
fi

echo -e "\n${YELLOW}📋 Running Frontend Tests...${NC}"

# Check if we can run frontend tests
if [[ -d "heartly-frontend" ]]; then
    cd heartly-frontend
    
    # Run role-based access component tests
    run_test "Role-Based Access Component Tests" "npm test -- components/auth/__tests__/RoleBasedAccess.test.tsx --passWithNoTests --watchAll=false" 0
    
    cd ..
else
    echo -e "${YELLOW}⚠️  Skipping frontend tests - not in project root${NC}"
fi

echo -e "\n${YELLOW}📊 Manual Verification Checklist...${NC}"

echo "
Please manually verify the following:

🔍 Backend Verification:
   □ Start the backend server (npm run start:dev)
   □ Check SuperTokens roles initialization in logs
   □ Verify role assignment during user signup
   □ Test protected endpoints with different role tokens

🔍 Frontend Verification:  
   □ Start the frontend server (npm run dev)
   □ Login with different role users (OWNER/ADMIN/STAFF)
   □ Verify navigation items show/hide based on roles
   □ Test role-based component rendering

🔍 Integration Testing:
   □ Create users with different roles through invitation flow
   □ Verify SuperTokens UserRoles recipe is working
   □ Test role-based API access control
   □ Confirm session role synchronization

🔍 Error Handling:
   □ Test unauthorized access attempts
   □ Verify proper HTTP 403 responses for insufficient roles
   □ Test invalid/expired session tokens
"

# Summary
echo -e "\n${YELLOW}📊 Test Summary${NC}"
echo "=============="
echo -e "Tests Run: $TESTS_RUN"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $((TESTS_RUN - TESTS_PASSED))${NC}"

if [[ $TESTS_PASSED -eq $TESTS_RUN ]]; then
    echo -e "\n${GREEN}🎉 All automated tests PASSED!${NC}"
    echo -e "${GREEN}✅ SuperTokens Roles Integration appears to be working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests FAILED. Please review the implementation.${NC}"
    exit 1
fi