# GitHub Projects Setup Guide

This document helps you set up and manage your Tic Tac Toe project using GitHub Projects.

## Initial Setup

1. **Create a GitHub Repository**
   - Go to GitHub and create a new repository
   - Push your local code to the repository

2. **Create a GitHub Project**
   - Go to your repository on GitHub
   - Click on the "Projects" tab
   - Click "New project"
   - Choose "Board" template (or "Table" if you prefer)
   - Name it "Tic Tac Toe Development"

## Recommended Project Board Structure

### Columns:
1. **Backlog** - Ideas and future enhancements
2. **To Do** - Tasks ready to be worked on
3. **In Progress** - Currently being worked on
4. **In Review** - Code review or testing
5. **Done** - Completed tasks

### Labels:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `priority: high` - High priority items
- `priority: medium` - Medium priority items
- `priority: low` - Low priority items

## Workflow Integration

The project includes:
- **Issue Templates** - Standardized bug reports and feature requests
- **Pull Request Template** - Consistent PR descriptions
- **CI Workflow** - Automated testing and linting

## Using GitHub Projects

1. **Create Issues** - Use the issue templates for bugs and features
2. **Link to Project** - When creating issues, add them to your project board
3. **Move Cards** - Drag cards between columns as work progresses
4. **Use Milestones** - Group related issues into milestones
5. **Automate** - Use GitHub Actions to automatically move cards based on PR status

## Automation Tips

You can automate project board updates by:
- Linking PRs to issues (closes #issue_number)
- Using GitHub Actions to update project status
- Setting up branch protection rules
- Using project automation features in GitHub

