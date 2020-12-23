import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTableRowDetails from './index';


describe('<DataTableRowDetails />', () => {
  test('Renders a default string with offset and currentPage at 0', () => {
    render(
      <DataTableRowDetails
        totalRows={100}
        limit={25}
        offset={0}
        currentPage={0}
      />,
    );
    expect(screen.getByText('1 - 25 of 100 rows')).toBeTruthy();
  });

  test('Renders a default string with offset and currentPage at 0', () => {
    render(
      <DataTableRowDetails
        totalRows={100}
        limit={10}
        offset={50}
        currentPage={5}
      />,
    );
    expect(screen.getByText('51 - 60 of 100 rows')).toBeTruthy();
  });
});
