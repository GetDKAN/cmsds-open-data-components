import React from 'react';
import { renderWithProviders, screen, userEvent } from '../../tests/renderWithProviders';
import HeaderNav from './index';

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

const links = [
  { id: 'a', label: 'Datasets', url: '/datasets' },
  { id: 'b', label: 'About', url: '/about' },
];

describe('HeaderNav', () => {
  it('renders every plain link', () => {
    renderWithProviders(<HeaderNav links={links} />, { headerContextValue: ctx() });
    expect(screen.getByRole('link', { name: 'Datasets' })).toHaveAttribute('href', '/datasets');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('renders a SubMenu instead of a NavLink for entries with a submenu', () => {
    renderWithProviders(
      <HeaderNav
        links={[{ id: 'sub', label: 'Tools', url: '/tools', submenu: [{ id: 'x', label: 'X', url: '/x' }] }]}
      />,
      { headerContextValue: ctx() },
    );
    expect(screen.getByTestId('submenu-sub')).toBeInTheDocument();
  });

  it('renders the topNavLinks section when provided', () => {
    renderWithProviders(
      <HeaderNav links={links} topNavLinks={[{ id: 'tn', label: 'Help', url: '/help' }]} />,
      { headerContextValue: ctx() },
    );
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/help');
  });

  it('renders HeaderSearch when searchInMobile is true', () => {
    renderWithProviders(<HeaderNav links={links} searchInMobile />, {
      headerContextValue: ctx(),
    });
    expect(screen.getByTestId('header-search')).toBeInTheDocument();
  });

  it('calls setMobileMenuOpen(false) when the close button is clicked', async () => {
    const user = userEvent.setup();
    const context = ctx();
    renderWithProviders(<HeaderNav links={links} />, { headerContextValue: context });
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(context.setMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
