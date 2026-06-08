import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchButton from './index';

const mockUseMediaQuery = jest.fn();
jest.mock('react-responsive', () => ({
  useMediaQuery: (q: unknown) => mockUseMediaQuery(q),
}));

describe('SearchButton', () => {
  beforeEach(() => mockUseMediaQuery.mockReset());

  it('renders the desktop variant with default text and arrow when not in the mobile-alt mode', () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<SearchButton />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
    // Desktop branch always renders the visible label text node.
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('uses custom text prop in the desktop variant', () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<SearchButton text="Find datasets" />);
    expect(screen.getByText('Find datasets')).toBeInTheDocument();
  });

  it('renders the icon-only mobile variant when altMobileStyle and small breakpoint match', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const { container } = render(<SearchButton altMobileStyle text="ignored" />);
    expect(container.querySelector('.dc-c-search-button-mobile')).toBeInTheDocument();
    // Mobile variant has no visible text label — only the icon span.
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });
});
