import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { BacklogHeader } from './BacklogHeader';

describe('BacklogHeader', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
  };

  const defaultState = {
    app: {
      version: '1.0',
      selectedDate: mockToday,
      backlogOpen: true,
      backlogExpanded: false,
      showCompleted: true,
    },
  };

  it('should render the backlog title', () => {
    renderWithProviders(<BacklogHeader {...defaultProps} />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('Backlog')).toBeTruthy();
  });

  it('should render the search field', () => {
    renderWithProviders(<BacklogHeader {...defaultProps} />, {
      preloadedState: defaultState,
    });

    expect(screen.getByPlaceholderText('Search tasks...')).toBeTruthy();
  });

  it('should render the manage projects button', () => {
    renderWithProviders(<BacklogHeader {...defaultProps} />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('Manage Projects')).toBeTruthy();
  });

  it('should call onSearchChange when typing in search field', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    renderWithProviders(
      <BacklogHeader {...defaultProps} onSearchChange={onSearchChange} />,
      { preloadedState: defaultState }
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'test');

    // Each keystroke triggers onChange with the full input value
    expect(onSearchChange).toHaveBeenCalledTimes(4);
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('should display the current search query', () => {
    renderWithProviders(
      <BacklogHeader {...defaultProps} searchQuery="my search" />,
      { preloadedState: defaultState }
    );

    const searchInput = screen.getByPlaceholderText(
      'Search tasks...'
    ) as HTMLInputElement;
    expect(searchInput.value).toBe('my search');
  });

  it('should close backlog when clicking close button', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(
      <BacklogHeader {...defaultProps} />,
      {
        preloadedState: defaultState,
      }
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(stores.app.getState().backlogOpen).toBe(false);
  });

  it('should open project manager when clicking manage projects', async () => {
    const user = userEvent.setup();

    renderWithProviders(<BacklogHeader {...defaultProps} />, {
      preloadedState: defaultState,
    });

    const manageButton = screen.getByText('Manage Projects');
    await user.click(manageButton);

    // Project manager dialog should be open
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
