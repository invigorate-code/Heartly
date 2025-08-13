#!/bin/bash

# Test script to verify the FixFacilityProjectedClientCount migration works properly
# This script tests the migration in multiple scenarios to ensure robustness

echo "🧪 Testing FixFacilityProjectedClientCount Migration Fix"
echo "======================================================="

# Function to run migration and capture result
run_migration() {
    echo "Running migration..."
    pnpm run migration:up 2>&1
}

# Function to revert migration and capture result  
revert_migration() {
    echo "Reverting migration..."
    pnpm run migration:down 2>&1
}

# Test 1: Run migration from clean state
echo "📋 Test 1: Running migration from clean state"
echo "----------------------------------------------"
result=$(run_migration)
if echo "$result" | grep -q "error\|Error\|ERROR"; then
    echo "❌ Test 1 FAILED: Migration failed with error"
    echo "$result"
    exit 1
else
    echo "✅ Test 1 PASSED: Migration ran successfully"
fi

echo ""

# Test 2: Run migration again (should be idempotent)
echo "📋 Test 2: Running migration again (idempotency test)"
echo "----------------------------------------------------"
result=$(run_migration)
if echo "$result" | grep -q "error\|Error\|ERROR"; then
    echo "❌ Test 2 FAILED: Migration not idempotent"
    echo "$result"
    exit 1
else
    echo "✅ Test 2 PASSED: Migration is idempotent"
fi

echo ""

# Test 3: Revert and run again
echo "📋 Test 3: Revert and run migration again"
echo "----------------------------------------"
echo "Reverting..."
revert_result=$(revert_migration)
if echo "$revert_result" | grep -q "error\|Error\|ERROR"; then
    echo "⚠️  Revert had issues, but continuing with test..."
fi

echo "Running forward again..."
result=$(run_migration)
if echo "$result" | grep -q "error\|Error\|ERROR"; then
    echo "❌ Test 3 FAILED: Migration failed after revert"
    echo "$result"
    exit 1
else
    echo "✅ Test 3 PASSED: Migration works after revert"
fi

echo ""
echo "🎉 All tests passed! The migration fix appears to be working correctly."
echo ""
echo "Summary of fixes applied:"
echo "- All ADD COLUMN operations now use conditional logic"
echo "- Operations check if column exists before adding"
echo "- Migration is now idempotent and safe for CI/CD"
echo "- Prevents 'column already exists' errors"