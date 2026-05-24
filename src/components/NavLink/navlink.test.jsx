import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import NavLink from './index';

expect.extend(toHaveNoViolations);

describe('<NavLink />', () => {
  test('Renders a relative link if no http protocol in url', () => {
    renderWithProviders(
      <NavLink
        link={{
          url: '/about',
          label: 'About',
        }}
      />,
    );
    expect(screen.getByRole('link', 'About')).toHaveAttribute('href', '/about');
  });
  test('Renders a link if http protocol in url', () => {
    renderWithProviders(
      <NavLink
        link={{
          url: 'https://demo.getdkan.com',
          label: 'DKAN Demo',
        }}
      />,
    );
    expect(screen.getByRole('link', 'DKAN Demo')).toHaveAttribute(
      'href',
      'https://demo.getdkan.com'
    );
  });
});
