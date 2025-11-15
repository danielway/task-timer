# End-to-End Tests

This directory contains end-to-end tests for the Task Timer application using Playwright.

## Directory Structure

```
e2e/
├── fixtures/          # Test fixtures and setup utilities
│   └── test-fixtures.ts
├── page-objects/      # Page Object Models for UI interactions
│   └── TaskTimerPage.ts
├── tests/             # Test specifications
│   ├── task-management.spec.ts
│   ├── time-tracking.spec.ts
│   ├── date-navigation.spec.ts
│   └── persistence.spec.ts
└── utils/             # Helper utilities
    └── test-helpers.ts
```

## Running Tests

All E2E tests use the `/task-timer/` base path to match the production GitHub Pages deployment. This ensures tests accurately reflect the production environment.

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

Tests run identically in both local and CI environments, building and serving the app with the production configuration.

## Test Organization

### Task Management Tests (`task-management.spec.ts`)

Tests for creating, editing, and deleting tasks:

- Creating tasks with different types
- Editing task descriptions
- Deleting tasks
- Keyboard shortcuts (Enter, Escape)

### Time Tracking Tests (`time-tracking.spec.ts`)

Tests for adding and removing time increments:

- Adding single and multiple time increments
- Removing time increments
- Time calculation across different hours
- Time persistence after task edits

### Date Navigation Tests (`date-navigation.spec.ts`)

Tests for navigating between different dates:

- Moving to previous/next day
- Task isolation by date
- Time data separation by date
- Multi-day workflows

### Persistence Tests (`persistence.spec.ts`)

Tests for data persistence using localStorage:

- Task persistence after reload
- Time entry persistence
- Edit and deletion persistence
- Multi-session workflows
- localStorage data integrity

## Page Object Model

The `TaskTimerPage` class provides a clean API for interacting with the application:

```typescript
// Create a task
await taskTimerPage.createTask('My task');

// Add time to a task
await taskTimerPage.addTimeIncrement('My task', 9, 0); // 9:00-9:15

// Edit a task
await taskTimerPage.editTask('Old name', 'New name');

// Delete a task
await taskTimerPage.deleteTask('My task');

// Navigate dates
await taskTimerPage.goToNextDay();
await taskTimerPage.goToPreviousDay();

// Check task existence
await taskTimerPage.expectTaskToExist('My task');
await taskTimerPage.expectTaskNotToExist('Deleted task');
```

## Test Fixtures

Tests use the `test` fixture from `fixtures/test-fixtures.ts` which:

- Automatically navigates to the application
- Clears localStorage before each test
- Provides a `TaskTimerPage` instance

## Helper Utilities

`utils/test-helpers.ts` provides utility functions:

- `generateTaskName()` - Generate unique task names
- `getTodayTimestamp()` - Get today's date as timestamp
- `createTimeTimestamp()` - Create timestamps for specific times
- `createMockLocalStorageData()` - Create mock localStorage data for testing

## Writing New Tests

When writing new E2E tests:

1. Import the test fixture:

   ```typescript
   import { test, expect } from '../fixtures/test-fixtures';
   ```

2. Use the page object model:

   ```typescript
   test('my test', async ({ taskTimerPage }) => {
     // Use taskTimerPage methods
   });
   ```

3. Generate unique test data:

   ```typescript
   import { generateTaskName } from '../utils/test-helpers';
   const taskName = generateTaskName('My task');
   ```

4. Follow the existing test structure and naming conventions

## CI/CD Integration

E2E tests run automatically in GitHub Actions on every push and pull request. The CI workflow:

- Installs Playwright and Chromium
- Builds the application
- Runs all E2E tests
- Uploads test reports as artifacts

## Debugging

To debug a failing test:

1. Run with UI mode: `npm run test:e2e:ui`
2. Or use debug mode: `npm run test:e2e:debug`
3. Add `await page.pause()` in the test to pause execution
4. Check the Playwright report: `npm run test:e2e:report`

## Best Practices

- Use unique task names with `generateTaskName()` to avoid test interference
- Clean up test data using the built-in fixture (automatic localStorage clear)
- Use descriptive test names that explain what is being tested
- Group related tests in `describe` blocks
- Assert expected outcomes with `expect()` statements
- Keep tests isolated and independent
