import { test, expect } from '@playwright/test';

test.describe('Multi-Task Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    const taskInput = page.getByPlaceholder('Task name/description');
    await expect(taskInput).toBeVisible({ timeout: 10000 });
  });

  test('should create and track multiple tasks', async ({ page }) => {
    // Create three tasks with different types
    const taskInput = page.getByPlaceholder('Task name/description');

    // Task 1: Regular task
    await taskInput.fill('Development work');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Task 2: Meeting
    let typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Meeting' }).click();
    await taskInput.fill('Team standup');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Task 3: Review
    typeSelect = page.locator('select, [role="combobox"]').first();
    await typeSelect.click();
    await page.getByRole('option', { name: 'Review' }).click();
    await taskInput.fill('Code review');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify all tasks appear
    const taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(3);

    // Track time on first task (2 increments = 30 minutes)
    const firstTaskIncrements = taskRows.nth(0).locator('.increment');
    await firstTaskIncrements.nth(0).click();
    await firstTaskIncrements.nth(1).click();

    // Track time on second task (1 increment = 15 minutes)
    const secondTaskIncrements = taskRows.nth(1).locator('.increment');
    await secondTaskIncrements.nth(0).click();

    // Track time on third task (3 increments = 45 minutes)
    const thirdTaskIncrements = taskRows.nth(2).locator('.increment');
    await thirdTaskIncrements.nth(0).click();
    await thirdTaskIncrements.nth(1).click();
    await thirdTaskIncrements.nth(2).click();

    // Verify time totals
    await expect(taskRows.nth(0)).toContainText('00:30');
    await expect(taskRows.nth(1)).toContainText('00:15');
    await expect(taskRows.nth(2)).toContainText('00:45');
  });

  test('should handle editing multiple tasks', async ({ page }) => {
    // Create two tasks
    const taskInput = page.getByPlaceholder('Task name/description');

    await taskInput.fill('First task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    await taskInput.fill('Second task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Edit first task
    const firstTaskName = page.locator('.taskName').getByText('First task');
    await firstTaskName.click();

    let editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();
    await editInput.clear();
    await editInput.fill('First task updated');
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Edit second task
    const secondTaskName = page.locator('.taskName').getByText('Second task');
    await secondTaskName.click();

    editInput = page.locator('.cell input[type="text"]');
    await expect(editInput).toBeVisible();
    await editInput.clear();
    await editInput.fill('Second task updated');
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Verify both tasks are updated
    await expect(
      page.locator('.taskName').getByText('First task updated')
    ).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Second task updated')
    ).toBeVisible();
  });

  test('should delete task from a list of multiple tasks', async ({ page }) => {
    // Create three tasks
    const taskInput = page.getByPlaceholder('Task name/description');

    console.log('Creating Task A');
    await taskInput.fill('Task A');
    await page.getByRole('button', { name: 'Add Task' }).click();

    console.log('Creating Task B');
    await taskInput.fill('Task B');
    await page.getByRole('button', { name: 'Add Task' }).click();

    console.log('Creating Task C');
    await taskInput.fill('Task C');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify all three tasks exist
    let taskRows = page.locator('.taskRow');
    const count = await taskRows.count();
    console.log('Task rows count:', count);
    await expect(taskRows).toHaveCount(3);

    // Debug: Log all task row content
    console.log('\n=== DEBUG: Task Row Content ===');
    for (let i = 0; i < count; i++) {
      const row = taskRows.nth(i);
      const taskNameEl = row.locator('.taskName');
      const taskText = await taskNameEl.textContent();
      console.log(`Row ${i} task name text:`, taskText);

      // Check for delete buttons in this row
      const deleteButtons = row.locator('[role="button"]');
      const deleteCount = await deleteButtons.count();
      console.log(`Row ${i} has ${deleteCount} buttons with role="button"`);

      for (let j = 0; j < deleteCount; j++) {
        const btn = deleteButtons.nth(j);
        const ariaLabel = await btn.getAttribute('aria-label');
        const className = await btn.getAttribute('class');
        console.log(
          `  Button ${j}: aria-label="${ariaLabel}", class="${className}"`
        );
      }
    }

    // Try to find Task B row
    console.log('\n=== DEBUG: Finding Task B Row ===');
    const taskBRow = page.locator('.taskRow').filter({ hasText: 'Task B' });
    const taskBCount = await taskBRow.count();
    console.log('Rows matching "Task B":', taskBCount);

    if (taskBCount > 0) {
      const taskBText = await taskBRow.first().textContent();
      console.log('Task B row full text:', taskBText);

      // Try to find delete button within Task B row
      console.log('\n=== DEBUG: Finding Delete Button ===');
      const allButtonsInRow = taskBRow.locator('[role="button"]');
      const btnCount = await allButtonsInRow.count();
      console.log('Buttons with role="button" in Task B row:', btnCount);

      for (let i = 0; i < btnCount; i++) {
        const btn = allButtonsInRow.nth(i);
        const ariaLabel = await btn.getAttribute('aria-label');
        console.log(`  Button ${i} aria-label:`, ariaLabel);
      }
    }

    // Delete the middle task (Task B)
    const deleteButton = taskBRow.getByRole('button', {
      name: 'Delete task: Task B',
    });

    console.log('\n=== DEBUG: Attempting to click delete button ===');
    const isVisible = await deleteButton.isVisible().catch(() => false);
    console.log('Delete button visible:', isVisible);

    await deleteButton.click();

    // Verify only two tasks remain
    taskRows = page.locator('.taskRow');
    await expect(taskRows).toHaveCount(2);

    // Verify Task B is gone but Task A and C remain
    await expect(page.locator('.taskName').getByText('Task A')).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Task B')
    ).not.toBeVisible();
    await expect(page.locator('.taskName').getByText('Task C')).toBeVisible();
  });

  test('should track time across multiple tasks independently', async ({
    page,
  }) => {
    // Create two tasks
    const taskInput = page.getByPlaceholder('Task name/description');

    await taskInput.fill('Task with time 1');
    await page.getByRole('button', { name: 'Add Task' }).click();

    await taskInput.fill('Task with time 2');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const taskRows = page.locator('.taskRow');

    // Track time on first task
    const firstTaskIncrements = taskRows.nth(0).locator('.increment');
    await firstTaskIncrements.nth(0).click();
    await firstTaskIncrements.nth(1).click();

    // Track time on second task (different increments)
    const secondTaskIncrements = taskRows.nth(1).locator('.increment');
    await secondTaskIncrements.nth(2).click();
    await secondTaskIncrements.nth(3).click();
    await secondTaskIncrements.nth(4).click();

    // Verify first task only has its time logged
    await expect(firstTaskIncrements.nth(0)).toHaveClass(/logged/);
    await expect(firstTaskIncrements.nth(1)).toHaveClass(/logged/);
    await expect(firstTaskIncrements.nth(2)).not.toHaveClass(/logged/);

    // Verify second task only has its time logged
    await expect(secondTaskIncrements.nth(0)).not.toHaveClass(/logged/);
    await expect(secondTaskIncrements.nth(2)).toHaveClass(/logged/);
    await expect(secondTaskIncrements.nth(3)).toHaveClass(/logged/);
    await expect(secondTaskIncrements.nth(4)).toHaveClass(/logged/);

    // Verify time totals are independent
    await expect(taskRows.nth(0)).toContainText('00:30');
    await expect(taskRows.nth(1)).toContainText('00:45');
  });

  test('should handle complex workflow with create, edit, track, and delete', async ({
    page,
  }) => {
    const taskInput = page.getByPlaceholder('Task name/description');

    // Create first task
    await taskInput.fill('Task 1');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Track time on first task
    const taskRows = page.locator('.taskRow');
    const firstTaskIncrements = taskRows.nth(0).locator('.increment');
    await firstTaskIncrements.nth(0).click();

    // Create second task
    await taskInput.fill('Task 2');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Edit first task
    const firstTaskName = page.locator('.taskName').getByText('Task 1');
    await firstTaskName.click();
    const editInput = page.locator('.cell input[type="text"]');
    await editInput.clear();
    await editInput.fill('Task 1 Updated');
    await page.getByRole('button', { name: 'Update Task' }).click();

    // Track time on second task
    const secondTaskIncrements = taskRows.nth(1).locator('.increment');
    await secondTaskIncrements.nth(0).click();
    await secondTaskIncrements.nth(1).click();

    // Create third task
    await taskInput.fill('Task 3');
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify state before delete
    await expect(taskRows).toHaveCount(3);
    await expect(taskRows.nth(0)).toContainText('00:15');
    await expect(taskRows.nth(1)).toContainText('00:30');

    // Delete second task
    const task2Row = page.locator('.taskRow').filter({ hasText: 'Task 2' });
    const deleteButton = task2Row.getByRole('button', {
      name: 'Delete task: Task 2',
    });
    await deleteButton.click();

    // Verify final state
    const finalTaskRows = page.locator('.taskRow');
    await expect(finalTaskRows).toHaveCount(2);
    await expect(
      page.locator('.taskName').getByText('Task 1 Updated')
    ).toBeVisible();
    await expect(page.locator('.taskName').getByText('Task 3')).toBeVisible();
    await expect(
      page.locator('.taskName').getByText('Task 2')
    ).not.toBeVisible();
  });
});
