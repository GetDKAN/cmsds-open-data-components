import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTableRowChanger from './index';

describe('<DataTableRowChanger />', () => {
  test('Renders 4 buttons by default', () => {
    render(<DataTableRowChanger setTablePadding={(p) => console.log(p)} setLimit={() => {return;}} />);
    expect(screen.getByText(/Rows per page:/i)).toBeTruthy();
  });

  test('Renders 2 buttons when given an array of 2 rowOptions', () => {
    render(<DataTableRowChanger setTablePadding={(p) => console.log(p)} rowOptions={[5, 8]} setLimit={() => {return;}} />);
    expect(screen.getByText(/Rows per page:/i)).toBeTruthy();
  });
});
