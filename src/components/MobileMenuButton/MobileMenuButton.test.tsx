import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import MobileMenuButton from './index';

const buildHeaderContext = (overrides: Partial<{
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (b: boolean) => void;
}> = {}) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: jest.fn(),
  menuRef: null as any,
  isMobile: true,
  onDark: false,
  ...overrides,
});

describe('MobileMenuButton', () => {
  it('reflects the closed state via aria-expanded=false and the --open class modifier', () => {
    renderWithProviders(<MobileMenuButton />, {
      headerContextValue: buildHeaderContext({ mobileMenuOpen: false }),
    });
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveClass('dkan-c-mobile-menu-button--open');
  });

  it('reflects the open state and toggles state on click', () => {
    const ctx = buildHeaderContext({ mobileMenuOpen: true });
    renderWithProviders(<MobileMenuButton />, { headerContextValue: ctx });
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('dkan-c-mobile-menu-button--close');
    fireEvent.click(button);
    expect(ctx.setMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
