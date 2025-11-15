import { test, expect } from '@playwright/test';

test.describe('Task Creation', () => {
  test('should create a new task', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the task creation input field to be visible (confirms app loaded)
    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    // Type a task description
    const taskDescription = 'Write E2E tests for task timer';
    await taskInput.fill(taskDescription);

    // Click the "Add Task" button
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the task appears in the task list
    await expect(
      page.locator('.taskName').getByText(taskDescription)
    ).toBeVisible();

    // Verify localStorage contains the task
    const localStorage = await page.evaluate(() => {
      return window.localStorage.getItem('taskTimerState');
    });
    expect(localStorage).toContain(taskDescription);
  });
});
