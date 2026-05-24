import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import NavBar from './index';

// Mock SubMenu so we can assert the submenu branch fired without exercising its internals.
jest.mock('../SubMenu', () => (props: any) => (
  <li data-testid={`submenu-${props.link.id}`}>{props.link.label}</li>
));

const links = [
  { id: 'datasets', label: 'Datasets', to: '/datasets' },
  {
    id: 'topics',
    label: 'Topics',
    submenu: [
      { id: 'sales', label: 'Sales', to: '/topics/sales' },
      { id: 'inventory', label: 'Inventory', to: '/topics/inventory' },
    ],
  },
];

describe('NavBar', () => {
  it('renders a flat NavLink for items without a submenu and a SubMenu for items with one', () => {
    renderWithProviders(
      <NavBar
        links={links}
        menuName="Main Menu"
        menuId="main"
        menuClasses="menu"
        linkClasses="menu-link"
      />,
    );

    // Plain link branch
    expect(screen.getByRole('link', { name: 'Datasets' })).toBeInTheDocument();
    // Submenu branch
    expect(screen.getByTestId('submenu-topics')).toHaveTextContent('Topics');
  });

  it('exposes the menu via the screen-reader heading and labelled nav', () => {
    const { container } = renderWithProviders(
      <NavBar links={[]} menuName="Site Nav" menuId="site" />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Site Nav' })).toBeInTheDocument();
    expect(container.querySelector('nav')).toHaveAttribute(
      'aria-labelledby',
      'dkan-c-site-menu--heading',
    );
  });
});
