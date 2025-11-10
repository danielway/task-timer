# Testing Documentation

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing business logic and critical components.

## Test Structure

### Unit Tests (`src/app/slices/*.test.ts`)

Tests for Redux slices covering business logic:

- **timeSlice.test.ts** - Time tracking, segment calculation, time toggling
- **taskSlice.test.ts** - Task CRUD operations
- **dateSlice.test.ts** - Date-to-task mapping, task ordering
- **editSlice.test.ts** - UI selection state
- **appSlice.test.ts** - App-level state
- **keyboard.test.ts** - Keyboard navigation logic

### Integration Tests (`src/components/**/*.test.tsx`)

Tests for components integrated with Redux:

- **TimeIncrement.test.tsx** - Time segment toggling with Redux
- **TaskCreationRow.test.tsx** - Task creation workflow
- **TaskRow.test.tsx** - Task editing, deletion, time display

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/app/slices/timeSlice.test.ts
```

## Test Utilities

### `test-utils.tsx`

Provides `renderWithProviders()` for testing components with Redux:

```typescript
import { renderWithProviders } from '../../test-utils/test-utils';

const { store } = renderWithProviders(<MyComponent />, {
  preloadedState: {
    task: { nextTaskId: 1, tasks: [] },
    // ... other state
  },
});
```

### `factories.ts`

Mock data factories for consistent test data:

```typescript
import { createMockTask, createMockState } from '../../test-utils/factories';

const task = createMockTask({ id: 1, description: 'Test' });
const state = createMockState({ task: { ... } });
```

### `setupTests.ts`

Global test setup including:

- localStorage mock
- Material-UI matchMedia mock
- IntersectionObserver mock
- Automatic cleanup after each test

## Configuration

### Vitest Configuration (`vite.config.ts`)

```typescript
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test-utils/setupTests.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov', 'json'],
    exclude: [
      'node_modules/',
      'dist/',
      'src/test-utils/',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'src/vite-env.d.ts',
      'src/main.tsx',
      'src/store.ts',
      'vite.config.ts',
      'eslint.config.js',
    ],
    thresholds: {
      branches: 80,
      functions: 70,
      lines: 45,
      statements: 45,
    },
  },
}
```

### CI/CD Integration

Tests run automatically on every push and pull request via GitHub Actions:

1. **Lint** - Code quality checks
2. **Format Check** - Prettier formatting
3. **Build** - Production build verification
4. **Tests** - Run all test suites
5. **Coverage** - Generate and upload coverage reports to Codecov

See `.github/workflows/ci-workflow.yml` for details.

## Key Testing Patterns

### Testing Redux Logic

```typescript
it('should add task to date', () => {
  const state = initialState;
  const action = addTaskToDate({ date: mockToday, taskId: 1 });
  const newState = dateReducer(state, action);

  expect(newState.dateTasks[0].tasks).toContain(1);
});
```

### Testing Component Integration

```typescript
it('should toggle time segment when clicked', async () => {
  const user = userEvent.setup();
  const { store, container } = renderWithProviders(
    <TimeIncrement taskId={1} segment={0} />,
    { preloadedState }
  );

  const increment = container.querySelector('.increment');
  await user.click(increment!);

  const state = store.getState() as RootState;
  expect(state.time.dateTimes[0].taskTimes).toHaveLength(1);
});
```

### Testing Keyboard Navigation

```typescript
it('should navigate between tasks with arrow keys', () => {
  handleKeyboardInput(
    new KeyboardEvent('keydown', { key: 'ArrowDown' }),
    mockToday,
    { taskId: 1, description: false, timeSegment: 5 },
    [1, 2],
    selectTaskDescription,
    selectTaskTimeSegment,
    clearSelection,
    beginTaskEdit,
    toggleSegment
  );

  expect(selectTaskTimeSegment).toHaveBeenCalledWith({
    taskId: 2,
    timeSegment: 5,
  });
});
```

## Writing New Tests

### For Redux Slices

1. Import the slice reducer and actions
2. Test each action's state transformation
3. Test selectors with mock state
4. Focus on edge cases and boundary conditions

### For Components

1. Use `renderWithProviders()` with appropriate `preloadedState`
2. Test user interactions with `@testing-library/user-event`
3. Verify Redux state changes with `store.getState()`
4. Use `container.textContent` for text assertions spanning multiple elements

### Mock Data

Use factories from `test-utils/factories.ts` for consistency:

- `createMockTask()` - Generate mock tasks
- `createMockTaskTime()` - Generate mock time entries
- `createMockState()` - Generate complete Redux state
- `createMockStateWithTaskAndTime()` - Generate state with task and time entries

## Extending Test Coverage

Priority areas for additional coverage:

1. **Layout Components** - DatePicker, Table, Header, Footer
2. **Visual Regression** - Playwright visual comparisons
3. **E2E Tests** - Full user workflow tests
4. **Accessibility** - jest-axe integration
5. **Performance** - Large dataset rendering tests

### Adding E2E Tests with Playwright

```bash
# Install Playwright
npm install -D @playwright/test

# Initialize Playwright
npx playwright install
```

Create test files in `e2e/` directory following Playwright patterns.

## Troubleshooting

### Tests timing out

- Check for missing `await` on async operations
- Look for infinite loops in useEffect hooks
- Ensure date entries exist in test state

### Component rendering errors

- Verify all required Redux state slices are provided
- Ensure TableRow components have parent Table/TableBody
- Check that date entries exist in both `date` and `time` slices

### Type errors in tests

- Use `as RootState` when calling `store.getState()`
- Use `as unknown as RootState` for partial state objects
- Import types with `type` keyword: `import { type MyType }`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Redux Testing](https://redux.js.org/usage/writing-tests)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
