#!/bin/bash

# Development Progress Calculator for Heartly Project
# This script calculates real metrics from the project state

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Progress bar function
print_progress_bar() {
    local current=${1:-0}
    local total=${2:-1}
    local width=50
    
    # Handle edge cases
    if [ "$total" -eq 0 ] || [ -z "$total" ]; then
        total=1
    fi
    
    if [ "$current" -gt "$total" ]; then
        current=$total
    fi
    
    local percentage=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))
    
    # Ensure filled doesn't exceed width
    if [ $filled -gt $width ]; then
        filled=$width
        empty=0
    fi
    
    printf "${CYAN}Progress: ["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "] ${percentage}%%${NC}\n"
}

# Calculate test coverage
calculate_test_coverage() {
    local coverage_file="coverage/coverage-summary.json"
    if [ -f "$coverage_file" ]; then
        local coverage=$(node -e "
            try {
                const coverage = require('./coverage/coverage-summary.json');
                const total = coverage.total;
                const covered = total.statements.pct + total.branches.pct + total.functions.pct + total.lines.pct;
                console.log(Math.round(covered / 4));
            } catch (e) {
                console.log(0);
            }
        " 2>/dev/null || echo 0)
        echo "${coverage:-0}"
    else
        echo "0"
    fi
}

# Calculate code quality score
calculate_code_quality() {
    # Use a simpler approach for code quality
    local source_files=$(find src -name "*.ts" 2>/dev/null | wc -l)
    local test_files=$(find . -name "*.spec.ts" 2>/dev/null | wc -l)
    
    if [ "$source_files" -eq 0 ]; then
        echo "0"
    else
        # Calculate quality based on test coverage ratio
        local test_ratio=$((test_files * 100 / source_files))
        if [ $test_ratio -gt 100 ]; then
            test_ratio=100
        fi
        echo "$test_ratio"
    fi
}

# Count completed features based on API endpoints
count_completed_features() {
    local api_dir="src/api"
    local completed=0
    local total=12  # Fixed total based on expected features
    
    if [ -d "$api_dir" ]; then
        # Count implemented API modules
        completed=$(find "$api_dir" -name "*.module.ts" 2>/dev/null | wc -l)
    fi
    
    echo "$completed $total"
}

# Calculate documentation completeness
calculate_docs_progress() {
    local docs_dir="docs"
    local total_docs=0
    local completed_docs=0
    
    if [ -d "$docs_dir" ]; then
        # Count documentation files
        total_docs=$(find "$docs_dir" -name "*.md" 2>/dev/null | wc -l)
        
        # Count completed documentation (files with substantial content)
        completed_docs=$(find "$docs_dir" -name "*.md" -exec wc -l {} + 2>/dev/null | awk '$1 > 10 {count++} END {print count+0}')
    fi
    
    if [ "$total_docs" -eq 0 ]; then
        echo "0 10"
    else
        echo "$completed_docs $total_docs"
    fi
}

# Calculate database migration progress
calculate_migration_progress() {
    local migrations_dir="src/database/migrations"
    local completed=0
    local total=20  # Fixed estimate
    
    if [ -d "$migrations_dir" ]; then
        completed=$(find "$migrations_dir" -name "*.ts" 2>/dev/null | wc -l)
    fi
    
    echo "$completed $total"
}

# Main progress calculation function
calculate_dev_progress() {
    echo "${PURPLE}=== Development Progress Report ===${NC}"
    
    # Test coverage
    local test_coverage=$(calculate_test_coverage)
    local target_coverage=90
    echo "${BLUE}Test Coverage:${NC}"
    print_progress_bar "$test_coverage" "$target_coverage"
    
    # Code quality
    local code_quality=$(calculate_code_quality)
    local target_quality=95
    echo "${BLUE}Code Quality (Test Ratio):${NC}"
    print_progress_bar "$code_quality" "$target_quality"
    
    # Feature completion
    local feature_counts=$(count_completed_features)
    local completed_features=$(echo "$feature_counts" | cut -d' ' -f1)
    local total_features=$(echo "$feature_counts" | cut -d' ' -f2)
    echo "${BLUE}API Features Implemented:${NC}"
    print_progress_bar "$completed_features" "$total_features"
    
    # Documentation
    local docs_counts=$(calculate_docs_progress)
    local docs_complete=$(echo "$docs_counts" | cut -d' ' -f1)
    local target_docs=$(echo "$docs_counts" | cut -d' ' -f2)
    echo "${BLUE}Documentation:${NC}"
    print_progress_bar "$docs_complete" "$target_docs"
    
    # Database migrations
    local migration_counts=$(calculate_migration_progress)
    local migrations_complete=$(echo "$migration_counts" | cut -d' ' -f1)
    local total_migrations=$(echo "$migration_counts" | cut -d' ' -f2)
    echo "${BLUE}Database Migrations:${NC}"
    print_progress_bar "$migrations_complete" "$total_migrations"
    
    # Overall project progress with safe division
    local feature_progress=0
    if [ "${total_features:-0}" -gt 0 ]; then
        feature_progress=$((completed_features * 100 / total_features))
    fi
    
    local docs_progress=0
    if [ "${target_docs:-0}" -gt 0 ]; then
        docs_progress=$((docs_complete * 100 / target_docs))
    fi
    
    local migration_progress=0
    if [ "${total_migrations:-0}" -gt 0 ]; then
        migration_progress=$((migrations_complete * 100 / total_migrations))
    fi
    
    local overall_progress=$(((test_coverage + code_quality + feature_progress + docs_progress + migration_progress) / 5))
    echo "${GREEN}Overall Project Progress:${NC}"
    print_progress_bar "$overall_progress" "100"
    
    echo ""
    
    # Additional metrics
    echo "${YELLOW}=== Additional Metrics ===${NC}"
    echo "${BLUE}Total API Endpoints:${NC} $(find src/api -name "*.controller.ts" -exec grep -l "@Get\|@Post\|@Put\|@Delete" {} \; 2>/dev/null | wc -l)"
    echo "${BLUE}Database Entities:${NC} $(find src/common/entities -name "*.ts" 2>/dev/null | wc -l)"
    echo "${BLUE}Test Files:${NC} $(find . -name "*.spec.ts" 2>/dev/null | wc -l)"
    echo "${BLUE}Source Files:${NC} $(find src -name "*.ts" 2>/dev/null | wc -l)"
    
    echo ""
}

# Export function for use in pre-push hook
export -f calculate_dev_progress
export -f print_progress_bar

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    calculate_dev_progress
fi 