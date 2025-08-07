// Quick smoke test script for custom roles
// Run with: node smoke-test-roles.js

const BASE_URL = 'http://localhost:3000/api';

async function smokeTestCustomRoles() {
  console.log('🚀 Starting Custom Roles Smoke Test...\n');

  // You'll need to replace these with actual tokens from your app
  const OWNER_TOKEN = process.env.OWNER_TOKEN || 'your-owner-token-here';
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-admin-token-here';
  
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    // Test 1: Get available permissions (should work for OWNER and ADMIN)
    console.log('1. Testing permissions endpoint...');
    const permissionsResponse = await fetch(`${BASE_URL}/custom-roles/permissions`, {
      headers: { ...headers, 'Authorization': `Bearer ${OWNER_TOKEN}` }
    });
    console.log(`   Permissions Status: ${permissionsResponse.status}`);
    if (permissionsResponse.ok) {
      const permissions = await permissionsResponse.json();
      console.log(`   Available permissions: ${permissions.permissions.length}`);
    }

    // Test 2: Create a custom role (OWNER only)
    console.log('\n2. Testing custom role creation...');
    const createRoleResponse = await fetch(`${BASE_URL}/custom-roles`, {
      method: 'POST',
      headers: { ...headers, 'Authorization': `Bearer ${OWNER_TOKEN}` },
      body: JSON.stringify({
        name: 'smoke_test_role',
        displayName: 'Smoke Test Role',
        description: 'Test role for smoke testing',
        permissions: ['users:read', 'clients:read']
      })
    });
    console.log(`   Create Role Status: ${createRoleResponse.status}`);
    
    let createdRoleId;
    if (createRoleResponse.ok) {
      const role = await createRoleResponse.json();
      createdRoleId = role.id;
      console.log(`   Created role ID: ${createdRoleId}`);
    }

    // Test 3: List all roles (should include system + custom)
    console.log('\n3. Testing roles list...');
    const listResponse = await fetch(`${BASE_URL}/custom-roles`, {
      headers: { ...headers, 'Authorization': `Bearer ${ADMIN_TOKEN}` }
    });
    console.log(`   List Roles Status: ${listResponse.status}`);
    if (listResponse.ok) {
      const roles = await listResponse.json();
      console.log(`   System roles: ${roles.systemRoles?.length || 0}`);
      console.log(`   Custom roles: ${roles.customRoles?.length || 0}`);
    }

    // Test 4: Try admin creating role (should fail with 403)
    console.log('\n4. Testing admin role creation (should fail)...');
    const adminCreateResponse = await fetch(`${BASE_URL}/custom-roles`, {
      method: 'POST',
      headers: { ...headers, 'Authorization': `Bearer ${ADMIN_TOKEN}` },
      body: JSON.stringify({
        name: 'admin_test_role',
        displayName: 'Admin Test Role',
        permissions: ['users:read']
      })
    });
    console.log(`   Admin Create Status: ${adminCreateResponse.status} (should be 403)`);

    // Test 5: Clean up - delete test role
    if (createdRoleId) {
      console.log('\n5. Cleaning up test role...');
      const deleteResponse = await fetch(`${BASE_URL}/custom-roles/${createdRoleId}`, {
        method: 'DELETE',
        headers: { ...headers, 'Authorization': `Bearer ${OWNER_TOKEN}` }
      });
      console.log(`   Delete Role Status: ${deleteResponse.status}`);
    }

    console.log('\n✅ Smoke test completed!');
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error);
  }
}

// Usage instructions
if (require.main === module) {
  console.log('To run this smoke test:');
  console.log('1. Make sure your backend is running (npm run start:dev)');
  console.log('2. Set environment variables:');
  console.log('   export OWNER_TOKEN="your-owner-jwt-token"');
  console.log('   export ADMIN_TOKEN="your-admin-jwt-token"');
  console.log('3. Run: node smoke-test-roles.js');
  console.log('\nAlternatively, replace the tokens in this file and run it directly.\n');
  
  // Uncomment to run if tokens are set
  // smokeTestCustomRoles();
}

module.exports = { smokeTestCustomRoles };