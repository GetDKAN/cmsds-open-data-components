import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import ResourcePreview, { prepareColumns } from './index';
import { makeResource } from '../../tests/fixtures/generic/makeResource';

jest.mock('../Datatable', () => (props) => (
  <div data-testid="data-table">
    <span data-testid="data-table-column-count">{props.columns.length}</span>
    {props.columns.map((c) => (
      <span key={c.accessor} data-testid={`col-${c.accessor}`}>
        {c.header}
      </span>
    ))}
  </div>
));

const actions = {
  columnOrder: [],
  setColumnOrder: jest.fn(),
  columnVisibility: {},
  setColumnVisibility: jest.fn(),
  page: 1,
  setPage: jest.fn(),
  tableDensity: 'normal',
  setTableDensity: jest.fn(),
};

const renderPreview = (contextOverrides = {}, props = {}) =>
  renderWithProviders(<ResourcePreview id="dist-001" {...props} />, {
    dataTableContextValue: {
      id: 'dist-001',
      resource: makeResource(),
      ...contextOverrides,
    },
    dataTableActionsValue: actions,
  });

describe('prepareColumns', () => {
  it('uses schema descriptions when present', () => {
    const result = prepareColumns(
      ['product_name'],
      { fields: { product_name: { description: 'Product name' } } },
    );
    expect(result[0]).toEqual({ header: 'Product name', accessor: 'product_name' });
  });

  it('falls back to the column name when description is missing', () => {
    const result = prepareColumns(['quantity'], { fields: { quantity: { description: '' } } });
    expect(result[0].header).toBe('quantity');
  });
});

describe('ResourcePreview', () => {
  it('renders the data table when columns and schema are present', () => {
    renderPreview();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('data-table-column-count').textContent).toBe('5');
  });

  it('renders a spinner when the resource has no columns', () => {
    renderPreview({
      resource: makeResource({ columns: [] }),
    });
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
    expect(document.querySelector('.ds-c-spinner')).toBeInTheDocument();
  });

  it('applies customColumns when provided in context', () => {
    const customColumns = [{ header: 'Custom', accessor: 'product_name' }];
    renderPreview({ customColumns });
    expect(screen.getByTestId('data-table-column-count').textContent).toBe('1');
    expect(screen.getByTestId('col-product_name').textContent).toBe('Custom');
  });
});
