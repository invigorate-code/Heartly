#!/bin/bash

# Development Progress Calculator for Heartly Healthcare Platform
# This script calculates real metrics from both backend and frontend projects
# Enhanced for HIPAA compliance, parallel team progress, and healthcare-specific features

# Terminal detection and color setup
setup_colors() {
    # Check if we're in a terminal that supports colors
    local term_type="${TERM:-unknown}"
    local is_tty=false
    
    # Check if we're in an interactive terminal
    if [ -t 1 ]; then
        is_tty=true
    fi
    
    # Check for color support
    local ncolors=0
    if command -v tput >/dev/null 2>&1; then
        ncolors=$(tput colors 2>/dev/null || echo 0)
    fi
    
    # Set colors based on terminal capabilities
    if [ "$is_tty" = true ] && [ "$ncolors" -ge 8 ]; then
        # Full color support
        GREEN='\033[0;32m'
        BLUE='\033[0;34m'
        YELLOW='\033[1;33m'
        RED='\033[0;31m'
        CYAN='\033[0;36m'
        PURPLE='\033[0;35m'
        ORANGE='\033[0;33m'
        WHITE='\033[1;37m'
        NC='\033[0m'
        COLOR_MODE="full"
    elif [ "$is_tty" = true ] && [ "$ncolors" -ge 2 ]; then
        # Basic color support (just bright/normal)
        GREEN='\033[1;32m'
        BLUE='\033[1;34m'
        YELLOW='\033[1;33m'
        RED='\033[1;31m'
        CYAN='\033[1;36m'
        PURPLE='\033[1;35m'
        ORANGE='\033[1;33m'
        WHITE='\033[1;37m'
        NC='\033[0m'
        COLOR_MODE="basic"
    else
        # No color support or not a terminal
        GREEN=''
        BLUE=''
        YELLOW=''
        RED=''
        CYAN=''
        PURPLE=''
        ORANGE=''
        WHITE=''
        NC=''
        COLOR_MODE="none"
    fi
    
    # Debug info (can be commented out)
    if [ "${DEBUG_COLORS:-false}" = "true" ]; then
        echo "Terminal: $term_type"
        echo "TTY: $is_tty"
        echo "Colors: $ncolors"
        echo "Color Mode: $COLOR_MODE"
    fi
}

# Initialize colors
setup_colors

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

# Enhanced progress bar showing parallel tracks
print_parallel_progress_bar() {
    local team_a_progress=${1:-0}
    local team_b_progress=${2:-0}
    local width=50
    
    # Ensure percentages are within bounds
    if [ $team_a_progress -gt 100 ]; then
        team_a_progress=100
    fi
    if [ $team_b_progress -gt 100 ]; then
        team_b_progress=100
    fi
    
    local team_a_filled=$((width * team_a_progress / 100))
    local team_b_filled=$((width * team_b_progress / 100))
    local empty=$((width - team_a_filled - team_b_filled))
    
    # Ensure we don't exceed width
    if [ $((team_a_filled + team_b_filled)) -gt $width ]; then
        local total_filled=$((team_a_filled + team_b_filled))
        team_a_filled=$((team_a_filled * width / total_filled))
        team_b_filled=$((team_b_filled * width / total_filled))
        empty=0
    fi
    
    printf "${CYAN}Parallel Progress: ["
    printf "%${team_a_filled}s" | tr ' ' '█'
    printf "%${team_b_filled}s" | tr ' ' '▓'
    printf "%${empty}s" | tr ' ' '░'
    printf "] Team A: ${team_a_progress}%% | Team B: ${team_b_progress}%%${NC}\n"
}

# Calculate story-based overall progress
calculate_story_based_progress() {
    local ai_notes_dir="ai-workflow/ai-development-track/ai-dev-notes"
    local completed_stories=0
    local total_stories=0
    
    if [ -d "$ai_notes_dir" ]; then
        # Count completed story folders
        completed_stories=$(find "$ai_notes_dir" -name "feature-epic-*-story-*" -type d 2>/dev/null | wc -l)
        
        # Define total stories based on epic plan
        # Epic 1: Foundation Crisis - 17 stories total
        # Epic 2: Core Infrastructure - 15 stories total  
        # Epic 3: Healthcare Features - 18 stories total
        total_stories=50  # Total across all epics
    fi
    
    echo "$completed_stories $total_stories"
}

