import { test, expect } from '../fixtures/test-fixtures';
import { generateTaskName } from '../utils/test-helpers';

test.describe('Date Navigation', () => {
  test('should navigate to previous day', async ({ taskTimerPage }) => {
    const initialDate = await taskTimerPage.getSelectedDateText();

    await taskTimerPage.goToPreviousDay();

    const newDate = await taskTimerPage.getSelectedDateText();
    expect(newDate).not.toBe(initialDate);
  });

  test('should navigate to next day', async ({ taskTimerPage }) => {
    const initialDate = await taskTimerPage.getSelectedDateText();

    await taskTimerPage.goToNextDay();

    const newDate = await taskTimerPage.getSelectedDateText();
    expect(newDate).not.toBe(initialDate);
  });

  test('should navigate back and forth between dates', async ({
    taskTimerPage,
  }) => {
    const initialDate = await taskTimerPage.getSelectedDateText();

    // Go to next day
    await taskTimerPage.goToNextDay();
    const nextDate = await taskTimerPage.getSelectedDateText();
    expect(nextDate).not.toBe(initialDate);

    // Go back to previous day (should be initial date)
    await taskTimerPage.goToPreviousDay();
    const backToInitial = await taskTimerPage.getSelectedDateText();
    expect(backToInitial).toBe(initialDate);
  });

  test('should show tasks only for selected date', async ({
    taskTimerPage,
  }) => {
    const todayTask = generateTaskName('Today task');
    const tomorrowTask = generateTaskName('Tomorrow task');

    // Create task for today
    await taskTimerPage.createTask(todayTask);
    await taskTimerPage.expectTaskToExist(todayTask);

    // Navigate to tomorrow
    await taskTimerPage.goToNextDay();

    // Today's task should not be visible
    await taskTimerPage.expectTaskNotToExist(todayTask);

    // Create task for tomorrow
    await taskTimerPage.createTask(tomorrowTask);
    await taskTimerPage.expectTaskToExist(tomorrowTask);

    // Navigate back to today
    await taskTimerPage.goToPreviousDay();

    // Today's task should be visible, tomorrow's should not
    await taskTimerPage.expectTaskToExist(todayTask);
    await taskTimerPage.expectTaskNotToExist(tomorrowTask);
  });

  test('should preserve time data when navigating between dates', async ({
    taskTimerPage,
  }) => {
    const todayTask = generateTaskName('Today task');

    // Create task and add time
    await taskTimerPage.createTask(todayTask);
    await taskTimerPage.addTimeIncrement(todayTask, 9, 0);
    await taskTimerPage.addTimeIncrement(todayTask, 9, 15);

    // Verify time is 30 minutes
    let totalTime = await taskTimerPage.getTaskTotalTime(todayTask);
    expect(totalTime.minutes).toBe(30);

    // Navigate to tomorrow and back
    await taskTimerPage.goToNextDay();
    await taskTimerPage.goToPreviousDay();

    // Time should still be 30 minutes
    totalTime = await taskTimerPage.getTaskTotalTime(todayTask);
    expect(totalTime.minutes).toBe(30);
  });

  test('should maintain separate time entries for different dates', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Multi-day task');

    // Create task today and add time
    await taskTimerPage.createTask(taskName);
    await taskTimerPage.addTimeIncrement(taskName, 9, 0); // 15 min

    let totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(15);

    // Go to tomorrow
    await taskTimerPage.goToNextDay();

    // Create same task name tomorrow and add different time
    await taskTimerPage.createTask(taskName);
    await taskTimerPage.addTimeIncrement(taskName, 10, 0);
    await taskTimerPage.addTimeIncrement(taskName, 10, 15); // 30 min

    totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(30);

    // Go back to today
    await taskTimerPage.goToPreviousDay();

    // Should still show 15 minutes for today
    totalTime = await taskTimerPage.getTaskTotalTime(taskName);
    expect(totalTime.minutes).toBe(15);
  });

  test('should handle empty state when navigating to new date', async ({
    taskTimerPage,
  }) => {
    const taskName = generateTaskName('Only today');

    await taskTimerPage.createTask(taskName);
    await taskTimerPage.expectTaskToExist(taskName);

    // Navigate to a future date (multiple days ahead)
    await taskTimerPage.goToNextDay();
    await taskTimerPage.goToNextDay();

    // Should show empty state (no tasks)
    const taskCount = await taskTimerPage.getTaskCount();
    expect(taskCount).toBe(0);

    // Should still be able to create tasks
    const futureTask = generateTaskName('Future task');
    await taskTimerPage.createTask(futureTask);
    await taskTimerPage.expectTaskToExist(futureTask);
  });

  test('should navigate multiple days in sequence', async ({
    taskTimerPage,
  }) => {
    const dates: string[] = [];

    // Capture initial date
    dates.push(await taskTimerPage.getSelectedDateText());

    // Navigate forward 3 days
    for (let i = 0; i < 3; i++) {
      await taskTimerPage.goToNextDay();
      const date = await taskTimerPage.getSelectedDateText();
      dates.push(date);
      expect(dates[i]).not.toBe(date);
    }

    // All dates should be unique
    const uniqueDates = new Set(dates);
    expect(uniqueDates.size).toBe(4);

    // Navigate backward 3 days
    for (let i = 0; i < 3; i++) {
      await taskTimerPage.goToPreviousDay();
    }

    // Should be back to initial date
    const finalDate = await taskTimerPage.getSelectedDateText();
    expect(finalDate).toBe(dates[0]);
  });
});
