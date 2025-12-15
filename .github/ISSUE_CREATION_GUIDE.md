# GitHub Issue Creation Guide

This guide explains how to create GitHub issues from the `ISSUES.md` file and set up a GitHub project board.

## Prerequisites

1. **GitHub CLI (gh)** - Install from https://cli.github.com/
   ```bash
   # Verify installation
   gh --version
   
   # Authenticate
   gh auth login
   ```

2. **GitHub Repository** - Make sure your repository is initialized and pushed to GitHub

## Method 1: Using GitHub CLI (Automated)

### Step 1: Create a GitHub Project

```bash
# Create a new project (interactive)
gh project create

# Or create via web interface and note the project number
```

### Step 2: Create Issues from Markdown

Use the provided script to create issues:

```bash
# Make the script executable
chmod +x scripts/create-github-issues.sh

# Run the script (you'll need to set your repo and project number)
./scripts/create-github-issues.sh
```

### Step 3: Add Issues to Project Board

After creating issues, add them to your project board:

```bash
# List your projects
gh project list

# Add an issue to a project (replace PROJECT_NUMBER and ISSUE_NUMBER)
gh project item-add PROJECT_NUMBER --owner OWNER --repo REPO --url https://github.com/OWNER/REPO/issues/ISSUE_NUMBER
```

## Method 2: Manual Creation via Web Interface

1. Go to your GitHub repository
2. Click on "Issues" tab
3. Click "New issue"
4. Copy the content from `ISSUES.md` for each issue
5. Paste into the issue form
6. Add labels, assignees, and add to project board

## Method 3: Using GitHub API Script

A Node.js script is provided in `scripts/create-issues.js` that can parse the markdown and create issues via GitHub API.

```bash
# Install dependencies (if needed)
npm install

# Set environment variables
export GITHUB_TOKEN=your_token_here
export GITHUB_OWNER=your_username
export GITHUB_REPO=ticTacToe

# Run the script
node scripts/create-issues.js
```

## Project Board Setup

### Recommended Columns

1. **Backlog** - All issues
2. **To Do** - Issues ready to work on
3. **In Progress** - Currently being worked on
4. **Review** - Completed, ready for review
5. **Done** - Completed issues

### Labels

Create these labels in your repository:
- `domain` - Domain layer issues
- `ui` - UI layer issues
- `integration` - Integration issues
- `types` - Type definitions
- `model` - Domain models
- `logic` - Business logic
- `component` - React components
- `styling` - CSS/styling
- `foundation` - Foundational work
- `high-priority` - High priority
- `medium-priority` - Medium priority
- `low-priority` - Low priority

To create labels via CLI:
```bash
gh label create domain --description "Domain layer issues" --color 0e8a16
gh label create ui --description "UI layer issues" --color fbca04
gh label create integration --description "Integration issues" --color 0052cc
# ... etc
```

## Issue Template

Each issue in `ISSUES.md` follows this structure:
- **Type**: Domain/UI/Integration
- **Priority**: High/Medium/Low
- **Labels**: Comma-separated labels
- **Description**: What needs to be done
- **Tasks**: Checklist of specific tasks
- **Acceptance Criteria**: Definition of done
- **Files to Create/Modify**: List of affected files
- **Dependencies**: Related issues

## Tips

1. **Create issues in order** - Start with foundational issues (domain types) before dependent ones
2. **Link related issues** - Use GitHub's issue linking (e.g., "Depends on #1")
3. **Use milestones** - Group related issues into milestones (e.g., "Domain Layer", "UI Layer")
4. **Update status** - Move issues through project board columns as you work

