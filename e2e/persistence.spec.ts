import { test, expect } from '@playwright/test';

test.describe('Data Persistence', () => {
  test('should persist tasks after page reload', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    // Create a task
    await taskInput.fill('Task that should persist');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify task appears
    const taskName = page
      .locator('.taskName')
      .getByText('Task that should persist');
    await expect(taskName).toBeVisible();

    // Reload the page
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 10000,
    });

    // Verify task still appears after reload
    await expect(
      page.locator('.taskName').getByText('Task that should persist')
    ).toBeVisible();
  });

  test('should persist tracked time after page reload', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    // Create a task
    await taskInput.fill('Task with tracked time');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Track some time (2 increments = 30 minutes)
    const increments = page.locator('.increment');
    await increments.nth(0).click();
    await increments.nth(1).click();

    // Verify time is tracked
    await expect(increments.nth(0)).toHaveClass(/logged/);
    await expect(increments.nth(1)).toHaveClass(/logged/);

    // Verify time summary shows 00:30
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:30');

    // Reload the page
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 10000,
    });

    // Verify task and time still appear after reload
    await expect(
      page.locator('.taskName').getByText('Task with tracked time')
    ).toBeVisible();

    const reloadedIncrements = page.locator('.increment');
    await expect(reloadedIncrements.nth(0)).toHaveClass(/logged/);
    await expect(reloadedIncrements.nth(1)).toHaveClass(/logged/);

    const reloadedTaskRow = page.locator('.taskRow').first();
    await expect(reloadedTaskRow).toContainText('00:30');
  });

  test('should persist multiple tasks after page reload', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    // Create three tasks
    await taskInput.fill('First persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    await taskInput.fill('Second persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    await taskInput.fill('Third persistent task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify all tasks appear
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(3);

    // Reload the page
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 10000,
    });

    // Verify all tasks still appear after reload
    await expect(
      page.locator('.taskName').getByText('First persistent task')
    ).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Second persistent task')
    ).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Third persistent task')
    ).toBeVisible();

    const reloadedTaskRows = page.locator('.taskRow');
    await expect(reloadedTaskRows).toHaveCount(3);
  });

  test('should persist task type after page reload', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    // Create a Meeting task
    const typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();

    await taskInput.fill('Persistent meeting');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify Meeting type
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Meeting');

    // Reload the page
    await page.reload();

    // Wait for app to load
    await expect(page.getByPlaceholder('Task name/description')).toBeVisible({
      timeout: 10000,
    });

    // Verify task type is still "Meeting"
    const reloadedTaskRow = page.locator('.taskRow').first();
    await expect(reloadedTaskRow.locator('.MuiChip-root')).toContainText(
      'Meeting'
    );
  });

  test('should persist task and time across date changes and reload', async ({
    page,
  }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

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
    // The date picker has 3 buttons: [previous date] [current date] [next date]
    // We need the third button (index 2) to go to the next day
    const headerButtons = page.locator('header button');
    const nextDayButton = headerButtons.nth(2);
    await nextDayButton.click();

    // Wait a moment for the date change to take effect
    await page.waitForTimeout(500);

    // Verify the task is NOT visible on the next day (it's date-specific)
    await expect(
      page.locator('.taskName').getByText('Task from yesterday')
    ).not.toBeVisible();

    // Navigate back to the previous day
    // We need the first button (index 0) to go to the previous day
    const previousDayButton = headerButtons.nth(0);
    await previousDayButton.click();

    // Wait for the date change
    await page.waitForTimeout(500);

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
      timeout: 10000,
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
