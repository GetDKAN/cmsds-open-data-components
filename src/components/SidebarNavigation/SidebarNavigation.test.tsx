import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarNavigation from './index';

const links = [
  { id: 'l1', label: 'Overview', url: '/overview', target: '_self' },
  { id: 'l2', label: 'Data', url: '/data', target: '_self' },
  { id: 'l3', label: 'Docs', url: '/docs', target: '_self' },
];

const renderSidebar = (route = '/overview', mobileMax = false) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <SidebarNavigation title="Sections" links={links} mobileMax={mobileMax} />
    </MemoryRouter>,
  );

describe('SidebarNavigation', () => {
  it('renders the title and every link', () => {
    renderSidebar();
    expect(screen.getByRole('heading', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Data' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('marks the current route with the active class', () => {
    renderSidebar('/data');
    const active = screen.getByRole('link', { name: 'Data' }).closest('li');
    expect(active).toHaveClass('active');
  });

  it('does not mark non-current routes as active', () => {
    renderSidebar('/data');
    const inactive = screen.getByRole('link', { name: 'Overview' }).closest('li');
    expect(inactive).not.toHaveClass('active');
  });

  it('applies the mobile class when mobileMax is true', () => {
    const { container } = renderSidebar('/overview', true);
    expect(container.querySelector('.dkan-c-sidebar-nav--mobile')).toBeInTheDocument();
  });

  it('toggles the menu open state when the toggle button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar();
    const toggle = screen.getByRole('button', { name: /toggle menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
