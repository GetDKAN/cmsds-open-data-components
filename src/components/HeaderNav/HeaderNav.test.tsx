import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HeaderNav from './index';
import HeaderContext from '../../templates/Header/HeaderContext';

jest.mock('../SubMenu', () => ({ link }: any) => (
  <li data-testid={`submenu-${link.id}`}>{link.label}</li>
));
jest.mock('../HeaderSearch', () => () => <div data-testid="header-search" />);

const ctx = (overrides = {}) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: jest.fn(),
  menuRef: { current: null } as any,
  isMobile: false,
  onDark: true,
  ...overrides,
});

const renderNav = (props: any = {}, context = ctx()) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HeaderContext.Provider value={context}>
        <HeaderNav {...props} />
      </HeaderContext.Provider>
    </MemoryRouter>,
  );

const links = [
  { id: 'a', label: 'Datasets', url: '/datasets' },
  { id: 'b', label: 'About', url: '/about' },
];

describe('HeaderNav', () => {
  it('renders every plain link', () => {
    renderNav({ links });
    expect(screen.getByRole('link', { name: 'Datasets' })).toHaveAttribute('href', '/datasets');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('renders a SubMenu instead of a NavLink for entries with a submenu', () => {
    renderNav({
      links: [{ id: 'sub', label: 'Tools', url: '/tools', submenu: [{ id: 'x', label: 'X', url: '/x' }] }],
    });
    expect(screen.getByTestId('submenu-sub')).toBeInTheDocument();
  });

  it('renders the topNavLinks section when provided', () => {
    renderNav({
      links,
      topNavLinks: [{ id: 'tn', label: 'Help', url: '/help' }],
    });
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/help');
  });

  it('renders HeaderSearch when searchInMobile is true', () => {
    renderNav({ links, searchInMobile: true });
    expect(screen.getByTestId('header-search')).toBeInTheDocument();
  });

  it('calls setMobileMenuOpen(false) when the close button is clicked', async () => {
    const user = userEvent.setup();
    const context = ctx();
    renderNav({ links }, context);
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(context.setMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
