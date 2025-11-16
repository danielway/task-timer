import { test, expect } from '@playwright/test';

test.describe('Task Types', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });
  });

  test('should create task with default type', async ({ page }) => {
    // Create a task without changing the type
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Default task type');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the task appears with "Task" type chip
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toBeVisible();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Task');
  });

  test('should create task with Meeting type', async ({ page }) => {
    // Select Meeting type from dropdown
    const typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();

    // Click the Meeting option
    await page.getByRole('option', { name: 'Meeting' }).click();

    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Team standup');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the task appears with "Meeting" type chip
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toBeVisible();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Meeting');
  });

  test('should create task with Review type', async ({ page }) => {
    // Select Review type from dropdown
    const typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();

    // Click the Review option
    await page.getByRole('option', { name: 'Review' }).click();

    // Create a task
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Code review PR #123');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the task appears with "Review" type chip
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow).toBeVisible();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Review');
  });

  test('should change task type when editing', async ({ page }) => {
    // Create a task with default type
    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Task to change type');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify initial type is "Task"
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Task');

    // Click on task to enter edit mode
    const taskName = page.locator('.taskName').getByText('Task to change type');
    await taskName.click();

    // Wait for edit mode
    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();

    // Change the type to Meeting
    const editTypeSelect = page.locator(
      '.cell select, .cell [role="combobox"]'
    );
    await editTypeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();

    // Update the task
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Verify the type changed to "Meeting"
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Meeting');
  });

  test('should preserve task type after editing description', async ({
    page,
  }) => {
    // Create a Meeting task
    const typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();

    const taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Meeting to edit');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify initial type is "Meeting"
    const taskRow = page.locator('.taskRow').first();
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Meeting');

    // Edit the description without changing type
    const taskName = page.locator('.taskName').getByText('Meeting to edit');
    await taskName.click();

    const editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();
    await editInput.clear();
    await editInput.fill('Updated meeting');
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Verify type is still "Meeting"
    await expect(taskRow.locator('.MuiChip-root')).toContainText('Meeting');
  });

  test('should create multiple tasks with different types', async ({
    page,
  }) => {
    // Create a Task
    let taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Regular task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Create a Meeting
    let typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();
    taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('Team meeting');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Create a Review
    typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Review' }).click();
    taskInput = page.getByPlaceholder('Task name/description');
    await taskInput.fill('PR review');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify all three tasks appear with correct types
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(3);

    await expect(taskRows.nth(0).locator('.MuiChip-root')).toContainText(
      'Task'
    );
    await expect(taskRows.nth(1).locator('.MuiChip-root')).toContainText(
      'Meeting'
    );
    await expect(taskRows.nth(2).locator('.MuiChip-root')).toContainText(
      'Review'
    );
  });
});
