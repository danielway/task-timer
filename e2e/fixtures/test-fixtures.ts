import { test as base } from '@playwright/test';
import { TaskTimerPage } from '../page-objects/TaskTimerPage';

/**
 * Extended test fixture that provides a TaskTimerPage instance
 * and ensures localStorage is cleared before each test
 */
type TaskTimerFixtures = {
  taskTimerPage: TaskTimerPage;
};

export const test = base.extend<TaskTimerFixtures>({
  taskTimerPage: async ({ page }, use) => {
    const taskTimerPage = new TaskTimerPage(page);

    // Navigate to the app and clear localStorage before each test
    await taskTimerPage.goto();
    await taskTimerPage.clearLocalStorage();
    await taskTimerPage.reload();

    // Provide the page object to the test
    await use(taskTimerPage);
  },
});

export { expect } from '@playwright/test';
