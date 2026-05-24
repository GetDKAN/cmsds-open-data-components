import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataDictionaryTable from './index';

const tableColumns = [
  { header: 'Name', accessorKey: 'titleResizable', id: 'titleResizable', size: 200 },
  { header: 'Type', accessorKey: 'type', id: 'type', size: 100 },
  { header: 'Description', accessorKey: 'description', id: 'description', size: 200 },
];

const tableData = [
  { titleResizable: 'product_name', type: 'string', description: 'Product name' },
  { titleResizable: 'quantity', type: 'integer', description: 'Units sold' },
  { titleResizable: 'sale_date', type: 'date', description: 'Sale date' },
];

describe('DataDictionaryTable', () => {
  it('renders each row from tableData', () => {
    render(<DataDictionaryTable tableColumns={tableColumns} tableData={tableData} pageSize={10} />);
    expect(screen.getByText('product_name')).toBeInTheDocument();
    expect(screen.getByText('quantity')).toBeInTheDocument();
    expect(screen.getByText('sale_date')).toBeInTheDocument();
  });

  it('renders the column headers', () => {
    render(<DataDictionaryTable tableColumns={tableColumns} tableData={tableData} pageSize={10} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('paginates when data exceeds pageSize', () => {
    const manyRows = Array.from({ length: 15 }, (_, i) => ({
      titleResizable: `field_${i}`,
      type: 'string',
      description: `desc ${i}`,
    }));
    render(<DataDictionaryTable tableColumns={tableColumns} tableData={manyRows} pageSize={5} />);
    // First-page rows visible
    expect(screen.getByText('field_0')).toBeInTheDocument();
    expect(screen.getByText('field_4')).toBeInTheDocument();
    // Row beyond first page is paginated out
    expect(screen.queryByText('field_10')).not.toBeInTheDocument();
  });
});
