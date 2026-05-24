import React from 'react';
import { render, screen } from '@testing-library/react';
import PageNotFound from './index';

describe('PageNotFound', () => {
  it('renders the default 404 message when content is not provided', () => {
    render(<PageNotFound siteUrl="example.test" />);
    expect(
      screen.getByRole('heading', { level: 1, name: /error: page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no example\.test web page/i)).toBeInTheDocument();
  });

  it('renders custom content in place of the default message when provided', () => {
    render(
      <PageNotFound
        siteUrl="example.test"
        content={<div data-testid="custom">Custom 404 panel</div>}
      />,
    );
    expect(screen.getByTestId('custom')).toHaveTextContent('Custom 404 panel');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
