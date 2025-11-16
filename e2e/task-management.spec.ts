import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });
  });

  test('should edit task description', async ({ page }) => {
    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Original task name');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    const taskName = page.locator('.taskName').getByText('Original task name');
    await expect(taskName).toBeVisible();

    // Click on task name to enter edit mode
    await taskName.click();

    // Wait for edit mode (input field should be visible)
    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue('Original task name');

    // Change the description
    await editInput.clear();
    await editInput.fill('Updated task name');

    // Click "Update Task" button
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Verify updated description appears and edit mode is closed
    await expect(
      page.locator('.taskName').getByText('Updated task name')
    ).toBeVisible();
    await expect(editInput).not.toBeVisible();
  });

  test('should edit task description using Enter key', async ({ page }) => {
    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Task to edit with keyboard');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    const taskName = page
      .locator('.taskName')
      .getByText('Task to edit with keyboard');
    await expect(taskName).toBeVisible();

    // Click on task name to enter edit mode
    await taskName.click();

    // Wait for edit mode
    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();

    // Change the description and press Enter
    await editInput.clear();
    await editInput.fill('Edited with Enter key');
    await editInput.press('Enter');

    // Verify updated description appears
    await expect(
      page.locator('.taskName').getByText('Edited with Enter key')
    ).toBeVisible();
  });

  test('should cancel edit with Escape key', async ({ page }) => {
    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Original name');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    const taskName = page.locator('.taskName').getByText('Original name');
    await expect(taskName).toBeVisible();

    // Click on task name to enter edit mode
    await taskName.click();

    // Wait for edit mode
    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();

    // Change the description but press Escape
    await editInput.clear();
    await editInput.fill('This should be cancelled');
    await editInput.press('Escape');

    // Verify original description is still there
    await expect(
      page.locator('.taskName').getByText('Original name')
    ).toBeVisible();
  });

  test('should delete task', async ({ page }) => {
    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Task to delete');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    const taskName = page.locator('.taskName').getByText('Task to delete');
    await expect(taskName).toBeVisible();

    // Find and click the delete button
    const taskRow = page
      .locator('.taskRow')
      .filter({ hasText: 'Task to delete' });
    const deleteButton = taskRow.locator('.taskDelete');
    await deleteButton.click();

    // Verify task is removed
    await expect(taskName).not.toBeVisible();
  });

  test('should delete task with tracked time', async ({ page }) => {
    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Task with time to delete');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for task to appear
    const taskName = page
      .locator('.taskName')
      .getByText('Task with time to delete');
    await expect(taskName).toBeVisible();

    // Track some time
    const timeIncrement = page.locator('.increment').first();
    await timeIncrement.click();
    await expect(timeIncrement).toHaveClass(/logged/);

    // Delete the task
    const taskRow = page
      .locator('.taskRow')
      .filter({ hasText: 'Task with time to delete' });
    const deleteButton = taskRow.locator('.taskDelete');
    await deleteButton.click();

    // Verify task is removed
    await expect(taskName).not.toBeVisible();
  });
});
