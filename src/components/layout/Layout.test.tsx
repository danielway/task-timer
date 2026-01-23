import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { Layout } from './Layout';

describe('Layout', () => {
  const defaultState = {
    app: {
      version: '1.0',
      selectedDate: mockToday,
      backlogOpen: false,
      backlogExpanded: false,
      showCompleted: true,
    },
  };

  it('should render children content', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>,
      { preloadedState: defaultState }
    );

    expect(screen.getByTestId('child-content')).toBeTruthy();
    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('should render header', () => {
    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>,
      { preloadedState: defaultState }
    );

    expect(screen.getByText('Task Timer')).toBeTruthy();
  });

  it('should render footer', () => {
    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>,
      { preloadedState: defaultState }
    );

    // Footer contains author link
    expect(screen.getByText('Daniel Way')).toBeTruthy();
  });

  it('should render backlog drawer', () => {
    const stateWithBacklogOpen = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: true,
        backlogExpanded: false,
        showCompleted: true,
      },
    };

    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>,
      { preloadedState: stateWithBacklogOpen }
    );

    expect(screen.getByText('Backlog')).toBeTruthy();
  });
});
