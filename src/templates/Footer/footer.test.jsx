import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { axe, toHaveNoViolations } from 'jest-axe';
import Footer from './index';

expect.extend(toHaveNoViolations);

describe('<Footer />', () => {
  // See Email Updates
  // See List of Tools
  // See List of Additional
  // See utility nav
  // See logos
  // See copyright
  // see address
  // see social media



  // test('Renders a relative link if no http protocol in url', () => {
  //   render(
  //     <NavLink
  //       link={{
  //         url: '/about',
  //         label: 'About'
  //       }}
  //     />,
  //   );
  //   const component = await axe(screen);
  //   expect(screen.getByRole('link', 'About')).toHaveAttribute('href', '/about');
  //   expect(results).toHaveNoViolations()
  // });
  // test('Renders a link if http protocol in url', () => {
  //   render(
  //     <NavLink
  //       link={{
  //         url: 'https://demo.getdkan.com',
  //         label: 'DKAN Demo'
  //       }}
  //     />,
  //   );
  //   expect(screen.getByRole('link', 'DKAN Demo')).toHaveAttribute('href', 'https://demo.getdkan.com');
  // });
});