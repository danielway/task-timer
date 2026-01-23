import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderWithProviders,
  mockToday,
  mockYesterday,
  mockTomorrow,
} from '../../test-utils/test-utils';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  const defaultState = {
    app: {
      version: '1.0',
      selectedDate: mockToday,
      backlogOpen: false,
      backlogExpanded: false,
      showCompleted: true,
    },
    date: {
      dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
    },
    time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
    task: { nextTaskId: 1, tasks: [] },
  };

  it('should render the current date', () => {
    renderWithProviders(<DatePicker />, {
      preloadedState: defaultState,
    });

    // Should show the current date (January 15 based on mockToday)
    expect(screen.getByText(/January 15/)).toBeTruthy();
  });

  it('should render previous and next date buttons', () => {
    renderWithProviders(<DatePicker />, {
      preloadedState: defaultState,
    });

    // Previous date (January 14)
    expect(screen.getByText(/January 14/)).toBeTruthy();
    // Next date (January 16)
    expect(screen.getByText(/January 16/)).toBeTruthy();
  });

  it('should navigate to previous day when clicking previous date button', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<DatePicker />, {
      preloadedState: defaultState,
    });

    const prevButton = screen.getByText(/January 14/);
    await user.click(prevButton);

    expect(stores.app.getState().selectedDate).toBe(mockYesterday);
  });

  it('should navigate to next day when clicking next date button', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<DatePicker />, {
      preloadedState: defaultState,
    });

    const nextButton = screen.getByText(/January 16/);
    await user.click(nextButton);

    expect(stores.app.getState().selectedDate).toBe(mockTomorrow);
  });
});
