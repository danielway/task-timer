import { test, expect } from '@playwright/test';

test.describe('Data Persistence', () => {
  test('should persist tasks, time, and types after page reload', async ({
    page,
  }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 3000 });

    // Create first task (default type) with tracked time
    await taskInput.fill('Task with tracked time');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Track time on first task (2 increments = 30 minutes)
    const increments = page.locator('.increment');
    await increments.nth(0).click();
    await increments.nth(1).click();

    // Verify time is tracked
    await expect(increments.nth(0)).toHaveClass(/logged/);
    await expect(increments.nth(1)).toHaveClass(/logged/);

    // Create second task with Meeting type
    const typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();
    await taskInput.fill('Persistent meeting');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Create third task
    await typeSelect.click();
    await page.getByRole('option', { name: 'Task' }).click();
    await taskInput.fill('Third persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify all tasks appear before reload
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(3);
    await expect(taskRows.first()).toContainText('00:30');

    // Reload the page
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 3000,
    });

    // Verify all tasks still appear after reload
    await expect(
      page.locator('.taskName').getByText('Task with tracked time')
    ).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Persistent meeting')
    ).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Third persistent task')
    ).toBeVisible();

    // Verify task count
    const reloadedTaskRows = page.locator('.taskRow');
    await expect(reloadedTaskRows).toHaveCount(3);

    // Verify tracked time persisted
    const reloadedIncrements = page
      .locator('.taskRow')
      .first()
      .locator('.increment');
    await expect(reloadedIncrements.nth(0)).toHaveClass(/logged/);
    await expect(reloadedIncrements.nth(1)).toHaveClass(/logged/);
    await expect(reloadedTaskRows.first()).toContainText('00:30');

    // Verify Meeting type persisted
    const meetingTaskRow = page
      .locator('.taskRow')
      .filter({ hasText: 'Persistent meeting' });
    await expect(meetingTaskRow.locator('.MuiChip-root')).toContainText(
      'Meeting'
    );
  });

  test('should persist task and time across date changes and reload', async ({
    page,
  }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 3000 });

    // Create a task and log time on the current date
    await taskInput.fill('Task from yesterday');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Track some time (2 increments = 30 minutes)
    const increments = page.locator('.increment');
    await increments.nth(0).click();
    await increments.nth(1).click();

    // Verify time is tracked
    await expect(increments.nth(0)).toHaveClass(/logged/);
    await expect(increments.nth(1)).toHaveClass(/logged/);

    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:30');

    // Navigate to the next day
    const headerButtons = page.locator('header button');
    const nextDayButton = headerButtons.nth(2);
    await nextDayButton.click();

    // Verify the task is NOT visible on the next day (it's date-specific)
    await expect(
      page.locator('.taskName').getByText('Task from yesterday')
    ).not.toBeVisible();

    // Navigate back to the previous day
    const previousDayButton = headerButtons.nth(0);
    await previousDayButton.click();

    // Verify the task and time are visible again
    await expect(
      page.locator('.taskName').getByText('Task from yesterday')
    ).toBeVisible();

    const restoredIncrements = page.locator('.increment');
    await expect(restoredIncrements.nth(0)).toHaveClass(/logged/);
    await expect(restoredIncrements.nth(1)).toHaveClass(/logged/);

    const restoredTaskRow = page.locator('.taskRow').first();
    await expect(restoredTaskRow).toContainText('00:30');

    // Reload the page to test persistence after reload
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 3000,
    });

    // Verify the task and time still persist after reload
    await expect(
      page.locator('.taskName').getByText('Task from yesterday')
    ).toBeVisible();

    const reloadedIncrements = page.locator('.increment');
    await expect(reloadedIncrements.nth(0)).toHaveClass(/logged/);
    await expect(reloadedIncrements.nth(1)).toHaveClass(/logged/);

    const reloadedTaskRow = page.locator('.taskRow').first();
    await expect(reloadedTaskRow).toContainText('00:30');
  });
});
