# Frontend Email Verification Flow Testing Guide

## Overview
This guide provides manual testing steps for the complete email verification workflow from frontend to backend integration.

## Prerequisites
- Backend running on `http://localhost:3001`
- Frontend running on `http://localhost:3000` (or available port)
- User account: `eludden35` / `SuperSecret1!` (should be unverified)

## Test Scenarios

### 1. Unverified User Login Flow
**Expected Behavior**: Unverified users should be redirected to email verification page

#### Steps:
1. Open browser to `http://localhost:3000/login`
2. Login with: `eludden35` / `SuperSecret1!`
3. **Expected Result**: Should redirect to `/email-verification-required`
4. **Verify**: User should NOT reach `/dashboard`

#### Browser Console Checks:
- Look for login response with `"verified": false`
- Check middleware logs showing authentication and verification status
- Verify session context is properly set

### 2. Auth Page Protection (Logged In Users)
**Expected Behavior**: Authenticated users should be redirected away from auth pages

#### Steps:
1. After logging in (while still unverified), try to access:
   - `http://localhost:3000/login` → Should redirect to `/email-verification-required`
   - `http://localhost:3000/sign-up` → Should redirect to `/email-verification-required`  
   - `http://localhost:3000/` (landing page) → Should redirect to `/email-verification-required`

#### What to Check:
- URL changes automatically (redirects work)
- User cannot manually navigate to auth pages
- Middleware logs show user is authenticated but unverified

### 3. Protected Route Access (Unverified Users)
**Expected Behavior**: Unverified users should be blocked from protected routes

#### Steps:
1. While logged in as unverified user, try to access:
   - `http://localhost:3000/dashboard` → Should redirect to `/email-verification-required`
   - `http://localhost:3000/onboarding` → Should redirect to `/email-verification-required`

#### API Calls (Check Network Tab):
- Any API calls to protected endpoints should return `401 Unauthorized`
- `getBasicUserInfo` calls should return `200 OK` with `"isEmailVerified": false`

### 4. Session Persistence Testing
**Expected Behavior**: Session should persist across browser restarts

#### Steps:
1. Login as unverified user
2. Close browser completely
3. Reopen browser and navigate to `http://localhost:3000/`
4. **Expected Result**: Should still be logged in and redirect to `/email-verification-required`

#### Additional Checks:
- Check browser cookies for SuperTokens session cookies
- Verify session persists across page refreshes
- Test session expiry behavior (if configured)

### 5. Email Verification Required Page
**Expected Behavior**: Unverified users should see verification UI

#### Steps:
1. Access `/email-verification-required` as unverified user
2. **Check for**:
   - Clear messaging about email verification requirement
   - Button/link to resend verification email
   - User email displayed
   - No navigation to protected areas

### 6. Verified User Flow (After Email Verification)
**Expected Behavior**: Verified users should have full access

#### Steps:
1. Verify the user email (through backend/database)
2. Login again with same credentials
3. **Expected Result**: Should redirect to `/dashboard`
4. **Additional Access**:
   - Can access all protected routes
   - API calls to protected endpoints return `200 OK`
   - Redirected away from auth pages to `/dashboard`

## Testing Commands

### Check Session Status:
```bash
# Check current session status
curl -X POST http://localhost:3001/api/auth/getBasicUserInfo \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

### Test Protected Endpoint:
```bash
# Should return 401 for unverified users
curl -X POST http://localhost:3001/api/auth/getUserSession \
  -H "Content-Type: application/json" \
  --cookie cookies.txt
```

### Verify User in Database:
```sql
-- Check user verification status
SELECT id, email, verified 
FROM user_login_methods 
WHERE email LIKE '%eludden35%';

-- Verify user (for testing verified flow)
UPDATE user_login_methods 
SET verified = true 
WHERE email LIKE '%eludden35%';
```

## Common Issues & Troubleshooting

### Issue: User not redirected after login
**Possible Causes**:
- Login response not returning verification status
- Frontend routing logic not working
- Session not being created properly

**Debug Steps**:
1. Check browser console for login response
2. Verify `loginMethods[0].verified` value
3. Check Network tab for redirect attempts

### Issue: Session not persisting
**Possible Causes**:
- Cookie settings incorrect
- CORS configuration issues
- Session storage problems

**Debug Steps**:
1. Check browser cookies for `sAccessToken` and `sRefreshToken`
2. Verify cookie domain and path settings
3. Check CORS headers in network requests

### Issue: Protected endpoints accessible
**Possible Causes**:
- Email verification guards not applied
- Session payload not containing verification status
- Middleware not running

**Debug Steps**:
1. Test endpoints with curl to isolate frontend issues
2. Check backend logs for verification checks
3. Verify session payload contains `st-ev` claim

## Success Criteria

### ✅ Unverified User Experience:
- [x] Can login successfully
- [x] Redirected to email verification page
- [x] Cannot access protected routes or pages
- [x] Session persists across browser restarts
- [x] Clear error messages for blocked actions

### ✅ Verified User Experience:
- [x] Can login and access dashboard
- [x] Full access to protected routes
- [x] Redirected away from auth pages
- [x] All API endpoints accessible

### ✅ Security Validation:
- [x] Unverified users cannot access business logic
- [x] Protected endpoints return proper 401 errors
- [x] Session verification works correctly
- [x] No unauthorized data access possible

## Automated Testing
Run the automated test script:
```bash
./test-email-verification.sh
```

This script tests all the backend API endpoints and provides a comprehensive report of the email verification enforcement.