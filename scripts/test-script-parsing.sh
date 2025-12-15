#!/bin/bash

# Test script to validate issue parsing without making API calls
# This tests the parsing logic of create-github-issues.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FILE="ISSUES.md"

if [ ! -f "$ISSUES_FILE" ]; then
    echo -e "${RED}Error: ${ISSUES_FILE} not found${NC}"
    exit 1
fi

# Function to extract issue content (same as in main script)
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

# Function to extract type
extract_type() {
    local content="$1"
    echo "$content" | grep '\*\*Type:\*\*' | sed 's/.*\*\*Type:\*\*\s*//' | sed 's/\s*$//' || echo ""
}

# Function to extract priority
extract_priority() {
    local content="$1"
    echo "$content" | grep '\*\*Priority:\*\*' | sed 's/.*\*\*Priority:\*\*\s*//' | sed 's/\s*$//' || echo ""
}

echo "Testing issue parsing from ${ISSUES_FILE}..."
echo ""

ISSUES_FOUND=0
ISSUES_WITH_ERRORS=0

for i in {1..12}; do
    issue_content=$(extract_issue $i)
    
    if [ -z "$issue_content" ]; then
        echo -e "${YELLOW}Issue #${i}: Not found${NC}"
        continue
    fi
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    
    title=$(extract_title "$issue_content")
    labels=$(extract_labels "$issue_content")
    type=$(extract_type "$issue_content")
    priority=$(extract_priority "$issue_content")
    
    echo -e "${GREEN}✓ Issue #${i}${NC}"
    echo "  Title: $title"
    echo "  Type: $type"
    echo "  Priority: $priority"
    echo "  Labels: $labels"
    
    # Validate required fields
    if [ -z "$title" ]; then
        echo -e "  ${RED}✗ ERROR: Missing title${NC}"
        ISSUES_WITH_ERRORS=$((ISSUES_WITH_ERRORS + 1))
    fi
    
    if [ -z "$labels" ]; then
        echo -e "  ${YELLOW}⚠ WARNING: No labels found${NC}"
    fi
    
    # Check if body has content
    body_lines=$(echo "$issue_content" | wc -l | tr -d ' ')
    if [ "$body_lines" -lt 5 ]; then
        echo -e "  ${YELLOW}⚠ WARNING: Body seems short (${body_lines} lines)${NC}"
    fi
    
    echo ""
done

echo "---"
echo -e "${GREEN}Summary:${NC}"
echo "  Issues found: $ISSUES_FOUND"
echo "  Issues with errors: $ISSUES_WITH_ERRORS"

if [ $ISSUES_WITH_ERRORS -eq 0 ] && [ $ISSUES_FOUND -eq 12 ]; then
    echo -e "${GREEN}✓ All issues parsed successfully!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some issues have problems${NC}"
    exit 1
fi

