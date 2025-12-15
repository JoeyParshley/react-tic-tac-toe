# Tic Tac Toe

A Tic Tac Toe game built with React, TypeScript, and Vite.

## Project Management

This project uses a typed domain-first approach and is managed via GitHub Projects. All issues are defined in [ISSUES.md](ISSUES.md) and can be automatically created in GitHub.

### Quick Setup for GitHub Projects

1. Initialize git (if not already done): `git init`
2. Create a GitHub repository and push your code
3. Go to your repository → Projects tab → New project
4. Create issues from `ISSUES.md` using one of the methods below

### Creating GitHub Issues

All project issues are documented in [ISSUES.md](ISSUES.md). To create them in GitHub:

#### Option 1: Using GitHub CLI (Recommended)
```bash
# Make sure GitHub CLI is installed and authenticated
gh auth login

# Run the automated script
./scripts/create-github-issues.sh
```

#### Option 2: Using Node.js Script
```bash
# Set environment variables
export GITHUB_TOKEN=your_token_here
export GITHUB_OWNER=your_username
export GITHUB_REPO=ticTacToe

# Run the script
node scripts/create-issues.js
```

#### Option 3: Manual Creation
Copy each issue from [ISSUES.md](ISSUES.md) and create them manually via the GitHub web interface.

For detailed instructions, see [.github/ISSUE_CREATION_GUIDE.md](.github/ISSUE_CREATION_GUIDE.md).

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
