#!/bin/bash
# Email Verification Testing Script
# Tests all protected endpoints to verify email verification enforcement

echo "🧪 Email Verification Testing Script"
echo "===================================="

# Configuration
BACKEND_URL="http://localhost:3001"
LOGIN_DATA='{"formFields":[{"id":"email","value":"eludden35"},{"id":"password","value":"SuperSecret1!"}]}'
COOKIE_FILE="test_cookies.txt"

echo ""
echo "📋 Prerequisites Check:"
echo "- Backend should be running on $BACKEND_URL" 
echo "- User 'eludden35' should exist and be unverified"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=${3:-""}
    local expected_status=$4
    local description=$5
    
    echo "Testing: $description"
    echo "  → $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method "$BACKEND_URL$endpoint" \
            -H "Content-Type: application/json" \
            -b $COOKIE_FILE \
            -d "$data")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method "$BACKEND_URL$endpoint" \
            -H "Content-Type: application/json" \
            -b $COOKIE_FILE)
    fi
    
    # Extract the body and status code
    body=$(echo $response | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
    status=$(echo $response | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    
    if [ "$status" = "$expected_status" ]; then
        echo "  ✅ Status: $status (Expected: $expected_status)"
    else
        echo "  ❌ Status: $status (Expected: $expected_status)"
    fi
    
    # Show relevant part of response
    if [ "$status" = "401" ]; then
        echo "  📄 Response: $(echo $body | jq -r '.message' 2>/dev/null || echo $body)"
    elif [ "$status" = "200" ]; then
        echo "  📄 Response: $(echo $body | jq -r '.status // .message' 2>/dev/null || echo "Success")"
    else
        echo "  📄 Response: $(echo $body | head -c 100)..."
    fi
    echo ""
}

# Step 1: Login to get session
echo "🔐 Step 1: Login with unverified user"
login_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$BACKEND_URL/auth/signin" \
    -H "Content-Type: application/json" \
    -c $COOKIE_FILE \
    -d "$LOGIN_DATA")

login_status=$(echo $login_response | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
login_body=$(echo $login_response | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')

if [ "$login_status" = "200" ]; then
    echo "✅ Login successful"
    # Check if user is verified
    is_verified=$(echo $login_body | jq -r '.user.loginMethods[0].verified' 2>/dev/null)
    echo "📧 Email verified: $is_verified"
    if [ "$is_verified" = "true" ]; then
        echo "⚠️  WARNING: User is verified - tests expect unverified user"
    fi
else
    echo "❌ Login failed with status: $login_status"
    echo "Response: $login_body"
    exit 1
fi
echo ""

# Step 2: Test accessible endpoint (should work)
echo "🟢 Step 2: Test Accessible Endpoints (Should work for unverified users)"
test_endpoint "POST" "/api/auth/getBasicUserInfo" "" "200" "Basic User Info (Used by middleware)"

# Step 3: Test protected endpoints (should fail with 401)
echo "🔒 Step 3: Test Protected Endpoints (Should require email verification)"
test_endpoint "POST" "/api/auth/getUserSession" "" "401" "Get Full User Session"
test_endpoint "GET" "/api/facility/getLoggedInUserFacilities" "" "401" "Get User Facilities"

# Test client creation with proper data
CLIENT_DATA='{"firstName":"Test","lastName":"Client","birthDate":"1990-01-01","uci":"TEST123","tenantId":"test-tenant","facilityId":"test-facility-id"}'
test_endpoint "POST" "/api/client/create" "$CLIENT_DATA" "401" "Create Client"

# Step 4: Test other verification-related endpoints
echo "🔄 Step 4: Test Verification-Related Endpoints"
test_endpoint "POST" "/auth/send-email-verification-link" '{"email":"eludden35"}' "200" "Send Verification Email (Should work)"

# Cleanup
rm -f $COOKIE_FILE

echo "🏁 Testing Complete!"
echo ""
echo "📊 Expected Results Summary:"
echo "✅ getBasicUserInfo: 200 OK (needed for middleware)"
echo "❌ getUserSession: 401 'Email verification required'"
echo "❌ getLoggedInUserFacilities: 401 'Email verification required for accessing user facilities'"
echo "❌ client/create: 401 'Email verification required for client creation'"
echo "✅ send-email-verification-link: 200 OK (needed for verification flow)"
echo ""
echo "🔧 To test with verified user:"
echo "1. Verify the email for user 'eludden35'"
echo "2. Re-run this script"
echo "3. All protected endpoints should return 200 instead of 401"