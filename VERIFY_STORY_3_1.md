# How to Verify Story 3.1: Facility Creation API Integration

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd heartly-backend
pnpm dev
```

### 2. Start the Frontend
```bash
cd heartly-frontend
pnpm dev
```

### 3. Run the Test Script
```bash
./test-facility-api.sh
```

## ✅ Manual Verification Steps

### Step 1: Setup
1. Open browser to http://localhost:3000
2. Login with an OWNER account (or create one if needed)
3. Complete email verification if required
4. Navigate to `/onboarding/facilities`

### Step 2: Test Facility Creation
1. Click **"Add New Facility"** button
2. Fill in the form:
   - **Facility Name**: Test Care Center
   - **Address**: 123 Test Street
   - **City**: San Francisco
   - **State**: CA
   - **Zip**: 94102
   - **Amount of Clients**: 50
   - **Room Count**: 25
   - **Phone**: +14155551234 (optional)
   - **Email**: test@facility.com (optional)
3. Click **"Save"**
4. ✅ Verify: Success toast message appears
5. ✅ Verify: Facility appears in the table

### Step 3: Test Data Persistence
1. **Refresh the page** (F5)
2. ✅ Verify: Facility still appears in the table
3. This confirms data is fetched from the backend API

### Step 4: Test Facility Update
1. Click the **pencil icon** on the facility row
2. Change the facility name to "Updated Care Center"
3. Change amount of clients to 75
4. Click **"Save"**
5. ✅ Verify: Success toast message appears
6. ✅ Verify: Updated values show in table

### Step 5: Test Facility Deletion
1. Click the **trash icon** on the facility row
2. ✅ Verify: Success toast message appears
3. ✅ Verify: Facility disappears from table

## 🔍 Developer Verification

### Check Network Calls
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **Fetch/XHR**
4. Perform facility operations and verify these API calls:

| Operation | Expected API Call |
|-----------|------------------|
| Page Load | `GET /api/getUserAndFacilities` |
| Create Facility | `POST /api/facility/create` |
| Update Facility | `PATCH /api/facility/updateFacility` |
| Delete Facility | `DELETE /api/facility/{id}` |

### Check Database (Optional)
```sql
-- Connect to PostgreSQL and run:
SELECT * FROM facilities 
WHERE tenant_id = 'your-tenant-id' 
ORDER BY created_at DESC;
```

## ✅ Success Criteria

- [ ] All facility CRUD operations work without errors
- [ ] Toast notifications appear for all operations
- [ ] Data persists after page refresh
- [ ] Network tab shows correct API calls
- [ ] No console errors during operations
- [ ] Database contains created facilities

## 🐛 Troubleshooting

### "Not authenticated" error
- Clear cookies and login again
- Ensure SuperTokens session is valid

### "Email verification required" error
- Complete email verification first
- Check email verification settings in backend

### Facilities don't appear after refresh
- Check backend is running: `http://localhost:4000/api/health`
- Check database connection
- Verify tenant context is set correctly

### Toast notifications don't appear
- Check browser console for errors
- Verify react-hot-toast is installed

## 📝 What Story 3.1 Fixed

Before this story:
- ❌ Facility creation used TODO comments and mock data
- ❌ Changes were lost on page refresh
- ❌ No backend integration

After this story:
- ✅ Full backend API integration
- ✅ Data persists in PostgreSQL database
- ✅ Proper error handling and user feedback
- ✅ All CRUD operations functional

## 🔗 Related Files Changed

- `/lib/api/facility.ts` - New facility API service
- `/app/api/getUserAndFacilities/route.ts` - Fixed endpoint
- `/app/onboarding/facilities/page.tsx` - Updated to use API
- `/app/onboarding/facilities/model.ts` - Added missing fields