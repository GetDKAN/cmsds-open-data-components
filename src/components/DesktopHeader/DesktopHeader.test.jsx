import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import DesktopHeader from './DesktopHeader';

jest.mock('../NavBar', () => ({ links, menuName }) => (
  <nav data-testid={`navbar-${menuName}`}>
    {links?.map((l) => (
      <a key={l.id ?? l.label} href={l.url}>
        {l.label}
      </a>
    ))}
  </nav>
));

jest.mock('../SearchModal', () => () => <div data-testid="search-modal" />);

const links = {
  topnav: [{ id: 't1', label: 'About', url: '/about' }],
  main: [{ id: 'm1', label: 'Datasets', url: '/datasets' }],
};

const renderHeader = (props = {}) =>
  render(
    <MemoryRouter>
      <DesktopHeader siteName="Sample Open Data" links={links} {...props} />
    </MemoryRouter>,
  );

describe('DesktopHeader', () => {
  it('renders the site name as a link to /', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Sample Open Data' })).toHaveAttribute('href', '/');
  });

  it('renders both the top nav and main nav by default', () => {
    renderHeader();
    expect(screen.getByTestId('navbar-CMS Main Header')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-CMS Site Main Nav')).toBeInTheDocument();
  });

  it('hides the top nav when includeTopNav is false', () => {
    renderHeader({ includeTopNav: false });
    expect(screen.queryByTestId('navbar-CMS Main Header')).not.toBeInTheDocument();
    expect(screen.getByTestId('navbar-CMS Site Main Nav')).toBeInTheDocument();
  });

  it('renders the default SearchModal when no customSearch is provided', () => {
    renderHeader();
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
  });

  it('renders customSearch in place of SearchModal when provided', () => {
    renderHeader({ customSearch: <div data-testid="custom-search">custom</div> });
    expect(screen.getByTestId('custom-search')).toBeInTheDocument();
    expect(screen.queryByTestId('search-modal')).not.toBeInTheDocument();
  });
});
