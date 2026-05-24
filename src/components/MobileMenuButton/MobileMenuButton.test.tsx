import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderContext from '../../templates/Header/HeaderContext';
import MobileMenuButton from './index';

const renderWithContext = (overrides: Partial<{
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (b: boolean) => void;
}> = {}) => {
  const value = {
    mobileMenuOpen: false,
    setMobileMenuOpen: jest.fn(),
    menuRef: null as any,
    isMobile: true,
    onDark: false,
    ...overrides,
  };
  const utils = render(
    <HeaderContext.Provider value={value}>
      <MobileMenuButton />
    </HeaderContext.Provider>,
  );
  return { ...utils, value };
};

describe('MobileMenuButton', () => {
  it('reflects the closed state via aria-expanded=false and the --open class modifier', () => {
    renderWithContext({ mobileMenuOpen: false });
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveClass('dkan-c-mobile-menu-button--open');
  });

  it('reflects the open state and toggles state on click', () => {
    const { value } = renderWithContext({ mobileMenuOpen: true });
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('dkan-c-mobile-menu-button--close');
    fireEvent.click(button);
    expect(value.setMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
