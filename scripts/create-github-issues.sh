#!/bin/bash

# Script to create GitHub issues from ISSUES.md using GitHub CLI
# 
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated
#   - Repository initialized on GitHub
#
# Usage:
#   ./scripts/create-github-issues.sh

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
    echo "$content" | grep -oP '\`[^\`]+\`' | sed 's/`//g' | tr '\n' ',' | sed 's/,$//'
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
    if [ -n "$labels" ]; then
        gh issue create \
            --title "Issue #${i}: ${title}" \
            --body-file "$body_file" \
            --label "$labels" \
            --repo "$REPO" || echo -e "${RED}Failed to create issue #${i}${NC}"
    else
        gh issue create \
            --title "Issue #${i}: ${title}" \
            --body-file "$body_file" \
            --repo "$REPO" || echo -e "${RED}Failed to create issue #${i}${NC}"
    fi
    
    rm "$body_file"
    
    echo -e "${GREEN}✓ Created issue #${i}${NC}\n"
    
    # Small delay to avoid rate limiting
    sleep 1
done

echo -e "${GREEN}Done! All issues created.${NC}"
echo -e "View issues at: https://github.com/${REPO}/issues"

