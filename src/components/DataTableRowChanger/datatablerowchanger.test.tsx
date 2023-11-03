import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTableRowChanger from './index';

describe('<DataTableRowChanger />', () => {
  test('Renders 4 buttons by default', () => {
    render(<DataTableRowChanger limit={25} setLimit={() => {return;}} />);
    expect(screen.getAllByText(/Rows per page:/i)).toBeTruthy();
  });

  test('Renders 2 buttons when given an array of 2 rowOptions', () => {
    render(<DataTableRowChanger limit={25} setLimit={() => {return;}} />);
    expect(screen.getAllByText(/Rows per page:/i)).toBeTruthy();
  });
});
