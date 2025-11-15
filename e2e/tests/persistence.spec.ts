import { test, expect } from '../fixtures/test-fixtures';
import { generateTaskName, getTodayTimestamp, createTimeTimestamp } from '../utils/test-helpers';

test.describe('Data Persistence', () => {
  test('should persist tasks after page reload', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('Persistent task 1');
    const task2 = generateTaskName('Persistent task 2');

    // Create tasks
    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);

    // Reload the page
    await taskTimerPage.reload();

    // Tasks should still exist
    await taskTimerPage.expectTaskToExist(task1);
    await taskTimerPage.expectTaskToExist(task2);
  });

  test('should persist time entries after page reload', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Timed task');

    // Create task and add time
    await taskTimerPage.createTask(taskName);
    await taskTimerPage.addTimeIncrement(taskName, 9, 0);
    await taskTimerPage.addTimeIncrement(taskName, 9, 15);
    await taskTimerPage.addTimeIncrement(taskName, 9, 30);

    // Verify time before reload
    let totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(45);

    // Reload the page
    await taskTimerPage.reload();

    // Time should still be 45 minutes
    totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(45);
  });

  test('should persist task edits after page reload', async ({ taskTimerPage }) => {
    const originalName = generateTaskName('Original');
    const updatedName = generateTaskName('Updated');

    // Create and edit task
    await taskTimerPage.createTask(originalName);
    await taskTimerPage.editTask(originalName, updatedName);

    // Reload the page
    await taskTimerPage.reload();

    // Updated name should persist
    await taskTimerPage.expectTaskToExist(updatedName);
    await taskTimerPage.expectTaskNotToExist(originalName);
  });

  test('should persist task deletion after page reload', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('Keep this');
    const task2 = generateTaskName('Delete this');

    // Create tasks
    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);

    // Delete one task
    await taskTimerPage.deleteTask(task2);

    // Reload the page
    await taskTimerPage.reload();

    // Only task1 should exist
    await taskTimerPage.expectTaskToExist(task1);
    await taskTimerPage.expectTaskNotToExist(task2);
  });

  test('should persist data across different dates', async ({ taskTimerPage }) => {
    const todayTask = generateTaskName('Today');
    const tomorrowTask = generateTaskName('Tomorrow');

    // Create task today
    await taskTimerPage.createTask(todayTask);
    await taskTimerPage.addTimeIncrement(todayTask, 9, 0);

    // Go to tomorrow and create task
    await taskTimerPage.goToNextDay();
    await taskTimerPage.createTask(tomorrowTask);
    await taskTimerPage.addTimeIncrement(tomorrowTask, 10, 0);

    // Reload the page
    await taskTimerPage.reload();

    // Tomorrow's task should still exist
    await taskTimerPage.expectTaskToExist(tomorrowTask);
    let totalTime = await taskTimerPage.getTaskTotalTime(tomorrowTask);
    expect(totalTime.minutes).toBe(15);

    // Go back to today
    await taskTimerPage.goToPreviousDay();

    // Today's task should still exist with correct time
    await taskTimerPage.expectTaskToExist(todayTask);
    totalTime = await taskTimerPage.getTaskTotalTime(todayTask);
    expect(totalTime.minutes).toBe(15);
  });

  test('should handle localStorage data correctly', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Storage test');

    // Create task
    await taskTimerPage.createTask(taskName);

    // Get localStorage data
    const storageData = await taskTimerPage.getLocalStorageData();

    // Should have task-related keys
    expect(storageData).toHaveProperty('tasks');

    // Parse and verify task data
    const tasksData = JSON.parse(storageData.tasks);
    expect(tasksData.tasks).toBeDefined();
    expect(Array.isArray(tasksData.tasks)).toBe(true);
    expect(tasksData.tasks.length).toBeGreaterThan(0);

    // Find our task
    const ourTask = tasksData.tasks.find((t: { description: string }) =>
      t.description.includes(taskName)
    );
    expect(ourTask).toBeDefined();
  });

  test('should restore from pre-populated localStorage', async ({ taskTimerPage, page }) => {
    const today = getTodayTimestamp();
    const taskId = 999;
    const taskDescription = 'Pre-populated task';

    // Clear and set localStorage before navigating
    await page.goto('/task-timer/');
    await taskTimerPage.setLocalStorageData({
      tasks: JSON.stringify({
        nextTaskId: taskId + 1,
        tasks: [{ id: taskId, description: taskDescription, type: 'task' }],
      }),
      dateTasks: JSON.stringify({
        dateTasks: [{ date: today, tasks: [taskId] }],
      }),
      dateTimes: JSON.stringify({
        dateTimes: [
          {
            date: today,
            taskTimes: [
              {
                task: taskId,
                start: createTimeTimestamp(today, 9, 0),
                end: createTimeTimestamp(today, 9, 30),
              },
            ],
          },
        ],
      }),
    });

    // Reload to apply localStorage data
    await taskTimerPage.reload();

    // Task should be visible
    await taskTimerPage.expectTaskToExist(taskDescription);

    // Time should be 30 minutes
    const totalTime = await taskTimerPage.getTaskTotalTime(taskDescription);
    expect(totalTime.minutes).toBe(30);
  });

  test('should persist complex multi-day workflow', async ({ taskTimerPage }) => {
    const task1 = generateTaskName('Project A');
    const task2 = generateTaskName('Project B');

    // Day 1: Create tasks and add time
    await taskTimerPage.createTask(task1);
    await taskTimerPage.addTimeIncrement(task1, 9, 0);
    await taskTimerPage.addTimeIncrement(task1, 9, 15);

    await taskTimerPage.createTask(task2);
    await taskTimerPage.addTimeIncrement(task2, 10, 0);

    // Day 2: Navigate to tomorrow
    await taskTimerPage.goToNextDay();
    await taskTimerPage.createTask(task1); // Same task name, different day
    await taskTimerPage.addTimeIncrement(task1, 11, 0);

    // Reload the page
    await taskTimerPage.reload();

    // Should be on day 2 with correct data
    await taskTimerPage.expectTaskToExist(task1);
    let totalTime = await taskTimerPage.getTaskTotalTime(task1);
    expect(totalTime.minutes).toBe(15);

    // Go back to day 1
    await taskTimerPage.goToPreviousDay();

    // Day 1 data should be intact
    await taskTimerPage.expectTaskToExist(task1);
    await taskTimerPage.expectTaskToExist(task2);

    totalTime = await taskTimerPage.getTaskTotalTime(task1);
    expect(totalTime.minutes).toBe(30);

    totalTime = await taskTimerPage.getTaskTotalTime(task2);
    expect(totalTime.minutes).toBe(15);
  });

  test('should handle empty localStorage gracefully', async ({ taskTimerPage }) => {
    // Clear localStorage
    await taskTimerPage.clearLocalStorage();
    await taskTimerPage.reload();

    // Should show empty state
    const taskCount = await taskTimerPage.getTaskCount();
    expect(taskCount).toBe(0);

    // Should be able to create new tasks
    const newTask = generateTaskName('First task');
    await taskTimerPage.createTask(newTask);
    await taskTimerPage.expectTaskToExist(newTask);
  });

  test('should maintain data integrity after multiple operations', async ({ taskTimerPage }) => {
    const tasks = [
      generateTaskName('Task A'),
      generateTaskName('Task B'),
      generateTaskName('Task C'),
    ];

    // Create multiple tasks
    for (const task of tasks) {
      await taskTimerPage.createTask(task);
      await taskTimerPage.addTimeIncrement(task, 9, 0);
    }

    // Edit middle task
    const newName = generateTaskName('Task B Updated');
    await taskTimerPage.editTask(tasks[1], newName);

    // Delete first task
    await taskTimerPage.deleteTask(tasks[0]);

    // Reload
    await taskTimerPage.reload();

    // Verify final state
    await taskTimerPage.expectTaskNotToExist(tasks[0]);
    await taskTimerPage.expectTaskNotToExist(tasks[1]);
    await taskTimerPage.expectTaskToExist(newName);
    await taskTimerPage.expectTaskToExist(tasks[2]);

    // Verify times are preserved
    const time1 = await taskTimerPage.getTaskTotalTime(newName);
    expect(time1.minutes).toBe(15);

    const time2 = await taskTimerPage.getTaskTotalTime(tasks[2]);
    expect(time2.minutes).toBe(15);
  });
});
