import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import MobileHeader from './MobileHeader';

jest.mock('react-responsive', () => ({
  useMediaQuery: () => false,
}));

jest.mock('../NavBar/Navbar', () => {
  return function MockNavBar({ menuName, links }: { menuName: string; links: Array<{ id: string; label: string; url: string }> }) {
    return (
      <nav data-testid={`navbar-${menuName}`}>
        {links.map((link) => (
          <a key={link.id} href={link.url}>{link.label}</a>
        ))}
      </nav>
    );
  };
});

const defaultLinks = {
  main: [
    { id: 'home', label: 'Home', url: '/', pathname: '/' },
    { id: 'about', label: 'About', url: '/about', pathname: '/about' },
  ],
  topnav: [
    { id: 'org', label: 'Organization', url: 'https://example.com', pathname: 'https://example.com' },
  ],
};

const renderMobileHeader = (props = {}) => {
  return render(
    <MemoryRouter>
      <MobileHeader
        siteName="Test Site"
        links={defaultLinks}
        includeSearch={false}
        includeTopNav={false}
        {...props}
      />
    </MemoryRouter>
  );
};

describe('MobileHeader', () => {
  it('renders the site name', () => {
    renderMobileHeader();
    expect(screen.getByText('Test Site')).toBeInTheDocument();
  });

  it('opens the menu when clicking the Menu button', async () => {
    renderMobileHeader();
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('menu-open');

    await userEvent.click(screen.getByText('Menu'));
    expect(header).toHaveClass('menu-open');
  });

  it('closes the menu when clicking the Close button', async () => {
    renderMobileHeader();
    await userEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('banner')).toHaveClass('menu-open');

    await userEvent.click(screen.getByText('Close'));
    expect(screen.getByRole('banner')).not.toHaveClass('menu-open');
  });

  it('closes the menu on Escape key', async () => {
    renderMobileHeader();
    await userEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('banner')).toHaveClass('menu-open');

    fireEvent.keyUp(document, { key: 'Escape', keyCode: 27 });
    expect(screen.getByRole('banner')).not.toHaveClass('menu-open');
  });

  describe('focus trap', () => {
    it('does not trap focus when the menu is closed', async () => {
      renderMobileHeader();
      const mobileMenu = screen.getByTestId('mobile-menu');

      // Open then close the menu
      await userEvent.click(screen.getByText('Menu'));
      await userEvent.click(screen.getByText('Close'));
      expect(screen.getByRole('banner')).not.toHaveClass('menu-open');

      // Simulate Tab keydown on the menu container — should not call preventDefault
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(tabEvent, 'preventDefault');
      mobileMenu.dispatchEvent(tabEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