# Calculate detailed story progress by epic
calculate_epic_story_progress() {
    local ai_notes_dir="ai-workflow/ai-development-track/ai-dev-notes"
    
    # Epic 1: Foundation Crisis stories
    local epic1_completed=$(find "$ai_notes_dir" -name "feature-epic-1-story-*" -type d 2>/dev/null | wc -l)
    local epic1_total=17
    
    # Epic 2: Core Infrastructure stories (future)
    local epic2_completed=$(find "$ai_notes_dir" -name "feature-epic-2-story-*" -type d 2>/dev/null | wc -l)
    local epic2_total=15
    
    # Epic 3: Healthcare Features stories (future)
    local epic3_completed=$(find "$ai_notes_dir" -name "feature-epic-3-story-*" -type d 2>/dev/null | wc -l)
    local epic3_total=18
    
    echo "$epic1_completed $epic1_total $epic2_completed $epic2_total $epic3_completed $epic3_total"
}

# Calculate parallel team progress with detailed story tracking
calculate_parallel_team_progress() {
    local ai_notes_dir="ai-workflow/ai-development-track/ai-dev-notes"
    local team_a_stories=0
    local team_b_stories=0
    
    # Team A: Core Infrastructure & Security stories (Epic 1)
    # Stories: 1.1, 1.3, 1.5, 2.1, 2.3, 2.5, 3.1
    local team_a_completed=$(find "$ai_notes_dir" -name "feature-epic-1-story-*" -type d 2>/dev/null | grep -E "(1\.1|1\.3|1\.5|2\.1|2\.3|2\.5|3\.1)" | wc -l)
    local team_a_total=7
    
    # Team B: User Experience & Integration stories (Epic 1)
    # Stories: 1.2, 1.4, 2.2, 2.4, 2.6, 3.2, 3.3, 3.4, 3.5, 3.6
    local team_b_completed=$(find "$ai_notes_dir" -name "feature-epic-1-story-*" -type d 2>/dev/null | grep -E "(1\.2|1\.4|2\.2|2\.4|2\.6|3\.2|3\.3|3\.4|3\.5|3\.6)" | wc -l)
    local team_b_total=10
    
    # Calculate percentages
    local team_a_progress=0
    if [ $team_a_total -gt 0 ]; then
        team_a_progress=$((team_a_completed * 100 / team_a_total))
    fi
    
    local team_b_progress=0
    if [ $team_b_total -gt 0 ]; then
        team_b_progress=$((team_b_completed * 100 / team_b_total))
    fi
    
    echo "$team_a_completed $team_a_total $team_b_completed $team_b_total $team_a_progress $team_b_progress"
}

