import { test, expect } from '../fixtures/test-fixtures';
import { generateTaskName } from '../utils/test-helpers';

test.describe('Time Tracking', () => {
  test('should add a single 15-minute time increment', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Task with time');

    await taskTimerPage.createTask(taskName);
    await taskTimerPage.addTimeIncrement(taskName, 9, 0); // 9:00-9:15

    const totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.hours).toBe(0);
    expect(totalTime.minutes).toBe(15);
  });

  test('should add multiple time increments to same task', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Multi-time task');

    await taskTimerPage.createTask(taskName);

    // Add 4 increments = 1 hour
    await taskTimerPage.addTimeIncrement(taskName, 9, 0); // 9:00-9:15
    await taskTimerPage.addTimeIncrement(taskName, 9, 15); // 9:15-9:30
    await taskTimerPage.addTimeIncrement(taskName, 9, 30); // 9:30-9:45
    await taskTimerPage.addTimeIncrement(taskName, 9, 45); // 9:45-10:00

    const totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.hours).toBe(1);
    expect(totalTime.minutes).toBe(0);
  });

  test('should add time increments across different hours', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Cross-hour task');

    await taskTimerPage.createTask(taskName);

    // Add time from different hours
    await taskTimerPage.addTimeIncrement(taskName, 8, 30); // 8:30-8:45
    await taskTimerPage.addTimeIncrement(taskName, 10, 15); // 10:15-10:30
    await taskTimerPage.addTimeIncrement(taskName, 14, 0); // 14:00-14:15

    const totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.hours).toBe(0);
    expect(totalTime.minutes).toBe(45);
  });

  test('should remove a time increment', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Remove time task');

    await taskTimerPage.createTask(taskName);

    // Add two increments
    await taskTimerPage.addTimeIncrement(taskName, 9, 0);
    await taskTimerPage.addTimeIncrement(taskName, 9, 15);

    // Verify we have 30 minutes
    let totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(30);

    // Remove one increment
    await taskTimerPage.removeTimeIncrement(taskName, 9, 0);

    // Should now have 15 minutes
    totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(15);
  });

  test('should toggle time increment on and off', async ({ taskTimerPage }) => {
    const taskName = generateTaskName('Toggle task');

    await taskTimerPage.createTask(taskName);
    const taskRow = taskTimerPage.getTaskByName(taskName);

    // Add time increment
    await taskTimerPage.addTimeIncrement(taskName, 10, 0);
    const increment = taskRow.locator('.increment').first();
    await expect(increment).toHaveClass(/logged/);

    // Remove it (toggle off)
    await taskTimerPage.removeTimeIncrement(taskName, 10, 0);
    await expect(increment).not.toHaveClass(/logged/);
  });

  test('should track time for multiple tasks independently', async ({
    taskTimerPage,
  }) => {
    const task1 = generateTaskName('Task 1');
    const task2 = generateTaskName('Task 2');

    await taskTimerPage.createTask(task1);
    await taskTimerPage.createTask(task2);

    // Add different amounts of time to each task
    await taskTimerPage.addTimeIncrement(task1, 9, 0);
    await taskTimerPage.addTimeIncrement(task1, 9, 15);

    await taskTimerPage.addTimeIncrement(task2, 10, 0);
    await taskTimerPage.addTimeIncrement(task2, 10, 15);
    await taskTimerPage.addTimeIncrement(task2, 10, 30);

    // Verify each task has correct time
    const time1 = await taskTimerPage.getTaskTotalTime(task1);
    expect(time1.minutes).toBe(30);

    const time2 = await taskTimerPage.getTaskTotalTime(task2);
    expect(time2.minutes).toBe(45);
  });

  test('should display correct total when adding significant time', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Long task');

    await taskTimerPage.createTask(taskName);

    // Add time to reach 2 hours and 45 minutes
    // Add 2 full hours (8 increments)
    for (let hour = 9; hour < 11; hour++) {
      await taskTimerPage.addTimeIncrement(taskName, hour, 0);
      await taskTimerPage.addTimeIncrement(taskName, hour, 15);
      await taskTimerPage.addTimeIncrement(taskName, hour, 30);
      await taskTimerPage.addTimeIncrement(taskName, hour, 45);
    }

    // Add 45 more minutes
    await taskTimerPage.addTimeIncrement(taskName, 11, 0);
    await taskTimerPage.addTimeIncrement(taskName, 11, 15);
    await taskTimerPage.addTimeIncrement(taskName, 11, 30);

    const totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.hours).toBe(2);
    expect(totalTime.minutes).toBe(45);
  });

  test('should maintain time when task is edited', async ({
    taskTimerPage,
  }) => {
    const originalName = generateTaskName('Original');
    const newName = generateTaskName('Renamed');

    await taskTimerPage.createTask(originalName);

    // Add time
    await taskTimerPage.addTimeIncrement(originalName, 9, 0);
    await taskTimerPage.addTimeIncrement(originalName, 9, 15);

    // Edit task name
    await taskTimerPage.editTask(originalName, newName);

    // Time should be preserved
    const totalTime = await taskTimerPage.getTaskTotalTime(newName);
    expect(totalTime.minutes).toBe(30);
  });

  test('should show time increment as logged visually', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Visual test');

    await taskTimerPage.createTask(taskName);
    const taskRow = taskTimerPage.getTaskByName(taskName);

    await taskTimerPage.addTimeIncrement(taskName, 9, 0);

    // The increment should have the 'logged' class
    const loggedIncrements = taskRow.locator('.increment.logged');
    expect(await loggedIncrements.count()).toBe(1);
  });
});
