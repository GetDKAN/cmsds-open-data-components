import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTablePageResults from './DataTablePageResults';

describe('DataTablePageResults', () => {
  it('renders "0 - 0 of 0 rows" when totalRows is 0', () => {
    render(<DataTablePageResults totalRows={0} limit={25} offset={0} />);
    expect(screen.getByText('0 - 0 of 0 rows')).toBeInTheDocument();
  });

  it('shows the limit count when on the first page', () => {
    render(<DataTablePageResults totalRows={100} limit={25} offset={0} />);
    expect(screen.getByText(/Displaying/)).toBeInTheDocument();
    expect(screen.getByText('1 - 25')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('computes mid-page range correctly', () => {
    render(<DataTablePageResults totalRows={100} limit={25} offset={50} />);
    expect(screen.getByText('51 - 75')).toBeInTheDocument();
  });

  it('caps the upper bound at totalRows on the last page', () => {
    render(<DataTablePageResults totalRows={100} limit={25} offset={75} />);
    expect(screen.getByText('76 - 100')).toBeInTheDocument();
  });

  it('uses totalRows when limit exceeds totalRows', () => {
    render(<DataTablePageResults totalRows={10} limit={25} offset={0} />);
    expect(screen.getByText('1 - 10')).toBeInTheDocument();
  });

  it('locale-formats thousands separators', () => {
    render(<DataTablePageResults totalRows={5000} limit={1000} offset={0} />);
    expect(screen.getByText('1 - 1,000')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('applies the className prop', () => {
    const { container } = render(
      <DataTablePageResults totalRows={0} limit={25} offset={0} className="custom-class" />,
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