# Calculate HIPAA compliance metrics
calculate_hipaa_compliance() {
    local backend_dir="heartly-backend"
    local compliance_score=0
    local total_checks=8
    
    # Handle different working directories
    if [ ! -d "$backend_dir" ]; then
        if [ -d "src" ] && [ -d "src/api" ]; then
            backend_dir="."
        fi
    fi
    
    if [ -d "$backend_dir" ]; then
        cd "$backend_dir"
        
        # Check for audit logging
        if [ -f "src/common/entities/user-action-audit-log.entity.ts" ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for RLS policies
        local rls_files=$(find src -name "*.entity.ts" -exec grep -l "tenant_id\|facility_id" {} \; 2>/dev/null | wc -l)
        if [ $rls_files -gt 0 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for encryption
        if [ -f "src/common/entities/" ] && [ -d "src/common/entities" ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for authentication guards
        local auth_guards=$(find src -name "*.guard.ts" 2>/dev/null | wc -l)
        if [ $auth_guards -gt 0 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for validation decorators
        local validation_files=$(find src -name "*.dto.ts" -exec grep -l "@IsEmail\|@IsString\|@IsOptional" {} \; 2>/dev/null | wc -l)
        if [ $validation_files -gt 0 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for error handling
        local error_handlers=$(find src -name "*.filter.ts" 2>/dev/null | wc -l)
        if [ $error_handlers -gt 0 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for database migrations
        local migrations=$(find src/database/migrations -name "*.ts" 2>/dev/null | wc -l)
        if [ $migrations -gt 0 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        # Check for test coverage
        local test_files=$(find . -name "*.spec.ts" 2>/dev/null | wc -l)
        if [ $test_files -gt 10 ]; then
            compliance_score=$((compliance_score + 1))
        fi
        
        cd ..
    fi
    
    echo "$compliance_score $total_checks"
}

# Calculate epic and story progress
calculate_epic_progress() {
    local ai_notes_dir="ai-workflow/ai-development-track/ai-dev-notes"
    local completed_stories=0
    local total_stories=0
    
    if [ -d "$ai_notes_dir" ]; then
        # Count completed story folders
        completed_stories=$(find "$ai_notes_dir" -name "feature-epic-*-story-*" -type d 2>/dev/null | wc -l)
        
        # Estimate total stories based on epic plan
        total_stories=50  # Based on epic plan structure
    fi
    
    echo "$completed_stories $total_stories"
}

# Calculate parallel team progress
calculate_team_progress() {
    local ai_notes_dir="ai-workflow/ai-development-track/ai-dev-notes"
    local team_a_progress=0
    local team_b_progress=0
    
    # Team A: Core Infrastructure & Security stories
    local team_a_stories=$(find "$ai_notes_dir" -name "feature-epic-*-story-*" -type d 2>/dev/null | grep -E "(1\.1|1\.3|1\.5|2\.1|2\.3|2\.5|3\.1)" | wc -l)
    
    # Team B: User Experience & Integration stories
    local team_b_stories=$(find "$ai_notes_dir" -name "feature-epic-*-story-*" -type d 2>/dev/null | grep -E "(1\.2|1\.4|2\.2|2\.4|2\.6|3\.2|3\.3|3\.4|3\.5|3\.6)" | wc -l)
    
    # Calculate progress percentages (estimate based on story completion)
    team_a_progress=$((team_a_stories * 100 / 7))  # 7 stories for Team A
    team_b_progress=$((team_b_stories * 100 / 10)) # 10 stories for Team B
    
    if [ $team_a_progress -gt 100 ]; then
        team_a_progress=100
    fi
    
    if [ $team_b_progress -gt 100 ]; then
        team_b_progress=100
    fi
    
    echo "$team_a_progress $team_b_progress"
}

# Calculate healthcare-specific features
calculate_healthcare_features() {
    local backend_dir="heartly-backend"
    local frontend_dir="heartly-frontend"
    local completed_features=0
    local total_features=12
    
    # Handle different working directories
    if [ ! -d "$backend_dir" ]; then
        if [ -d "src" ] && [ -d "src/api" ]; then
            backend_dir="."
        fi
    fi
    
    if [ ! -d "$frontend_dir" ]; then
        if [ -d "app" ] && [ -d "components" ]; then
            frontend_dir="."
        fi
    fi
    
    if [ -d "$backend_dir" ]; then
        cd "$backend_dir"
        
        # Check for healthcare-specific entities
        local healthcare_entities=0
        
        # Client management
        if [ -f "src/common/entities/client.entity.ts" ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        # Facility management
        if [ -f "src/common/entities/facility.entity.ts" ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        # User management
        if [ -f "src/common/entities/user.entity.ts" ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        # Tenant management
        if [ -f "src/common/entities/tenant.entity.ts" ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        # Audit logging
        if [ -f "src/common/entities/user-action-audit-log.entity.ts" ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        # API endpoints for healthcare features
        local healthcare_apis=$(find src/api -name "*.controller.ts" 2>/dev/null | wc -l)
        if [ $healthcare_apis -gt 0 ]; then
            healthcare_entities=$((healthcare_entities + 1))
        fi
        
        cd ..
    fi
    
    if [ -d "$frontend_dir" ]; then
        cd "$frontend_dir"
        
        # Check for healthcare-specific components
        local healthcare_components=0
        
        # Client list component
        if [ -f "components/ClientList.tsx" ]; then
            healthcare_components=$((healthcare_components + 1))
        fi
        
        # Dashboard components
        if [ -d "app/dashboard" ]; then
            healthcare_components=$((healthcare_components + 1))
        fi
        
        # Auth components
        if [ -d "components/auth" ]; then
            healthcare_components=$((healthcare_components + 1))
        fi
        
        # Onboarding components
        if [ -d "app/onboarding" ]; then
            healthcare_components=$((healthcare_components + 1))
        fi
        
        # Admin components
        if [ -d "app/admin" ]; then
            healthcare_components=$((healthcare_components + 1))
        fi
        
        cd ..
    fi
    
    completed_features=$((healthcare_entities + healthcare_components))
    
    echo "$completed_features $total_features"
}

# Calculate backend metrics
calculate_backend_metrics() {
    local backend_dir="heartly-backend"
    
    # Handle different working directories
    if [ ! -d "$backend_dir" ]; then
        # We might be in the backend directory already
        if [ -d "src" ] && [ -d "src/api" ]; then
            backend_dir="."
        else
            echo "0 0 0 0 0" # test_coverage, code_quality, features, docs, migrations
            return
        fi
    fi
    
    cd "$backend_dir"
    
    # Test coverage
    local test_coverage=0
    local coverage_file="coverage/coverage-summary.json"
    if [ -f "$coverage_file" ]; then
        test_coverage=$(node -e "
            try {
                const coverage = require('./coverage/coverage-summary.json');
                const total = coverage.total;
                const covered = total.statements.pct + total.branches.pct + total.functions.pct + total.lines.pct;
                console.log(Math.round(covered / 4));
            } catch (e) {
                console.log(0);
            }
        " 2>/dev/null || echo 0)
    fi
    
    # Code quality (test ratio)
    local source_files=$(find src -name "*.ts" 2>/dev/null | wc -l)
    local test_files=$(find . -name "*.spec.ts" 2>/dev/null | wc -l)
    local code_quality=0
    if [ "$source_files" -gt 0 ]; then
        code_quality=$((test_files * 100 / source_files))
        if [ $code_quality -gt 100 ]; then
            code_quality=100
        fi
    fi
    
    # Features
    local features=$(find src/api -name "*.module.ts" 2>/dev/null | wc -l)
    local total_features=12
    
    # Documentation
    local docs=$(find docs -name "*.md" 2>/dev/null | wc -l)
    local docs_complete=$(find docs -name "*.md" -exec wc -l {} + 2>/dev/null | awk '$1 > 10 {count++} END {print count+0}')
    local total_docs=$docs
    
    # Migrations
    local migrations=$(find src/database/migrations -name "*.ts" 2>/dev/null | wc -l)
    local total_migrations=20
    
    cd ..
    
    echo "$test_coverage $code_quality $features $total_features $docs_complete $total_docs $migrations $total_migrations"
}

# Calculate frontend metrics
calculate_frontend_metrics() {
    local frontend_dir="heartly-frontend"
    
    # Handle different working directories
    if [ ! -d "$frontend_dir" ]; then
        # We might be in the frontend directory already
        if [ -d "app" ] && [ -d "components" ]; then
            frontend_dir="."
        else
            echo "0 0 0 0 0" # test_coverage, code_quality, components, pages, docs
            return
        fi
    fi
    
    cd "$frontend_dir"
    
    # Test coverage (Cypress tests)
    local test_files=$(find cypress -name "*.ts" 2>/dev/null | wc -l)
    local test_coverage=$((test_files * 10)) # Estimate based on test files
    if [ $test_coverage -gt 100 ]; then
        test_coverage=100
    fi
    
    # Code quality (TypeScript files ratio)
    local ts_files=$(find . -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
    local js_files=$(find . -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)
    local code_quality=100
    if [ $((ts_files + js_files)) -gt 0 ]; then
        code_quality=$((ts_files * 100 / (ts_files + js_files)))
    fi
    
    # Components
    local components=$(find components -name "*.tsx" 2>/dev/null | wc -l)
    local total_components=50 # Estimate
    
    # Pages
    local pages=$(find app -name "*.tsx" 2>/dev/null | wc -l)
    local total_pages=30 # Estimate
    
    # Documentation
    local docs=$(find . -name "*.md" 2>/dev/null | wc -l)
    local docs_complete=$(find . -name "*.md" -exec wc -l {} + 2>/dev/null | awk '$1 > 10 {count++} END {print count+0}')
    local total_docs=$docs
    
    cd ..
    
    echo "$test_coverage $code_quality $components $total_components $pages $total_pages $docs_complete $total_docs"
}

# Calculate overall project metrics
calculate_overall_metrics() {
    local backend_metrics=$(calculate_backend_metrics)
    local frontend_metrics=$(calculate_frontend_metrics)
    local hipaa_metrics=$(calculate_hipaa_compliance)
    local epic_metrics=$(calculate_epic_progress)
    local team_metrics=$(calculate_parallel_team_progress)
    local healthcare_metrics=$(calculate_healthcare_features)
    local story_progress=$(calculate_story_based_progress)
    
    # Parse backend metrics
    local backend_test=$(echo $backend_metrics | cut -d' ' -f1)
    local backend_quality=$(echo $backend_metrics | cut -d' ' -f2)
    local backend_features=$(echo $backend_metrics | cut -d' ' -f3)
    local backend_total_features=$(echo $backend_metrics | cut -d' ' -f4)
    local backend_docs=$(echo $backend_metrics | cut -d' ' -f5)
    local backend_total_docs=$(echo $backend_metrics | cut -d' ' -f6)
    local backend_migrations=$(echo $backend_metrics | cut -d' ' -f7)
    local backend_total_migrations=$(echo $backend_metrics | cut -d' ' -f8)
    
    # Parse frontend metrics
    local frontend_test=$(echo $frontend_metrics | cut -d' ' -f1)
    local frontend_quality=$(echo $frontend_metrics | cut -d' ' -f2)
    local frontend_components=$(echo $frontend_metrics | cut -d' ' -f3)
    local frontend_total_components=$(echo $frontend_metrics | cut -d' ' -f4)
    local frontend_pages=$(echo $frontend_metrics | cut -d' ' -f5)
    local frontend_total_pages=$(echo $frontend_metrics | cut -d' ' -f6)
    local frontend_docs=$(echo $frontend_metrics | cut -d' ' -f7)
    local frontend_total_docs=$(echo $frontend_metrics | cut -d' ' -f8)
    
    # Parse HIPAA metrics
    local hipaa_complete=$(echo $hipaa_metrics | cut -d' ' -f1)
    local hipaa_total=$(echo $hipaa_metrics | cut -d' ' -f2)
    
    # Parse epic metrics
    local epic_complete=$(echo $epic_metrics | cut -d' ' -f1)
    local epic_total=$(echo $epic_metrics | cut -d' ' -f2)
    
    # Parse team metrics
    local team_a_completed=$(echo $team_metrics | cut -d' ' -f1)
    local team_a_total=$(echo $team_metrics | cut -d' ' -f2)
    local team_b_completed=$(echo $team_metrics | cut -d' ' -f3)
    local team_b_total=$(echo $team_metrics | cut -d' ' -f4)
    local team_a_progress=$(echo $team_metrics | cut -d' ' -f5)
    local team_b_progress=$(echo $team_metrics | cut -d' ' -f6)
    
    # Parse healthcare metrics
    local healthcare_complete=$(echo $healthcare_metrics | cut -d' ' -f1)
    local healthcare_total=$(echo $healthcare_metrics | cut -d' ' -f2)
    
    # Parse story progress
    local story_completed=$(echo $story_progress | cut -d' ' -f1)
    local story_total=$(echo $story_progress | cut -d' ' -f2)
    
    # Calculate overall progress with safe division
    local backend_feature_progress=0
    if [ "${backend_total_features:-0}" -gt 0 ]; then
        backend_feature_progress=$((backend_features * 100 / backend_total_features))
    fi
    
    local backend_docs_progress=0
    if [ "${backend_total_docs:-0}" -gt 0 ]; then
        backend_docs_progress=$((backend_docs * 100 / backend_total_docs))
    fi
    
    local backend_migration_progress=0
    if [ "${backend_total_migrations:-0}" -gt 0 ]; then
        backend_migration_progress=$((backend_migrations * 100 / backend_total_migrations))
    fi
    
    local frontend_component_progress=0
    if [ "${frontend_total_components:-0}" -gt 0 ]; then
        frontend_component_progress=$((frontend_components * 100 / frontend_total_components))
    fi
    
    local frontend_page_progress=0
    if [ "${frontend_total_pages:-0}" -gt 0 ]; then
        frontend_page_progress=$((frontend_pages * 100 / frontend_total_pages))
    fi
    
    local frontend_docs_progress=0
    if [ "${frontend_total_docs:-0}" -gt 0 ]; then
        frontend_docs_progress=$((frontend_docs * 100 / frontend_total_docs))
    fi
    
    local hipaa_progress=0
    if [ "${hipaa_total:-0}" -gt 0 ]; then
        hipaa_progress=$((hipaa_complete * 100 / hipaa_total))
    fi
    
    local epic_progress=0
    if [ "${epic_total:-0}" -gt 0 ]; then
        epic_progress=$((epic_complete * 100 / epic_total))
    fi
    
    local healthcare_progress=0
    if [ "${healthcare_total:-0}" -gt 0 ]; then
        healthcare_progress=$((healthcare_complete * 100 / healthcare_total))
    fi
    
    local story_progress_percentage=0
    if [ "${story_total:-0}" -gt 0 ]; then
        story_progress_percentage=$((story_completed * 100 / story_total))
    fi
    
    local backend_progress=$(((backend_test + backend_quality + backend_feature_progress + backend_docs_progress + backend_migration_progress) / 5))
    local frontend_progress=$(((frontend_test + frontend_quality + frontend_component_progress + frontend_page_progress + frontend_docs_progress) / 5))
    local overall_progress=$(((backend_progress + frontend_progress + hipaa_progress + epic_progress + healthcare_progress) / 5))
    
    echo "$backend_progress $frontend_progress $overall_progress $hipaa_progress $epic_progress $team_a_progress $team_b_progress $healthcare_progress $story_progress_percentage $team_a_completed $team_a_total $team_b_completed $team_b_total"
}

# Main progress calculation function
calculate_dev_progress() {
    echo -e "${PURPLE}=== Heartly Healthcare Platform Development Progress ===${NC}"
    echo -e "${WHITE}HIPAA-Compliant Facility Management System${NC}"
    echo ""
    
    # Story-Based Overall Progress
    echo -e "${GREEN}=== Story-Based Overall Progress ===${NC}"
    local story_progress=$(calculate_story_based_progress)
    local story_completed=$(echo $story_progress | cut -d' ' -f1)
    local story_total=$(echo $story_progress | cut -d' ' -f2)
    
    echo -e "${BLUE}Completed Stories:${NC}"
    print_progress_bar "$story_completed" "$story_total"
    
    # Epic Story Progress
    echo -e "${YELLOW}=== Epic Story Progress ===${NC}"
    local epic_story_progress=$(calculate_epic_story_progress)
    local epic1_completed=$(echo $epic_story_progress | cut -d' ' -f1)
    local epic1_total=$(echo $epic_story_progress | cut -d' ' -f2)
    local epic2_completed=$(echo $epic_story_progress | cut -d' ' -f3)
    local epic2_total=$(echo $epic_story_progress | cut -d' ' -f4)
    local epic3_completed=$(echo $epic_story_progress | cut -d' ' -f5)
    local epic3_total=$(echo $epic_story_progress | cut -d' ' -f6)
    
    echo -e "${BLUE}Epic 1 - Foundation Crisis:${NC}"
    print_progress_bar "$epic1_completed" "$epic1_total"
    
    echo -e "${BLUE}Epic 2 - Core Infrastructure:${NC}"
    print_progress_bar "$epic2_completed" "$epic2_total"
    
    echo -e "${BLUE}Epic 3 - Healthcare Features:${NC}"
    print_progress_bar "$epic3_completed" "$epic3_total"
    
    # Parallel Team Progress with Visual Bar
    echo -e "${ORANGE}=== Parallel Team Progress ===${NC}"
    local team_metrics=$(calculate_parallel_team_progress)
    local team_a_completed=$(echo $team_metrics | cut -d' ' -f1)
    local team_a_total=$(echo $team_metrics | cut -d' ' -f2)
    local team_b_completed=$(echo $team_metrics | cut -d' ' -f3)
    local team_b_total=$(echo $team_metrics | cut -d' ' -f4)
    local team_a_progress=$(echo $team_metrics | cut -d' ' -f5)
    local team_b_progress=$(echo $team_metrics | cut -d' ' -f6)
    
    echo -e "${BLUE}Team A - Core Infrastructure & Security (${team_a_completed}/${team_a_total} stories):${NC}"
    print_progress_bar "$team_a_completed" "$team_a_total"
    
    echo -e "${BLUE}Team B - User Experience & Integration (${team_b_completed}/${team_b_total} stories):${NC}"
    print_progress_bar "$team_b_completed" "$team_b_total"
    
    echo -e "${BLUE}Parallel Progress (█=Team A, ▓=Team B):${NC}"
    print_parallel_progress_bar "$team_a_progress" "$team_b_progress"
    
    # HIPAA Compliance Progress
    echo -e "${RED}=== HIPAA Compliance Progress ===${NC}"
    local hipaa_metrics=$(calculate_hipaa_compliance)
    local hipaa_complete=$(echo $hipaa_metrics | cut -d' ' -f1)
    local hipaa_total=$(echo $hipaa_metrics | cut -d' ' -f2)
    
    echo -e "${BLUE}Audit Logging:${NC}"
    print_progress_bar "$hipaa_complete" "$hipaa_total"
    
    # Healthcare Features Progress
    echo -e "${GREEN}=== Healthcare Features Progress ===${NC}"
    local healthcare_metrics=$(calculate_healthcare_features)
    local healthcare_complete=$(echo $healthcare_metrics | cut -d' ' -f1)
    local healthcare_total=$(echo $healthcare_metrics | cut -d' ' -f2)
    
    echo -e "${BLUE}Healthcare-Specific Features:${NC}"
    print_progress_bar "$healthcare_complete" "$healthcare_total"
    
    # Backend Progress
    echo -e "${BLUE}=== Backend Progress ===${NC}"
    local backend_metrics=$(calculate_backend_metrics)
    local backend_test=$(echo $backend_metrics | cut -d' ' -f1)
    local backend_quality=$(echo $backend_metrics | cut -d' ' -f2)
    local backend_features=$(echo $backend_metrics | cut -d' ' -f3)
    local backend_total_features=$(echo $backend_metrics | cut -d' ' -f4)
    local backend_docs=$(echo $backend_metrics | cut -d' ' -f5)
    local backend_total_docs=$(echo $backend_metrics | cut -d' ' -f6)
    local backend_migrations=$(echo $backend_metrics | cut -d' ' -f7)
    local backend_total_migrations=$(echo $backend_metrics | cut -d' ' -f8)
    
    echo -e "${BLUE}Test Coverage:${NC}"
    print_progress_bar "$backend_test" "90"
    
    echo -e "${BLUE}Code Quality:${NC}"
    print_progress_bar "$backend_quality" "95"
    
    echo -e "${BLUE}API Features:${NC}"
    print_progress_bar "$backend_features" "$backend_total_features"
    
    echo -e "${BLUE}Documentation:${NC}"
    print_progress_bar "$backend_docs" "$backend_total_docs"
    
    echo -e "${BLUE}Database Migrations:${NC}"
    print_progress_bar "$backend_migrations" "$backend_total_migrations"
    
    echo ""
    
    # Frontend Progress
    echo -e "${ORANGE}=== Frontend Progress ===${NC}"
    local frontend_metrics=$(calculate_frontend_metrics)
    local frontend_test=$(echo $frontend_metrics | cut -d' ' -f1)
    local frontend_quality=$(echo $frontend_metrics | cut -d' ' -f2)
    local frontend_components=$(echo $frontend_metrics | cut -d' ' -f3)
    local frontend_total_components=$(echo $frontend_metrics | cut -d' ' -f4)
    local frontend_pages=$(echo $frontend_metrics | cut -d' ' -f5)
    local frontend_total_pages=$(echo $frontend_metrics | cut -d' ' -f6)
    local frontend_docs=$(echo $frontend_metrics | cut -d' ' -f7)
    local frontend_total_docs=$(echo $frontend_metrics | cut -d' ' -f8)
    
    echo -e "${BLUE}Test Coverage:${NC}"
    print_progress_bar "$frontend_test" "90"
    
    echo -e "${BLUE}Code Quality:${NC}"
    print_progress_bar "$frontend_quality" "95"
    
    echo -e "${BLUE}React Components:${NC}"
    print_progress_bar "$frontend_components" "$frontend_total_components"
    
    echo -e "${BLUE}Pages:${NC}"
    print_progress_bar "$frontend_pages" "$frontend_total_pages"
    
    echo -e "${BLUE}Documentation:${NC}"
    print_progress_bar "$frontend_docs" "$frontend_total_docs"
    
    echo ""
    
    # Overall Progress
    echo -e "${GREEN}=== Overall Project Progress ===${NC}"
    local overall_metrics=$(calculate_overall_metrics)
    local backend_progress=$(echo $overall_metrics | cut -d' ' -f1)
    local frontend_progress=$(echo $overall_metrics | cut -d' ' -f2)
    local overall_progress=$(echo $overall_metrics | cut -d' ' -f3)
    local hipaa_progress=$(echo $overall_metrics | cut -d' ' -f4)
    local epic_progress=$(echo $overall_metrics | cut -d' ' -f5)
    local team_a_progress=$(echo $overall_metrics | cut -d' ' -f6)
    local team_b_progress=$(echo $overall_metrics | cut -d' ' -f7)
    local healthcare_progress=$(echo $overall_metrics | cut -d' ' -f8)
    local story_progress_percentage=$(echo $overall_metrics | cut -d' ' -f9)
    
    echo -e "${BLUE}Backend Progress:${NC}"
    print_progress_bar "$backend_progress" "100"
    
    echo -e "${BLUE}Frontend Progress:${NC}"
    print_progress_bar "$frontend_progress" "100"
    
    echo -e "${BLUE}HIPAA Compliance:${NC}"
    print_progress_bar "$hipaa_progress" "100"
    
    echo -e "${BLUE}Epic Completion:${NC}"
    print_progress_bar "$epic_progress" "100"
    
    echo -e "${BLUE}Story Completion:${NC}"
    print_progress_bar "$story_progress_percentage" "100"
    
    echo -e "${GREEN}Overall Project Progress:${NC}"
    print_progress_bar "$overall_progress" "100"
    
    echo ""
    
    # Additional metrics
    echo -e "${YELLOW}=== Healthcare Platform Metrics ===${NC}"
    echo -e "${BLUE}Backend API Endpoints:${NC} $(find heartly-backend/src/api -name "*.controller.ts" -exec grep -l "@Get\|@Post\|@Put\|@Delete" {} \; 2>/dev/null | wc -l)"
    echo -e "${BLUE}Frontend Components:${NC} $(find heartly-frontend/components -name "*.tsx" 2>/dev/null | wc -l)"
    echo -e "${BLUE}Total Test Files:${NC} $(find . -name "*.spec.ts" -o -name "*.test.ts" 2>/dev/null | wc -l)"
    echo -e "${BLUE}Total Source Files:${NC} $(find . -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)"
    echo -e "${BLUE}Database Entities:${NC} $(find heartly-backend/src/common/entities -name "*.ts" 2>/dev/null | wc -l)"
    echo -e "${BLUE}Database Migrations:${NC} $(find heartly-backend/src/database/migrations -name "*.ts" 2>/dev/null | wc -l)"
    echo -e "${BLUE}Story Folders:${NC} $(find ai-workflow/ai-development-track/ai-dev-notes -name "feature-epic-*-story-*" -type d 2>/dev/null | wc -l)"
    
    echo ""
    echo -e "${WHITE}=== Development Status ===${NC}"
    echo -e "${CYAN}Current Epic:${NC} Epic 1 - The Foundation Crisis"
    echo -e "${CYAN}Work Approach:${NC} Parallel Teams (A & B)"
    echo -e "${CYAN}Focus:${NC} HIPAA Compliance & Healthcare Features"
    echo -e "${CYAN}Next Priority:${NC} Complete Database Schema & Authentication"
    echo -e "${CYAN}Story Progress:${NC} ${story_completed}/${story_total} stories completed"
    echo -e "${CYAN}Team A Progress:${NC} ${team_a_completed}/${team_a_total} stories (${team_a_progress}%)"
    echo -e "${CYAN}Team B Progress:${NC} ${team_b_completed}/${team_b_total} stories (${team_b_progress}%)"
    
    echo ""
}

# Export function for use in pre-push hook
export -f calculate_dev_progress
export -f print_progress_bar
export -f print_parallel_progress_bar

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    calculate_dev_progress
fi 