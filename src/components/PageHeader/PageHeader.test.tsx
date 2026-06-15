import React from 'react';
import { render, screen } from '@testing-library/react';
import PageHeader from './index';

describe('PageHeader', () => {
  it('renders the headerText prop inside an h1', () => {
    render(<PageHeader headerText="Quarterly Sales" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quarterly Sales');
    expect(screen.getByTestId('profile-full-name')).toHaveTextContent('Quarterly Sales');
  });
});
