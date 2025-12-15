# Quick Start: Create GitHub Issues

## Option 1: Using GitHub CLI (Recommended)

### Step 1: Authenticate (if needed)
```bash
gh auth login
```
Follow the prompts to authenticate with GitHub.

### Step 2: Create Issues
```bash
# Create project and issues together
./scripts/create-github-issues.sh --create-project

# Or just create issues (if project already exists)
./scripts/create-github-issues.sh
```

## Option 2: Using GitHub Token (Alternative)

If you prefer to use a personal access token:

1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic) with `repo` scope

2. Run the Node.js script:
```bash
export GITHUB_TOKEN=your_token_here
export GITHUB_OWNER=JoeyParshley
export GITHUB_REPO=react-tic-tac-toe

node scripts/create-issues.js
```

## Option 3: Manual Creation

Copy each issue from `ISSUES.md` and create them manually via the GitHub web interface at:
https://github.com/JoeyParshley/react-tic-tac-toe/issues/new

## Verify Issues Were Created

After running the script, check:
- Issues: https://github.com/JoeyParshley/react-tic-tac-toe/issues
- Project (if created): https://github.com/users/JoeyParshley/projects

