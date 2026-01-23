import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should render the author link', () => {
    render(<Footer />);

    const authorLink = screen.getByText('Daniel Way');
    expect(authorLink).toBeTruthy();
    expect(authorLink.getAttribute('href')).toBe('https://www.danieldway.com');
  });

  it('should render the GitHub repository link', () => {
    render(<Footer />);

    const repoLink = screen.getByText('Contribute or fork on GitHub.');
    expect(repoLink).toBeTruthy();
    expect(repoLink.getAttribute('href')).toBe(
      'https://github.com/danielway/task-timer'
    );
  });

  it('should render the release link', () => {
    render(<Footer />);

    const releaseLink = screen.getByText(/vREPLACE_WITH_RELEASE/);
    expect(releaseLink).toBeTruthy();
  });
});
