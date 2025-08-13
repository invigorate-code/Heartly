#!/bin/bash

# Test Script for Story 3.1: Facility Creation API Integration
# This script tests that facility CRUD operations are properly using the NestJS backend API

echo "======================================"
echo "Testing Story 3.1: Facility API Integration"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"

# Check if backend is running
echo "1. Checking if backend is running..."
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health" | grep -q "200"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not running. Please start it with 'pnpm dev' in heartly-backend${NC}"
    exit 1
fi

# Check if frontend is running
echo ""
echo "2. Checking if frontend is running..."
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200\|304"; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend is not running. Please start it with 'pnpm dev' in heartly-frontend${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo "Manual Testing Steps"
echo "======================================"
echo ""
echo "Please follow these steps to verify the facility API integration:"
echo ""
echo "${YELLOW}Step 1: Login and Navigate to Onboarding${NC}"
echo "  1. Open browser to http://localhost:3000"
echo "  2. Login with an OWNER account (or create one)"
echo "  3. Navigate to /onboarding/facilities"
echo ""
echo "${YELLOW}Step 2: Test Facility Creation${NC}"
echo "  1. Click 'Add New Facility' button"
echo "  2. Fill in the form with:"
echo "     - Facility Name: Test Care Center"
echo "     - Address: 123 Test Street"
echo "     - City: San Francisco"
echo "     - State: CA"
echo "     - Zip: 94102"
echo "     - Amount of Clients: 50"
echo "     - Room Count: 25"
echo "     - Phone: +14155551234 (optional)"
echo "     - Email: test@facility.com (optional)"
echo "  3. Click 'Save'"
echo "  4. Verify: Success toast message appears"
echo "  5. Verify: Facility appears in the table"
echo ""
echo "${YELLOW}Step 3: Test Page Refresh (Data Persistence)${NC}"
echo "  1. Refresh the page (F5)"
echo "  2. Verify: Facility still appears in the table"
echo "  3. This confirms data is fetched from backend API"
echo ""
echo "${YELLOW}Step 4: Test Facility Update${NC}"
echo "  1. Click the pencil icon on the facility row"
echo "  2. Change the facility name to 'Updated Care Center'"
echo "  3. Change amount of clients to 75"
echo "  4. Click 'Save'"
echo "  5. Verify: Success toast message appears"
echo "  6. Verify: Updated values show in table"
echo ""
echo "${YELLOW}Step 5: Test Facility Deletion${NC}"
echo "  1. Click the trash icon on the facility row"
echo "  2. Verify: Success toast message appears"
echo "  3. Verify: Facility disappears from table"
echo ""
echo "${YELLOW}Step 6: Check Browser Console${NC}"
echo "  1. Open browser DevTools (F12)"
echo "  2. Go to Network tab"
echo "  3. Perform any facility operation"
echo "  4. Verify these API calls are made:"
echo "     - GET /api/getUserAndFacilities (on page load)"
echo "     - POST /api/facility/create (when creating)"
echo "     - PATCH /api/facility/updateFacility (when updating)"
echo "     - DELETE /api/facility/{id} (when deleting)"
echo ""
echo "${YELLOW}Step 7: Check Database (Optional)${NC}"
echo "  1. Connect to PostgreSQL database"
echo "  2. Run: SELECT * FROM facilities WHERE tenant_id = 'your-tenant-id';"
echo "  3. Verify: Facilities created through UI exist in database"
echo ""
echo "======================================"
echo "Expected Results"
echo "======================================"
echo ""
echo "${GREEN}✓ All facility operations should show toast notifications${NC}"
echo "${GREEN}✓ Data should persist after page refresh${NC}"
echo "${GREEN}✓ Network tab should show API calls to backend${NC}"
echo "${GREEN}✓ No console errors during operations${NC}"
echo "${GREEN}✓ Facilities should be saved to database${NC}"
echo ""
echo "======================================"
echo "Common Issues & Solutions"
echo "======================================"
echo ""
echo "${YELLOW}Issue: 'Not authenticated' error${NC}"
echo "Solution: Clear cookies and login again"
echo ""
echo "${YELLOW}Issue: 'Email verification required' error${NC}"
echo "Solution: Verify your email first or check email verification settings"
echo ""
echo "${YELLOW}Issue: Facilities don't appear after refresh${NC}"
echo "Solution: Check if backend is running and database is connected"
echo ""
echo "${YELLOW}Issue: Toast notifications don't appear${NC}"
echo "Solution: Check if react-hot-toast is properly configured"
echo ""
echo "======================================"
echo "Automated API Test (requires authentication)"
echo "======================================"
echo ""
echo "To run automated tests, you need a valid session token."
echo "After logging in, you can get it from browser DevTools:"
echo "1. Open Application/Storage tab"
echo "2. Find cookies for localhost:3000"
echo "3. Copy the sAccessToken value"
echo ""
echo "Then run: ./test-facility-api.sh <your-session-token>"
echo ""

# If session token is provided, run automated tests
if [ ! -z "$1" ]; then
    SESSION_TOKEN=$1
    echo "Running automated tests with provided session token..."
    echo ""
    
    # Test getUserAndFacilities endpoint
    echo "Testing GET /api/getUserAndFacilities..."
    RESPONSE=$(curl -s -w "\n%{http_code}" -H "Cookie: sAccessToken=$SESSION_TOKEN" "$FRONTEND_URL/api/getUserAndFacilities")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ getUserAndFacilities endpoint working${NC}"
        echo "Response: $BODY" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ getUserAndFacilities failed with status $HTTP_CODE${NC}"
        echo "Response: $BODY"
    fi
    
    echo ""
    echo "Note: Full CRUD testing requires more complex automation."
    echo "Please perform manual testing for complete verification."
fi

echo ""
echo "======================================"
echo "Test Complete!"
echo "======================================"