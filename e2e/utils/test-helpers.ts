/**
 * Helper utilities for E2E tests
 */

/**
 * Generate a unique task name for testing
 */
export function generateTaskName(prefix = 'Test Task'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix} ${timestamp}-${random}`;
}

/**
 * Create mock localStorage data for testing
 * This can be used to set up specific test scenarios
 */
export function createMockLocalStorageData(config: {
  tasks?: Array<{ id: number; description: string; type: string }>;
  dateTasks?: Array<{ date: number; tasks: number[] }>;
  times?: Array<{ date: number; taskTimes: Array<{ task: number; start: number; end: number }> }>;
}) {
  const data: Record<string, string> = {};

  if (config.tasks) {
    data['tasks'] = JSON.stringify({
      nextTaskId: config.tasks.length + 1,
      tasks: config.tasks,
    });
  }

  if (config.dateTasks) {
    data['dateTasks'] = JSON.stringify({
      dateTasks: config.dateTasks,
    });
  }

  if (config.times) {
    data['dateTimes'] = JSON.stringify({
      dateTimes: config.times,
    });
  }

  return data;
}

/**
 * Get today's date at midnight (timestamp)
 */
export function getTodayTimestamp(): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Get yesterday's date at midnight (timestamp)
 */
export function getYesterdayTimestamp(): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 1);
  return date.getTime();
}

/**
 * Get a specific date at midnight (timestamp)
 */
export function getDateTimestamp(daysOffset: number): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return date.getTime();
}

/**
 * Create a timestamp for a specific time on a given date
 */
export function createTimeTimestamp(baseDate: number, hour: number, minute: number): number {
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date.getTime();
}

/**
 * Wait for a specific amount of time (in milliseconds)
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function until it succeeds or max attempts is reached
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delayMs?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000 } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await wait(delayMs);
    }
  }

  throw new Error('Retry failed');
}
