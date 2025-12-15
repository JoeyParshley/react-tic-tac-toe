#!/bin/bash

# Script to create GitHub issues from ISSUES.md using GitHub CLI
# Optionally creates a GitHub project and adds issues to it
# 
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated
#   - Repository initialized on GitHub
#
# Usage:
#   ./scripts/create-github-issues.sh [--create-project]
#
# Options:
#   --create-project    Create a new GitHub project and add issues to it

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Warning: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo -e "${RED}Error: Not in a GitHub repository or repository not found on GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}Repository: ${REPO}${NC}\n"

# Check if we should create a project
CREATE_PROJECT=false
PROJECT_NUMBER=""
if [[ "$1" == "--create-project" ]]; then
    CREATE_PROJECT=true
    echo -e "${YELLOW}Project creation requested${NC}"
fi

# Create GitHub project if requested
if [ "$CREATE_PROJECT" = true ]; then
    echo "Creating GitHub project..."
    PROJECT_TITLE="Tic Tac Toe Development"
    PROJECT_BODY="Project board for managing tic-tac-toe game development using typed domain-first approach"
    
    # Create project (this creates a project in the repository)
    PROJECT_OUTPUT=$(gh project create --title "$PROJECT_TITLE" --body "$PROJECT_BODY" --format json 2>/dev/null || echo "")
    
    if [ -n "$PROJECT_OUTPUT" ]; then
        PROJECT_NUMBER=$(echo "$PROJECT_OUTPUT" | grep -oP '"number":\s*\K[0-9]+' | head -1)
        if [ -n "$PROJECT_NUMBER" ]; then
            echo -e "${GREEN}✓ Created project #${PROJECT_NUMBER}: ${PROJECT_TITLE}${NC}"
            
            # Add default columns to the project
            echo "Setting up project columns..."
            gh project column-create "$PROJECT_NUMBER" --name "Backlog" 2>/dev/null || true
            gh project column-create "$PROJECT_NUMBER" --name "To Do" 2>/dev/null || true
            gh project column-create "$PROJECT_NUMBER" --name "In Progress" 2>/dev/null || true
            gh project column-create "$PROJECT_NUMBER" --name "Review" 2>/dev/null || true
            gh project column-create "$PROJECT_NUMBER" --name "Done" 2>/dev/null || true
            echo -e "${GREEN}✓ Project columns created${NC}\n"
        else
            echo -e "${YELLOW}Warning: Could not extract project number. Issues will be created but not added to project.${NC}\n"
        fi
    else
        echo -e "${YELLOW}Warning: Could not create project. You may need to create it manually via GitHub web interface.${NC}"
        echo -e "${YELLOW}Issues will still be created.${NC}\n"
    fi
fi

# Check if ISSUES.md exists
ISSUES_FILE="ISSUES.md"
if [ ! -f "$ISSUES_FILE" ]; then
    echo -e "${RED}Error: ${ISSUES_FILE} not found${NC}"
    exit 1
fi

# Function to extract issue content
extract_issue() {
    local issue_num=$1
    local in_issue=false
    local issue_content=""
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^##\ Issue\ #${issue_num}: ]]; then
            in_issue=true
            issue_content="$line"$'\n'
        elif [[ "$in_issue" == true ]]; then
            if [[ "$line" =~ ^---$ ]]; then
                break
            fi
            issue_content+="$line"$'\n'
        fi
    done < "$ISSUES_FILE"
    
    echo "$issue_content"
}

# Function to extract labels from issue content
extract_labels() {
    local content="$1"
    # Extract only the labels line, then get text between backticks
    echo "$content" | grep '\*\*Labels:\*\*' | grep -o '\`[^`]*\`' | sed 's/`//g' | tr '\n' ',' | sed 's/,$//'
}

# Function to extract title from issue content
extract_title() {
    local content="$1"
    echo "$content" | head -n 1 | sed 's/^## Issue #[0-9]*: //'
}

# Create issues
echo "Creating issues from ${ISSUES_FILE}..."
echo ""

for i in {1..12}; do
    issue_content=$(extract_issue $i)
    
    if [ -z "$issue_content" ]; then
        continue
    fi
    
    title=$(extract_title "$issue_content")
    labels=$(extract_labels "$issue_content")
    
    echo -e "${YELLOW}Creating Issue #${i}: ${title}${NC}"
    
    # Create issue body file
    body_file=$(mktemp)
    echo "$issue_content" > "$body_file"
    
    # Create issue
    ISSUE_NUMBER=""
    if [ -n "$labels" ]; then
        ISSUE_OUTPUT=$(gh issue create \
            --title "Issue #${i}: ${title}" \
            --body-file "$body_file" \
            --label "$labels" \
            --repo "$REPO" 2>&1)
        
        if [ $? -eq 0 ]; then
            # Extract issue number from output (format: "https://github.com/owner/repo/issues/123")
            ISSUE_NUMBER=$(echo "$ISSUE_OUTPUT" | grep -o 'issues/[0-9]\+' | sed 's/issues\///' | head -1)
        else
            # If labels failed, try without labels
            echo -e "${YELLOW}  → Labels not found, creating issue without labels${NC}"
            ISSUE_OUTPUT=$(gh issue create \
                --title "Issue #${i}: ${title}" \
                --body-file "$body_file" \
                --repo "$REPO" 2>&1)
            
            if [ $? -eq 0 ]; then
                ISSUE_NUMBER=$(echo "$ISSUE_OUTPUT" | grep -o 'issues/[0-9]\+' | sed 's/issues\///' | head -1)
            else
                echo -e "${RED}Failed to create issue #${i}${NC}"
                echo "Error: $ISSUE_OUTPUT"
                rm "$body_file"
                continue
            fi
        fi
    else
        ISSUE_OUTPUT=$(gh issue create \
            --title "Issue #${i}: ${title}" \
            --body-file "$body_file" \
            --repo "$REPO" 2>&1)
        
        if [ $? -eq 0 ]; then
            ISSUE_NUMBER=$(echo "$ISSUE_OUTPUT" | grep -o 'issues/[0-9]\+' | sed 's/issues\///' | head -1)
        else
            echo -e "${RED}Failed to create issue #${i}${NC}"
            rm "$body_file"
            continue
        fi
    fi
    
    rm "$body_file"
    
    if [ -n "$ISSUE_NUMBER" ]; then
        echo -e "${GREEN}✓ Created issue #${ISSUE_NUMBER}: ${title}${NC}"
        
        # Add issue to project if project was created
        if [ -n "$PROJECT_NUMBER" ] && [ -n "$ISSUE_NUMBER" ]; then
            # Add issue to project (add to "Backlog" column by default)
            gh project item-add "$PROJECT_NUMBER" --owner "$(echo $REPO | cut -d'/' -f1)" --repo "$(echo $REPO | cut -d'/' -f2)" --url "https://github.com/${REPO}/issues/${ISSUE_NUMBER}" 2>/dev/null && \
                echo -e "  ${GREEN}  → Added to project${NC}" || \
                echo -e "  ${YELLOW}  → Could not add to project (may need manual addition)${NC}"
        fi
    else
        echo -e "${GREEN}✓ Created issue #${i}: ${title}${NC}"
    fi
    
    echo ""
    
    # Small delay to avoid rate limiting
    sleep 1
done

echo -e "${GREEN}Done! All issues created.${NC}"
echo -e "View issues at: https://github.com/${REPO}/issues"

if [ -n "$PROJECT_NUMBER" ]; then
    echo -e "View project at: https://github.com/users/$(echo $REPO | cut -d'/' -f1)/projects/${PROJECT_NUMBER}"
fi

