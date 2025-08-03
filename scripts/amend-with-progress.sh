#!/bin/bash

# Simple script to amend the previous commit with progress updates
# Usage: ./scripts/amend-with-progress.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
ORANGE='\033[0;33m'
WHITE='\033[1;37m'
NC='\033[0m'

# Get the project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# Function to update progress summary
update_progress_summary() {
    echo "${PURPLE}📝 Updating progress summary...${NC}"
    
    # Get current progress metrics
    if [ -f "$PROJECT_ROOT/scripts/dev-progress.sh" ]; then
        source "$PROJECT_ROOT/scripts/dev-progress.sh"
        
        # Calculate current metrics
        local story_progress=$(calculate_story_based_progress)
        local story_completed=$(echo $story_progress | cut -d' ' -f1)
        local story_total=$(echo $story_progress | cut -d' ' -f2)
        
        local epic_story_progress=$(calculate_epic_story_progress)
        local epic1_completed=$(echo $epic_story_progress | cut -d' ' -f1)
        local epic1_total=$(echo $epic_story_progress | cut -d' ' -f2)
        local epic2_completed=$(echo $epic_story_progress | cut -d' ' -f3)
        local epic2_total=$(echo $epic_story_progress | cut -d' ' -f4)
        local epic3_completed=$(echo $epic_story_progress | cut -d' ' -f5)
        local epic3_total=$(echo $epic_story_progress | cut -d' ' -f6)
        
        local team_metrics=$(calculate_parallel_team_progress)
        local team_a_completed=$(echo $team_metrics | cut -d' ' -f1)
        local team_a_total=$(echo $team_metrics | cut -d' ' -f2)
        local team_b_completed=$(echo $team_metrics | cut -d' ' -f3)
        local team_b_total=$(echo $team_metrics | cut -d' ' -f4)
        
        local overall_metrics=$(calculate_overall_metrics)
        local overall_progress=$(echo $overall_metrics | cut -d' ' -f3)
        local backend_progress=$(echo $overall_metrics | cut -d' ' -f1)
        local frontend_progress=$(echo $overall_metrics | cut -d' ' -f2)
        local hipaa_progress=$(echo $overall_metrics | cut -d' ' -f4)
        
        # Calculate percentages
        local story_percentage=0
        if [ "$story_total" -gt 0 ]; then
            story_percentage=$((story_completed * 100 / story_total))
        fi
        
        local epic1_percentage=0
        if [ "$epic1_total" -gt 0 ]; then
            epic1_percentage=$((epic1_completed * 100 / epic1_total))
        fi
        
        local epic2_percentage=0
        if [ "$epic2_total" -gt 0 ]; then
            epic2_percentage=$((epic2_completed * 100 / epic2_total))
        fi
        
        local epic3_percentage=0
        if [ "$epic3_total" -gt 0 ]; then
            epic3_percentage=$((epic3_completed * 100 / epic3_total))
        fi
        
        local team_a_percentage=0
        if [ "$team_a_total" -gt 0 ]; then
            team_a_percentage=$((team_a_completed * 100 / team_a_total))
        fi
        
        local team_b_percentage=0
        if [ "$team_b_total" -gt 0 ]; then
            team_b_percentage=$((team_b_completed * 100 / team_b_total))
        fi
        
        # Create a progress summary file
        if [ -f "$PROJECT_ROOT/README.md" ]; then
            # Create a progress summary
            local progress_summary="## 📊 Current Progress Summary (Auto-Generated)
*Last updated: $(date '+%Y-%m-%d %H:%M:%S')*

### 🎯 Story Progress
- **Overall Stories**: ${story_completed}/${story_total} completed (${story_percentage}%)
- **Epic 1 - Foundation Crisis**: ${epic1_completed}/${epic1_total} stories (${epic1_percentage}%)
- **Epic 2 - Core Infrastructure**: ${epic2_completed}/${epic2_total} stories (${epic2_percentage}%)
- **Epic 3 - Healthcare Features**: ${epic3_completed}/${epic3_total} stories (${epic3_percentage}%)

### 🔄 Team Progress
- **Team A - Core Infrastructure & Security**: ${team_a_completed}/${team_a_total} stories (${team_a_percentage}%)
- **Team B - User Experience & Integration**: ${team_b_completed}/${team_b_total} stories (${team_b_percentage}%)

### 💻 Technical Progress
- **Backend Progress**: ${backend_progress}%
- **Frontend Progress**: ${frontend_progress}%
- **Overall Project**: ${overall_progress}%

---
*This section is automatically updated by the amend-with-progress script*"

            # Write the progress summary to a file
            echo "$progress_summary" > "$PROJECT_ROOT/docs/current-progress.md"
            
            echo "${GREEN}✅ Progress summary updated${NC}"
            echo "${BLUE}Updated metrics:${NC}"
            echo "  - Overall Stories: ${story_completed}/${story_total} (${story_percentage}%)"
            echo "  - Epic 1: ${epic1_completed}/${epic1_total} (${epic1_percentage}%)"
            echo "  - Epic 2: ${epic2_completed}/${epic2_total} (${epic2_percentage}%)"
            echo "  - Epic 3: ${epic3_completed}/${epic3_total} (${epic3_percentage}%)"
            echo "  - Team A: ${team_a_completed}/${team_a_total} (${team_a_percentage}%)"
            echo "  - Team B: ${team_b_completed}/${team_b_total} (${team_b_percentage}%)"
            echo "  - Overall Project: ${overall_progress}%"
            echo ""
        else
            echo "${YELLOW}⚠️  README.md not found, skipping update${NC}"
            echo ""
        fi
    else
        echo "${YELLOW}⚠️  Progress script not found, skipping progress update${NC}"
        echo ""
    fi
}

# Function to amend the previous commit
amend_with_progress() {
    echo "${PURPLE}📦 Checking if progress file needs updating...${NC}"
    
    # Check if the progress file is already in the last commit
    if git show HEAD:docs/current-progress.md >/dev/null 2>&1; then
        echo "${YELLOW}⚠️  Progress file already in last commit${NC}"
        echo "${CYAN}Progress file is already included in the commit.${NC}"
        echo ""
        return 0
    fi
    
    echo "${PURPLE}📦 Staging progress file...${NC}"
    
    # Stage the progress file
    git add "$PROJECT_ROOT/docs/current-progress.md"
    
    echo "${PURPLE}🔧 Amending previous commit...${NC}"
    
    # Amend the previous commit
    if git commit --amend --no-edit; then
        echo "${GREEN}✅ Commit amended successfully!${NC}"
        echo "${CYAN}Progress file added to previous commit.${NC}"
        echo ""
    else
        echo "${RED}❌ Failed to amend commit${NC}"
        exit 1
    fi
}

# Main execution
main() {
    echo "${PURPLE}🚀 Heartly Healthcare Platform - Amend with Progress${NC}"
    echo ""
    
    # Check if we're in a git repository
    if [ ! -d "$PROJECT_ROOT/.git" ]; then
        echo "${RED}Error: Not in a git repository${NC}"
        exit 1
    fi
    
    # Check if there's a previous commit to amend
    if ! git rev-parse HEAD~1 >/dev/null 2>&1; then
        echo "${RED}Error: No previous commit to amend${NC}"
        echo "${YELLOW}Make a commit first, then run this script.${NC}"
        exit 1
    fi
    
    # Update progress summary
    update_progress_summary
    
    # Amend the previous commit
    amend_with_progress
}

# Run main function
main 