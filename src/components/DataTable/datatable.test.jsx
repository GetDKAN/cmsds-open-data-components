import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ResourceDispatch } from '@civicactions/data-catalog-services';
import { axe, toHaveNoViolations } from 'jest-axe';
import DataTable from './index';

expect.extend(toHaveNoViolations);

describe('<DataTable />', () => {
  test('Renders a data table', () => {
    render(
      <ResourceDispatch.Provider value={{
        loading: false,
        items: [{column_1: 'fizz'},],
        columns: [{Header: 'column_1', accessor: 'column_1'}],
        totalRows: 1,
        limit: 20,
        currentPage: 0,
        actions: {
          setOffset: () => {},
          setCurrentPage: () => {},
          setConditions: () => {},
          setSort: () => {},
        }
      }}>
        <DataTable />
      </ResourceDispatch.Provider>
    )
    expect(screen.getByText('Filter Columns')).toBeInTheDocument();
  });
});
