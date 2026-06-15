import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import LargeFileInfo from './index';

describe('LargeFileInfo', () => {
  it('renders the software-specs link and applies an optional className wrapper', () => {
    const { container } = renderWithProviders(<LargeFileInfo className="custom-wrap" />);
    const link = screen.getByRole('link', { name: /software specifications and limits/i });
    expect(link).toHaveAttribute('href', '/about/software-specs-and-limits');
    expect(container.querySelector('.custom-wrap')).toBeInTheDocument();
  });
});
