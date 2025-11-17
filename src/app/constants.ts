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

// UI constants
export const UI = {
  CHIP: {
    FONT_SIZE: '0.7rem',
    HEIGHT: '20px',
    MARGIN_RIGHT: '8px',
  },
  SELECT: {
    FONT_SIZE: 13,
    MARGIN_RIGHT: 10,
    MIN_WIDTH: 100,
  },
  INPUT: {
    FONT_SIZE: 13,
  },
  BUTTON: {
    MARGIN_LEFT: 10,
  },
  SELECTION_BORDER: '2px dashed #173040',
} as const;

// Helper function to get today at midnight
export const getTodayAtMidnight = (): number => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
