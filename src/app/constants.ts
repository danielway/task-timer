// Display times from 7am to 6pm
export const START_HOUR = 7;
export const END_HOUR = 18;
export const HOUR_COUNT = END_HOUR - START_HOUR;

// Time tracking constants
export const MINUTES_PER_SEGMENT = 15;
export const SEGMENTS_PER_HOUR = 4;
export const MAX_SEGMENTS = HOUR_COUNT * SEGMENTS_PER_HOUR;

// Validation constants
export const MAX_TASK_DESCRIPTION_LENGTH = 500;

// Helper function to get today at midnight
export const getTodayAtMidnight = (): number => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
