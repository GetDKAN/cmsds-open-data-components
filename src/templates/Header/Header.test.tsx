import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './index';
import HeaderContext from './HeaderContext';

const mockUseMediaQuery = jest.fn();
jest.mock('react-responsive', () => ({
  useMediaQuery: (q: unknown) => mockUseMediaQuery(q),
}));

// Consumes HeaderContext, exposes state via data-* attributes, attaches menuRef to
// a real DOM node, and surfaces buttons that drive setMobileMenuOpen.
function Probe() {
  const ctx = useContext(HeaderContext);
  return (
    <div
      data-testid="probe"
      data-open={String(ctx.mobileMenuOpen)}
      data-mobile={String(ctx.isMobile)}
      data-dark={String(ctx.onDark)}
    >
      <div ref={ctx.menuRef} data-testid="menu-region">
        <button onClick={() => ctx.setMobileMenuOpen(true)}>Open menu</button>
        <button onClick={() => ctx.setMobileMenuOpen(false)}>Close menu</button>
        <button data-testid="inside-button">Inside</button>
      </div>
      <button data-testid="outside-button">Outside</button>
    </div>
  );
}

describe('Header (template)', () => {
  beforeEach(() => mockUseMediaQuery.mockReset());

  it('renders the Site header landmark with the --desktop class when not mobile', () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    const banner = screen.getByRole('banner', { name: /site header/i });
    expect(banner).toHaveClass('dkan-c-header--desktop');
    expect(banner).not.toHaveClass('dkan-c-header--mobile');
  });

  it('applies the --mobile class when the breakpoint matches', () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    const banner = screen.getByRole('banner', { name: /site header/i });
    expect(banner).toHaveClass('dkan-c-header--mobile');
    expect(banner).not.toHaveClass('dkan-c-header--desktop');
  });

  it('passes the configured mobileMaxWidth into useMediaQuery', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { unmount } = render(
      <Header>
        <Probe />
      </Header>,
    );
    expect(mockUseMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 768px)' });
    unmount();
    mockUseMediaQuery.mockClear();
    render(
      <Header mobileMaxWidth={1024}>
        <Probe />
      </Header>,
    );
    expect(mockUseMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' });
  });

  it('renders topNav when provided and omits the slot when not', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { rerender, queryByTestId } = render(
      <Header topNav={<div data-testid="custom-topnav" />}>
        <Probe />
      </Header>,
    );
    expect(queryByTestId('custom-topnav')).toBeInTheDocument();
    rerender(
      <Header>
        <Probe />
      </Header>,
    );
    expect(queryByTestId('custom-topnav')).not.toBeInTheDocument();
  });

  it('renders children inside the header wrapper', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(
      <Header>
        <Probe />
      </Header>,
    );
    expect(
      container.querySelector('.dkan-c-header--wrapper [data-testid="probe"]'),
    ).toBeInTheDocument();
  });

  it('provides initial context values: mobileMenuOpen=false, isMobile passthrough, onDark passthrough', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const { unmount } = render(
      <Header onDark>
        <Probe />
      </Header>,
    );
    let probe = screen.getByTestId('probe');
    expect(probe).toHaveAttribute('data-open', 'false');
    expect(probe).toHaveAttribute('data-mobile', 'true');
    expect(probe).toHaveAttribute('data-dark', 'true');
    unmount();

    mockUseMediaQuery.mockReturnValue(false);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    probe = screen.getByTestId('probe');
    expect(probe).toHaveAttribute('data-mobile', 'false');
    expect(probe).toHaveAttribute('data-dark', 'false');
  });

  it('updates mobileMenuOpen when setMobileMenuOpen is called from the context', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'false');
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'true');
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'false');
  });

  it('closes an open menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'true');
    fireEvent.keyUp(document, { key: 'Escape' });
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'false');
  });

  it('closes the menu on mousedown outside the menu ref but not on mousedown inside', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);
    render(
      <Header>
        <Probe />
      </Header>,
    );
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'true');

    // Mousedown inside menu region → menu stays open
    fireEvent.mouseDown(screen.getByTestId('inside-button'));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'true');

    // Mousedown outside menu region → menu closes
    fireEvent.mouseDown(screen.getByTestId('outside-button'));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'false');
  });

  it('closes an open menu when the viewport crosses from mobile to desktop', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);
    const { rerender } = render(
      <Header>
        <Probe />
      </Header>,
    );
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-mobile', 'true');

    // Simulate the viewport crossing the breakpoint
    mockUseMediaQuery.mockReturnValue(false);
    rerender(
      <Header>
        <Probe />
      </Header>,
    );
    expect(screen.getByTestId('probe')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-mobile', 'false');
  });
});
