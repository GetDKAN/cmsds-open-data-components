import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTableRowChanger from './index';

describe('<DataTableRowChanger />', () => {
  test('Renders 4 buttons by default', () => {
    render(
      <DataTableRowChanger setTablePadding={(p) => (console.log(p))} />,
    );
    expect(screen.getByText(/Rows per page:/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /10 rows per page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /25 rows per page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /50 rows per page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /100 rows per page/i })).toBeTruthy();
  });

  test('Renders 2 buttons when given an array of 2 rowOptions', () => {
    render(
      <DataTableRowChanger setTablePadding={(p) => (console.log(p))} rowOptions={[5, 8]} />,
    );
    expect(screen.getByText(/Rows per page:/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /5 rows per page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /8 rows per page/i })).toBeTruthy();
  });
});