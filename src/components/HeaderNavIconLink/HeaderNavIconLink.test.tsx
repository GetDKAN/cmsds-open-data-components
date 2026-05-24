import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderNavIconLink from './index';

const baseProps = {
  url: 'https://example.test/home',
  urlTitle: 'Home',
  logoFilePath: '/logo.svg',
  logoAltText: 'Sample logo',
};

describe('HeaderNavIconLink', () => {
  it('renders an anchor wrapping the logo image with alt text', () => {
    const { container } = render(<HeaderNavIconLink {...baseProps} />);
    const link = screen.getByRole('link', { name: /sample logo/i });
    expect(link).toHaveAttribute('href', 'https://example.test/home');
    expect(link).toHaveAttribute('title', 'Home');
    expect(screen.getByAltText('Sample logo')).toHaveAttribute('src', '/logo.svg');
    expect(container.querySelector('.dkan-c-header-nav-icon-link')).not.toHaveClass(
      'show-back-arrow',
    );
  });

  it('adds the show-back-arrow class when backArrow is true', () => {
    const { container } = render(<HeaderNavIconLink {...baseProps} backArrow />);
    expect(container.querySelector('.dkan-c-header-nav-icon-link')).toHaveClass(
      'show-back-arrow',
    );
  });
});
