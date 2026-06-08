import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import SidebarPage from './index';

const mockUseMediaQuery = jest.fn();
jest.mock('react-responsive', () => ({
  useMediaQuery: (q: unknown) => mockUseMediaQuery(q),
}));

// Probe SidebarNavigation so we can check the mobileMax prop without rendering the real component.
jest.mock('../../components/SidebarNavigation', () => (props: any) => (
  <nav data-testid="sidebar-nav" data-mobile={String(props.mobileMax)}>
    {props.title}
  </nav>
));

const links = [
  { label: 'Datasets', url: '/datasets' },
  { label: 'About', url: '/about' },
];

describe('SidebarPage', () => {
  beforeEach(() => mockUseMediaQuery.mockReset());

  it('renders desktop layout classes when the breakpoint does not match', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = renderWithProviders(
      <SidebarPage links={links} menuTitle="Help Topics">
        <p data-testid="body">Main content</p>
      </SidebarPage>,
    );
    expect(container.querySelector('.ds-l-container')).toBeInTheDocument();
    expect(container.querySelector('.ds-l-row')).toBeInTheDocument();
    expect(container.querySelector('.ds-l-col--4')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-nav')).toHaveAttribute('data-mobile', 'false');
    expect(screen.getByTestId('body')).toBeInTheDocument();
  });

  it('switches to mobile layout when the breakpoint matches and respects mobileMaxWidth', () => {
    mockUseMediaQuery.mockReturnValue(true);
    renderWithProviders(
      <SidebarPage links={links} menuTitle="Help Topics" mobileMaxWidth={1024}>
        <p>Body</p>
      </SidebarPage>,
    );
    expect(mockUseMediaQuery).toHaveBeenCalledWith({ query: '(max-width: 1024px)' });
    expect(screen.getByTestId('sidebar-nav')).toHaveAttribute('data-mobile', 'true');
  });
});
