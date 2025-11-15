import { type Page, type Locator, expect } from '@playwright/test';

// App constants - time range is 7am-6pm
const START_HOUR = 7;

/**
 * Page Object Model for the Task Timer application
 * Encapsulates all interactions with the UI for end-to-end tests
 */
export class TaskTimerPage {
  readonly page: Page;
  readonly taskNameInput: Locator;
  readonly taskTypeSelect: Locator;
  readonly addTaskButton: Locator;
  readonly appTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskNameInput = page.getByPlaceholder('Task name/description');
    this.taskTypeSelect = page.locator('select, [role="combobox"]').first();
    this.addTaskButton = page.getByRole('button', { name: /add task/i });
    this.appTitle = page.getByText('Task Timer');
  }

  /**
   * Navigate to the application
   */
  async goto() {
    await this.page.goto('/task-timer/');
    await expect(this.appTitle).toBeVisible();
  }

  /**
   * Create a new task with the given description and optional type
   */
  async createTask(description: string, type: 'task' | 'meeting' = 'task') {
    // Select task type if not default
    if (type !== 'task') {
      await this.taskTypeSelect.click();
      await this.page
        .getByRole('option', { name: new RegExp(type, 'i') })
        .click();
    }

    // Enter task description
    await this.taskNameInput.fill(description);

    // Click add task button
    await this.addTaskButton.click();

    // Wait for task to appear in the list
    await expect(this.getTaskByName(description)).toBeVisible();
  }

  /**
   * Create a task by pressing Enter instead of clicking the button
   */
  async createTaskWithEnter(description: string) {
    await this.taskNameInput.fill(description);
    await this.taskNameInput.press('Enter');
    await expect(this.getTaskByName(description)).toBeVisible();
  }

  /**
   * Get a task row by its description
   */
  getTaskByName(description: string): Locator {
    return this.page
      .locator('.taskRow, [class*="taskRow"]')
      .filter({ hasText: description });
  }

  /**
   * Get all task rows
   */
  getAllTasks(): Locator {
    return this.page.locator('.taskRow, [class*="taskRow"]');
  }

  /**
   * Edit a task's description
   */
  async editTask(oldDescription: string, newDescription: string) {
    const taskRow = this.getTaskByName(oldDescription);

    // Click on the task name to enter edit mode
    const taskName = taskRow.locator('.taskName, [class*="taskName"]');
    await taskName.click();

    // Find the input field and update the text
    const input = taskRow.locator('input[type="text"]');
    await input.fill(newDescription);

    // Click the update button
    const updateButton = taskRow.getByRole('button', { name: /update task/i });
    await updateButton.click();

    // Verify the task was updated
    await expect(this.getTaskByName(newDescription)).toBeVisible();
  }

  /**
   * Edit a task using Enter key
   */
  async editTaskWithEnter(oldDescription: string, newDescription: string) {
    const taskRow = this.getTaskByName(oldDescription);
    const taskName = taskRow.locator('.taskName, [class*="taskName"]');
    await taskName.click();

    const input = taskRow.locator('input[type="text"]');
    await input.fill(newDescription);
    await input.press('Enter');

    await expect(this.getTaskByName(newDescription)).toBeVisible();
  }

  /**
   * Cancel task edit with Escape key
   */
  async cancelTaskEdit(description: string) {
    const taskRow = this.getTaskByName(description);
    const taskName = taskRow.locator('.taskName, [class*="taskName"]');
    await taskName.click();

    const input = taskRow.locator('input[type="text"]');
    await input.press('Escape');

    // Verify we're no longer in edit mode
    await expect(input).not.toBeVisible();
  }

  /**
   * Delete a task
   */
  async deleteTask(description: string) {
    const taskRow = this.getTaskByName(description);
    const deleteButton = taskRow.locator('.taskDelete, [class*="taskDelete"]');
    await deleteButton.click();

    // Verify the task was deleted
    await expect(taskRow).not.toBeVisible();
  }

  /**
   * Add time to a task by clicking a time increment
   * @param taskDescription - The task to add time to
   * @param hour - The hour in 24-hour format (e.g., 9 for 9am, 14 for 2pm)
   * @param minuteSegment - The 15-minute segment (0, 15, 30, or 45)
   */
  async addTimeIncrement(
    taskDescription: string,
    hour: number,
    minuteSegment: 0 | 15 | 30 | 45
  ) {
    const taskRow = this.getTaskByName(taskDescription);

    // Calculate segment number based on hour offset from START_HOUR
    // Each hour has 4 segments (15-min each)
    const hourIndex = hour - START_HOUR;
    const segmentIndex = minuteSegment / 15;
    const segment = hourIndex * 4 + segmentIndex;

    // Find all increment buttons in this task row, then get the specific one by index
    const timeIncrement = taskRow
      .locator('[role="button"][aria-label*="Time segment"]')
      .nth(segment);

    await timeIncrement.click();

    // Verify the increment is now logged
    await expect(timeIncrement).toHaveAttribute('aria-pressed', 'true');
  }

  /**
   * Remove time from a task by clicking a logged time increment
   * @param taskDescription - The task to remove time from
   * @param hour - The hour in 24-hour format (e.g., 9 for 9am, 14 for 2pm)
   * @param minuteSegment - The 15-minute segment (0, 15, 30, or 45)
   */
  async removeTimeIncrement(
    taskDescription: string,
    hour: number,
    minuteSegment: 0 | 15 | 30 | 45
  ) {
    const taskRow = this.getTaskByName(taskDescription);

    // Calculate segment number based on hour offset from START_HOUR
    const hourIndex = hour - START_HOUR;
    const segmentIndex = minuteSegment / 15;
    const segment = hourIndex * 4 + segmentIndex;

    // Find the specific increment button by index
    const timeIncrement = taskRow
      .locator('[role="button"][aria-label*="Time segment"]')
      .nth(segment);

    await timeIncrement.click();

    // Verify the increment is no longer logged
    await expect(timeIncrement).toHaveAttribute('aria-pressed', 'false');
  }

  /**
   * Get the total time displayed for a task
   */
  async getTaskTotalTime(
    taskDescription: string
  ): Promise<{ hours: number; minutes: number }> {
    const taskRow = this.getTaskByName(taskDescription);

    // The time summary is typically in the last cell
    const timeSummary = taskRow
      .locator('[class*="timeSummary"], .timeSummary')
      .last();
    const text = await timeSummary.textContent();

    if (!text) {
      return { hours: 0, minutes: 0 };
    }

    // Parse time format like "1h 30m" or "0h 15m"
    const hoursMatch = text.match(/(\d+)h/);
    const minutesMatch = text.match(/(\d+)m/);

    return {
      hours: hoursMatch ? parseInt(hoursMatch[1]) : 0,
      minutes: minutesMatch ? parseInt(minutesMatch[1]) : 0,
    };
  }

  /**
   * Get the count of visible tasks
   */
  async getTaskCount(): Promise<number> {
    return await this.getAllTasks().count();
  }

  /**
   * Verify a task exists
   */
  async expectTaskToExist(description: string) {
    await expect(this.getTaskByName(description)).toBeVisible();
  }

  /**
   * Verify a task does not exist
   */
  async expectTaskNotToExist(description: string) {
    await expect(this.getTaskByName(description)).not.toBeVisible();
  }

  /**
   * Clear localStorage (useful for test setup/teardown)
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Get all data from localStorage
   */
  async getLocalStorageData(): Promise<Record<string, string>> {
    return await this.page.evaluate(() => {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key) || '';
        }
      }
      return data;
    });
  }

  /**
   * Set localStorage data
   */
  async setLocalStorageData(data: Record<string, string>) {
    await this.page.evaluate((storageData) => {
      for (const [key, value] of Object.entries(storageData)) {
        localStorage.setItem(key, value);
      }
    }, data);
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.page.reload();
    await expect(this.appTitle).toBeVisible();
  }

  /**
   * Navigate to the previous day
   */
  async goToPreviousDay() {
    // The previous day button shows the date of the previous day
    // We'll click the first date button in the header
    const dateButtons = this.page
      .getByRole('button')
      .filter({ hasText: /^\w+ \d+$/ });
    await dateButtons.first().click();
  }

  /**
   * Navigate to the next day
   */
  async goToNextDay() {
    // The next day button shows the date of the next day
    // We'll click the last date button (but not the calendar popover)
    const dateButtons = this.page
      .getByRole('button')
      .filter({ hasText: /^\w+ \d+$/ });
    await dateButtons.last().click();
  }

  /**
   * Get the currently selected date text from the UI
   */
  async getSelectedDateText(): Promise<string> {
    // The selected date is shown in the middle date button/popover trigger
    const dateButtons = this.page
      .getByRole('button')
      .filter({ hasText: /^\w+ \d+$/ });
    const count = await dateButtons.count();
    if (count >= 2) {
      // Get the middle button (the current date between prev and next)
      const middleButton = dateButtons.nth(1);
      return (await middleButton.textContent()) || '';
    }
    return '';
  }
}
