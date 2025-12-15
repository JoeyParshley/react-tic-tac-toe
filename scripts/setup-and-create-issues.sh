#!/bin/bash

# Complete setup script for creating GitHub issues
# Run this script manually in your terminal

set -e

echo "=========================================="
echo "GitHub Issues Creation Setup"
echo "=========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "⚠️  GitHub CLI needs authentication"
    echo ""
    echo "Please run the following command to authenticate:"
    echo "  gh auth login"
    echo ""
    echo "Then run this script again:"
    echo "  ./scripts/create-github-issues.sh --create-project"
    exit 1
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo "❌ Not in a GitHub repository or repository not found on GitHub"
    exit 1
fi

echo "📦 Repository: $REPO"
echo ""

# Ask user if they want to create a project
read -p "Do you want to create a GitHub project? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Creating project and issues..."
    ./scripts/create-github-issues.sh --create-project
else
    echo ""
    echo "🚀 Creating issues only..."
    ./scripts/create-github-issues.sh
fi

echo ""
echo "✅ Done!"

