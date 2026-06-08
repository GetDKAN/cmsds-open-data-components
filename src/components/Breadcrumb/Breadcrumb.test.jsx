import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import Breadcrumb from './index';

const pageTrail = [
  { path: '/datasets', title: 'Datasets' },
  { path: '/datasets/sales', title: 'Sales' },
];

describe('Breadcrumb', () => {
  it('renders each pageTrail item as a link and the currentPage as aria-current', () => {
    renderWithProviders(<Breadcrumb currentPage="Quarterly Sales" pageTrail={pageTrail} />);
    expect(screen.getByRole('link', { name: 'Datasets' })).toHaveAttribute('href', '/datasets');
    expect(screen.getByRole('link', { name: 'Sales' })).toHaveAttribute('href', '/datasets/sales');
    const current = screen.getByText('Quarterly Sales');
    expect(current.closest('[aria-current="page"]')).not.toBeNull();
  });

  it('omits the current-page list item when currentPage is empty', () => {
    const { container } = renderWithProviders(
      <Breadcrumb currentPage="" pageTrail={pageTrail} />,
    );
    expect(container.querySelector('[aria-current="page"]')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
