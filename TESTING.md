# Testing Documentation

This project has comprehensive test coverage for all business logic and critical components using Vitest and React Testing Library.

## Test Stats

- **Total Tests:** 182
- **Test Files:** 10
- **Overall Coverage:** ~58%
- **Business Logic Coverage:** 100% (Redux slices, keyboard navigation)

## Test Structure

### Unit Tests (`src/app/slices/*.test.ts`)

Tests for Redux slices covering all business logic:

- **timeSlice.test.ts** (26 tests) - Time tracking, segment calculation, time toggling
- **taskSlice.test.ts** (23 tests) - Task CRUD operations
- **dateSlice.test.ts** (29 tests) - Date-to-task mapping, task ordering
- **editSlice.test.ts** (24 tests) - UI selection state
- **appSlice.test.ts** (15 tests) - App-level state
- **keyboard.test.ts** (28 tests) - Keyboard navigation logic

### Integration Tests (`src/components/**/*.test.tsx`)

Tests for components integrated with Redux:

- **TimeIncrement.test.tsx** (8 tests) - Time segment toggling with Redux
- **TaskCreationRow.test.tsx** (12 tests) - Task creation workflow
- **TaskRow.test.tsx** (16 tests) - Task editing, deletion, time display
- **App.test.tsx** (1 test) - Basic rendering

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

## Coverage Goals

### Current Coverage by Category:

| Category                | Coverage | Details                                        |
| ----------------------- | -------- | ---------------------------------------------- |
| **Redux Slices**        | 100%     | All business logic fully tested                |
| **Keyboard Navigation** | 100%     | All navigation paths covered                   |
| **Task Components**     | 90.82%   | Task creation, editing, deletion               |
| **Time Components**     | Partial  | TimeIncrement 100%, layout components untested |
| **Layout Components**   | 0%       | Presentational components (future work)        |

### Priority Areas (100% Coverage):

✅ **appSlice** - Date selection and app state
✅ **dateSlice** - Task-to-date mapping and ordering
✅ **editSlice** - UI selection and edit state
✅ **taskSlice** - Task CRUD operations
✅ **timeSlice** - Time tracking and segment calculations
✅ **keyboard.ts** - Keyboard navigation state machine

## Test Utilities

### `test-utils.tsx`

Provides `renderWithProviders()` for testing components with Redux:

```typescript
import { renderWithProviders } from '../../test-utils/test-utils';

const { store } = renderWithProviders(<MyComponent />, {
  preloadedState: {
    task: { nextTaskId: 1, tasks: [] },
    // ... other state
  }
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

## CI/CD Integration

Tests run automatically on every push and pull request via GitHub Actions:

1. **Lint** - Code quality checks
2. **Format Check** - Prettier formatting
3. **Build** - Production build verification
4. **Tests** - All 182 tests
5. **Coverage** - Generate and upload coverage reports

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

  const state = store.getState();
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

## Future Enhancements

Potential areas for additional test coverage:

1. **Layout Components** - DatePicker, Table, Header, Footer, etc.
2. **Visual Regression Tests** - Playwright visual comparisons
3. **E2E Tests** - Full user workflow tests with Playwright
4. **Accessibility Tests** - jest-axe integration
5. **Performance Tests** - Large dataset rendering tests

## Troubleshooting

### Tests timing out

If tests timeout, check for:

- Missing `await` on async operations
- Infinite loops in useEffect hooks
- Missing date entries in test state

### Component rendering errors

Common issues:

- Missing required Redux state slices
- TableRow components need parent Table/TableBody
- Date entries must exist in both `date` and `time` slices

### Coverage not meeting thresholds

Current thresholds are set to 50% to account for untested layout components. Focus on:

- 100% coverage for all business logic (slices)
- 90%+ coverage for interactive components
- Layout components can be tested as time permits

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Redux Testing](https://redux.js.org/usage/writing-tests)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
