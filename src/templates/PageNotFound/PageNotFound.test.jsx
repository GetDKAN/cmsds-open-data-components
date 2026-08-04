import React from 'react';
import { render, screen } from '@testing-library/react';
import PageNotFound from './index';

describe('PageNotFound', () => {
  it('renders the default 404 message when content is not provided', () => {
    render(<PageNotFound siteUrl="example.test" />);
    expect(
      screen.getByRole('heading', { level: 1, name: /page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sorry, we can't find this page. It may have moved or been renamed. Check that the address is correct and update any bookmarks when you find the page you want.")).toBeInTheDocument();
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

  it('links the Home button to siteUrl when provided', () => {
    render(<PageNotFound siteUrl="https://example.test" />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', 'https://example.test');
  });

  it('links the Home button to "/" when siteUrl is not provided', () => {
    render(<PageNotFound />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });
});
