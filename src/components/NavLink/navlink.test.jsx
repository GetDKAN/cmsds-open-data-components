import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import NavLink from './index';
import { MemoryRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('<NavLink />', () => {
  test('Renders a relative link if no http protocol in url', () => {
    render(
      <MemoryRouter>
        <NavLink
          link={{
            url: '/about',
            label: 'About',
          }}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', 'About')).toHaveAttribute('href', '/about');
  });
  test('Renders a link if http protocol in url', () => {
    render(
      <MemoryRouter>
        <NavLink
          link={{
            url: 'https://demo.getdkan.com',
            label: 'DKAN Demo',
          }}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', 'DKAN Demo')).toHaveAttribute(
      'href',
      'https://demo.getdkan.com'
    );
  });
});
