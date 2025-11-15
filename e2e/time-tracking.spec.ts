import { test, expect } from '@playwright/test';

test.describe('Time Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and create a task for time tracking tests
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });

    await taskInput.fill('Time tracking test task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    await expect(
      page.locator('.taskName').getByText('Time tracking test task')
    ).toBeVisible();
  });

  test('should track time when clicking a time increment', async ({ page }) => {
    // Find the first time increment button for the task
    const timeIncrement = page
      .locator('.increment')
      .first()
      .filter({ has: page.locator('[aria-pressed="false"]') });

    // Click to start tracking
    await timeIncrement.click();

    // Verify the increment is now logged
    await expect(timeIncrement).toHaveClass(/logged/);
    await expect(timeIncrement).toHaveAttribute('aria-pressed', 'true');

    // Verify the time summary shows 15 minutes (00:15)
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:15');
  });

  test('should stop tracking when clicking a logged time increment', async ({
    page,
  }) => {
    // Find and click the first time increment to start tracking
    const timeIncrement = page.locator('.increment').first();
    await timeIncrement.click();

    // Verify it's logged
    await expect(timeIncrement).toHaveClass(/logged/);
    await expect(timeIncrement).toHaveAttribute('aria-pressed', 'true');

    // Click again to stop tracking
    await timeIncrement.click();

    // Verify the increment is no longer logged
    await expect(timeIncrement).not.toHaveClass(/logged/);
    await expect(timeIncrement).toHaveAttribute('aria-pressed', 'false');

    // Verify the time summary shows 00:00
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:00');
  });

  test('should track multiple time increments', async ({ page }) => {
    // Click three time increments
    const increments = page.locator('.increment');
    await increments.nth(0).click();
    await increments.nth(1).click();
    await increments.nth(2).click();

    // Verify all three are logged
    await expect(increments.nth(0)).toHaveClass(/logged/);
    await expect(increments.nth(1)).toHaveClass(/logged/);
    await expect(increments.nth(2)).toHaveClass(/logged/);

    // Verify the time summary shows 45 minutes (00:45)
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:45');
  });
});
