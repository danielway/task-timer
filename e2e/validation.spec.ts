import { test, expect } from '@playwright/test';

test.describe('Validation and Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });
  });

  test('should not create task with empty description', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Try to create task with empty description
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify no task was created
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(0);

    // Verify input is still empty
    await expect(taskInput).toHaveValue('');
  });

  test('should not create task with only whitespace', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Try to create task with only spaces
    await taskInput.fill('   ');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify no task was created
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(0);
  });

  test('should trim whitespace from task description', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create task with leading and trailing whitespace
    await taskInput.fill('  Task with spaces  ');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify task was created with trimmed description
    await expect(
      page.locator('.taskName').getByText('Task with spaces')
    ).toBeVisible();

    // Verify whitespace was trimmed (exact match)
    const taskName = page.locator('.taskName').first();
    const taskText = await taskName.textContent();
    expect(taskText).toContain('Task with spaces');
    expect(taskText).not.toContain('  Task with spaces  ');
  });

  test('should not update task with empty description', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create a task
    await taskInput.fill('Original task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Click to edit
    const taskName = page.locator('.taskName').getByText('Original task');
    await taskName.click();

    // Try to update with empty description
    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();
    await editInput.clear();
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Verify task still has original description (edit was cancelled)
    await expect(
      page.locator('.taskName').getByText('Original task')
    ).toBeVisible();
  });

  test('should handle task with very long description', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create a task with a very long description (within reasonable limits)
    const longDescription = 'A'.repeat(200);
    await taskInput.fill(longDescription);
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify task was created (may be truncated by UI)
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(1);

    // Verify the task row contains at least part of the description
    await expect(taskRows.first()).toContainText('AAA');
  });

  test('should handle special characters in task description', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create task with special characters
    const specialCharsTask = 'Task with @#$%^&*()_+-=[]{}|;:,.<>?';
    await taskInput.fill(specialCharsTask);
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify task was created with special characters
    await expect(
      page.locator('.taskName').getByText(specialCharsTask)
    ).toBeVisible();
  });

  test('should handle unicode and emoji in task description', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create task with emoji and unicode
    const unicodeTask = 'Meeting 📅 with team 👥 at 3pm ⏰';
    await taskInput.fill(unicodeTask);
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify task was created with unicode characters
    await expect(
      page.locator('.taskName').getByText(unicodeTask)
    ).toBeVisible();
  });

  test('should handle rapid task creation', async ({ page }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Quickly create multiple tasks
    for (let i = 1; i <= 5; i++) {
      await taskInput.fill(`Rapid task ${i}`);
      await page.getByRole('button', { name: 'Add Task' }).click();
    }

    // Verify all tasks were created
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(5);
  });

  test('should handle clicking same time increment multiple times', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create a task
    await taskInput.fill('Time toggle test');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const increment = page.locator('.increment').first();

    // Click to enable
    await increment.click();
    await expect(increment).toHaveClass(/logged/);

    // Click to disable
    await increment.click();
    await expect(increment).not.toHaveClass(/logged/);

    // Click to enable again
    await increment.click();
    await expect(increment).toHaveClass(/logged/);

    // Click to disable again
    await increment.click();
    await expect(increment).not.toHaveClass(/logged/);

    // Verify time is 00:00
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toContainText('00:00');
  });

  test('should handle editing then immediately deleting task', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create a task
    await taskInput.fill('Task to edit then delete');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Edit the task
    const taskName = page
      .locator('.taskName')
      .getByText('Task to edit then delete');
    await taskName.click();

    const editInput = page.locator('.cell input[type="text"]');
    await editInput.clear();
    await editInput.fill('Edited task');
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Immediately delete the task
    const taskRow = page.locator('.taskRow').filter({ hasText: 'Edited task' });
    const deleteButton = taskRow.locator('.taskDelete');
    await deleteButton.click();

    // Verify task is deleted
    await expect(
      page.locator('.taskName').getByText('Edited task')
    ).not.toBeVisible();
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(0);
  });

  test('should preserve data after multiple rapid page reloads', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create a task with time
    await taskInput.fill('Reload resilience test');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const increment = page.locator('.increment').first();
    await increment.click();
    await expect(increment).toHaveClass(/logged/);

    // Reload multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await expect(taskInput).toBeVisible({ timeout: 10000 });
    }

    // Verify task and time still exist
    await expect(
      page.locator('.taskName').getByText('Reload resilience test')
    ).toBeVisible();
    const reloadedIncrement = page.locator('.increment').first();
    await expect(reloadedIncrement).toHaveClass(/logged/);
  });
});
