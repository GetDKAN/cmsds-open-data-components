import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CMSTopNav from './index';

const org = {
  url: 'https://example.test',
  tagline: 'Open data made simple',
  urlTitle: 'Example Open Data',
  logoAltText: 'Example logo',
  logoFilePath: '/logo.png',
};

const links = [
  { id: 'a', label: 'About', url: '/about', target: '_self' },
  { id: 'b', label: 'Topics', url: '/topics', target: '_self' },
];

const renderTopNav = (props = {}) =>
  render(
    <MemoryRouter>
      <CMSTopNav org={org} links={links} {...props} />
    </MemoryRouter>,
  );

describe('CMSTopNav', () => {
  it('renders the org tagline', () => {
    renderTopNav();
    expect(screen.getByText('Open data made simple')).toBeInTheDocument();
  });

  it('renders every nav link with its href', () => {
    renderTopNav();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Topics' })).toHaveAttribute('href', '/topics');
  });

  it('renders nothing in the nav when links is empty', () => {
    renderTopNav({ links: [] });
    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
  });
});
