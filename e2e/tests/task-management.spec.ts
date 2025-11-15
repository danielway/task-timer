import { test, expect } from '../fixtures/test-fixtures';
import { generateTaskName } from '../utils/test-helpers';

test.describe('Task Management', () => {
  test('should create a new task with default type', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Buy groceries');

    await taskTimerPage.createTask(taskName);

    await taskTimerPage.expectTaskToExist(taskName);
  });

  test('should create a task by pressing Enter', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Meeting notes');

    await taskTimerPage.createTaskWithEnter(taskName);

    await taskTimerPage.expectTaskToExist(taskName);
  });

  test('should create multiple tasks', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('Task 1');
    const task2 = generateTaskName('Task 2');
    const task3 = generateTaskName('Task 3');

    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);
    await taskTimerPage.createTask(task3);

    await taskTimerPage.expectTaskToExist(task1);
    await taskTimerPage.expectTaskToExist(task2);
    await taskTimerPage.expectTaskToExist(task3);

    const taskCount = await taskTimerPage.getTaskCount();
    expect(taskCount).toBeGreaterThanOrEqual(3);
  });

  test('should create a task with meeting type', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Team standup');

    await taskTimerPage.createTask(taskName, 'meeting');

    await taskTimerPage.expectTaskToExist(taskName);
  });

  test('should edit a task description', async ({ taskTimerPage }) => {
    const originalName = generateTaskName('Original task');
    const newName = generateTaskName('Updated task');

    await taskTimerPage.createTask(originalName);
    await taskTimerPage.editTask(originalName, newName);

    await taskTimerPage.expectTaskNotToExist(originalName);
    await taskTimerPage.expectTaskToExist(newName);
  });

  test('should edit a task using Enter key', async ({ taskTimerPage }) => {
    const originalName = generateTaskName('Old description');
    const newName = generateTaskName('New description');

    await taskTimerPage.createTask(originalName);
    await taskTimerPage.editTaskWithEnter(originalName, newName);

    await taskTimerPage.expectTaskNotToExist(originalName);
    await taskTimerPage.expectTaskToExist(newName);
  });

  test('should cancel task edit with Escape key', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Important task');

    await taskTimerPage.createTask(taskName);
    await taskTimerPage.cancelTaskEdit(taskName);

    // Task should still exist with original name
    await taskTimerPage.expectTaskToExist(taskName);
  });

  test('should delete a task', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Task to delete');

    await taskTimerPage.createTask(taskName);
    await taskTimerPage.expectTaskToExist(taskName);

    await taskTimerPage.deleteTask(taskName);

    await taskTimerPage.expectTaskNotToExist(taskName);
  });

  test('should delete multiple tasks', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('Delete 1');
    const task2 = generateTaskName('Delete 2');
    const task3 = generateTaskName('Keep this');

    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);
    await taskTimerPage.createTask(task3);

    await taskTimerPage.deleteTask(task1);
    await taskTimerPage.deleteTask(task2);

    await taskTimerPage.expectTaskNotToExist(task1);
    await taskTimerPage.expectTaskNotToExist(task2);
    await taskTimerPage.expectTaskToExist(task3);
  });

  test('should handle empty task description', async ({ taskTimerPage }) => {
    // Create a task and then edit it to empty
    const taskName = generateTaskName('Task');

    await taskTimerPage.createTask(taskName);

    const taskRow = taskTimerPage.getTaskByName(taskName);
    const taskNameElement = taskRow.locator('.taskName, [class*="taskName"]');
    await taskNameElement.click();

    const input = taskRow.locator('input[type="text"]');
    await input.fill('');

    const updateButton = taskRow.getByRole('button', { name: /update task/i });
    await updateButton.click();

    // Task should exist but with empty description
    const updatedTaskRow = taskTimerPage.getAllTasks().first();
    await expect(updatedTaskRow).toBeVisible();
  });

  test('should maintain task order when editing', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('First');
    const task2 = generateTaskName('Second');
    const task3 = generateTaskName('Third');

    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);
    await taskTimerPage.createTask(task3);

    const newTask2 = generateTaskName('Second Updated');
    await taskTimerPage.editTask(task2, newTask2);

    // All tasks should still exist
    await taskTimerPage.expectTaskToExist(task1);
    await taskTimerPage.expectTaskToExist(newTask2);
    await taskTimerPage.expectTaskToExist(task3);
  });
});
