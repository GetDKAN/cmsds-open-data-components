import React from 'react';
import { render, screen } from '@testing-library/react';
import SitewideDataDictionaryTable from './index';

// Mock the child table — assertions target the column defs this wrapper builds.
jest.mock('../DataDictionary/DataDictionaryTable', () => (props: any) => (
  <div data-testid="data-dictionary-table">
    <span data-testid="page-size">{props.pageSize}</span>
    <span data-testid="row-count">{props.tableData.length}</span>
    {props.tableColumns.map((col: any) => (
      <span key={col.accessorKey} data-testid={`col-${col.accessorKey}`}>
        {String(col.header)}
      </span>
    ))}
  </div>
));

const dictionary = [
  { name: 'product_name', title: 'Product Name', type: 'string', format: 'default' },
  { name: 'quantity', title: 'Quantity', type: 'integer', format: 'default' },
];

describe('SitewideDataDictionaryTable', () => {
  it('builds the four expected accessor columns and forwards data + pageSize', () => {
    render(<SitewideDataDictionaryTable datasetDictionary={dictionary} pageSize={5} />);
    expect(screen.getByTestId('data-dictionary-table')).toBeInTheDocument();
    expect(screen.getByTestId('page-size')).toHaveTextContent('5');
    expect(screen.getByTestId('row-count')).toHaveTextContent('2');
    expect(screen.getByTestId('col-name')).toHaveTextContent('Name');
    expect(screen.getByTestId('col-title')).toHaveTextContent('Title');
    expect(screen.getByTestId('col-type')).toHaveTextContent('Type');
    expect(screen.getByTestId('col-format')).toHaveTextContent('Format');
  });
});
