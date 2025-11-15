# Contributing to Task Timer

Thank you for your interest in contributing to Task Timer! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Pre-Commit Checks

Before committing changes, the following checks **must** pass:

1. **Format Check** - `npm run format:check`

   - Ensures code follows consistent formatting rules
   - To fix formatting issues: `npm run format`

2. **Lint Check** - `npm run lint`

   - Checks for code quality and potential issues
   - To fix linting issues: `npm run lint:fix`

3. **Build** - `npm run build`

   - Ensures the project builds successfully
   - Catches TypeScript errors and build issues

4. **Tests** - `npm run test -- --run`

   - Runs all unit and integration tests
   - All tests must pass before committing

5. **E2E Tests** - `npm run test:e2e` (optional for local development)
   - Runs end-to-end tests using Playwright
   - Tests the full user experience in a real browser
   - Automatically run in CI, but can be run locally before major changes

## Automated Pre-Commit Hook

To automatically run these checks before every commit, install the pre-commit hook:

```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Once installed, the hook will run all checks automatically when you commit. If any check fails, the commit will be blocked until you fix the issues.

## Manual Checks

If you prefer to run checks manually before committing:

```bash
npm run format:check && npm run lint && npm run build && npm run test -- --run
```

## Continuous Integration

All pull requests are automatically tested using GitHub Actions. The CI pipeline runs the same checks as the pre-commit hook, plus additional coverage reporting.

To avoid CI failures, make sure all pre-commit checks pass before pushing your changes.

## Pull Request Guidelines

- Create a descriptive PR title
- Explain what changes you made and why
- Ensure all CI checks pass
- Keep PRs focused on a single feature or fix
- Update tests as needed for your changes

## Code Style

- Use Prettier for formatting (runs automatically with `npm run format`)
- Follow ESLint rules (enforced by `npm run lint`)
- Write tests for new features
- Keep code modular and maintainable

## End-to-End Testing

The project uses Playwright for end-to-end testing to ensure the full user experience works correctly.

### Running E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run E2E tests in headed mode (see the browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Writing E2E Tests

E2E tests are located in the `e2e/tests/` directory and follow these conventions:

- Use the `TaskTimerPage` page object model from `e2e/page-objects/TaskTimerPage.ts`
- Tests are organized by feature: task management, time tracking, date navigation, and persistence
- Use the test fixtures from `e2e/fixtures/test-fixtures.ts` for automatic setup/teardown
- Helper utilities are available in `e2e/utils/test-helpers.ts`

Example test:

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('should create a new task', async ({ taskTimerPage }) => {
  await taskTimerPage.createTask('My new task');
  await taskTimerPage.expectTaskToExist('My new task');
});
```

### E2E Test Coverage

The E2E tests cover:

- Task management (create, edit, delete)
- Time tracking (add/remove time increments)
- Date navigation (switching between dates)
- Data persistence (localStorage and page reloads)
