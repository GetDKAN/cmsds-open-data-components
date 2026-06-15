import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderTagline from './index';

describe('HeaderTagline', () => {
  it('renders the tagline prop inside the topnav tagline span', () => {
    const { container } = render(<HeaderTagline tagline="Open data for everyone" />);
    expect(screen.getByText('Open data for everyone')).toBeInTheDocument();
    expect(container.querySelector('.dkan-c-cms-topnav--tagline')).toBeInTheDocument();
  });
});
