#!/usr/bin/env node

/**
 * Script to create GitHub issues from ISSUES.md file
 * 
 * Usage:
 *   GITHUB_TOKEN=your_token GITHUB_OWNER=owner GITHUB_REPO=repo node scripts/create-issues.js
 * 
 * Or set in .env file:
 *   GITHUB_TOKEN=your_token
 *   GITHUB_OWNER=owner
 *   GITHUB_REPO=repo
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments or use environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const PROJECT_NUMBER = process.env.PROJECT_NUMBER; // Optional: GitHub project number

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error('Error: Missing required environment variables');
  console.error('Required: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO');
  console.error('Optional: PROJECT_NUMBER');
  process.exit(1);
}

// Read and parse ISSUES.md
const issuesPath = path.join(__dirname, '..', 'ISSUES.md');
const issuesContent = fs.readFileSync(issuesPath, 'utf-8');

// Parse issues from markdown
function parseIssues(content) {
  const issues = [];
  const issueBlocks = content.split(/^---$/m).filter(block => block.trim());
  
  for (const block of issueBlocks) {
    if (!block.includes('## Issue #')) continue;
    
    const lines = block.split('\n');
    const issue = {
      title: '',
      body: '',
      labels: [],
      type: '',
      priority: ''
    };
    
    let inBody = false;
    let bodyLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract title
      if (line.startsWith('## Issue #')) {
        issue.title = line.replace('## Issue #', '').trim();
        inBody = true;
        continue;
      }
      
      // Extract type
      if (line.startsWith('**Type:**')) {
        issue.type = line.replace('**Type:**', '').trim();
        continue;
      }
      
      // Extract priority
      if (line.startsWith('**Priority:**')) {
        issue.priority = line.replace('**Priority:**', '').trim();
        continue;
      }
      
      // Extract labels
      if (line.startsWith('**Labels:**')) {
        const labelsStr = line.replace('**Labels:**', '').trim();
        issue.labels = labelsStr
          .split('`')
          .filter((_, i) => i % 2 === 1) // Get text between backticks
          .map(l => l.trim());
        continue;
      }
      
      // Collect body content
      if (inBody && line.trim()) {
        bodyLines.push(line);
      }
    }
    
    issue.body = bodyLines.join('\n');
    issues.push(issue);
  }
  
  return issues;
}

// Create GitHub issue via API
async function createIssue(issue) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;
  
  const body = {
    title: issue.title,
    body: issue.body,
    labels: issue.labels
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create issue: ${response.status} ${error}`);
    }
    
    const data = await response.json();
    console.log(`✓ Created issue #${data.number}: ${issue.title}`);
    return data;
  } catch (error) {
    console.error(`✗ Failed to create issue "${issue.title}":`, error.message);
    throw error;
  }
}

// Add issue to project board
async function addToProject(issueNumber, projectNumber) {
  if (!projectNumber) return;
  
  // Note: This requires GraphQL API and project node ID
  // For simplicity, this is a placeholder
  console.log(`  (Add issue #${issueNumber} to project #${projectNumber} manually or via GraphQL)`);
}

// Main execution
async function main() {
  console.log('Parsing issues from ISSUES.md...\n');
  const issues = parseIssues(issuesContent);
  
  console.log(`Found ${issues.length} issues to create\n`);
  console.log('Creating issues...\n');
  
  for (const issue of issues) {
    try {
      const created = await createIssue(issue);
      if (PROJECT_NUMBER) {
        await addToProject(created.number, PROJECT_NUMBER);
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error creating issue: ${error.message}`);
    }
  }
  
  console.log('\n✓ Done! All issues created.');
  console.log(`\nView issues at: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues`);
}

main().catch(console.error);

