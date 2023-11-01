import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTableDensity from './index';

describe('<DataTableRowDetails />', () => {
  test('Renders 3 options', () => {
    render(<DataTableDensity setTablePadding={(p) => console.log(p)} />);
    expect(screen.getByText('Tight')).toBeTruthy();
    expect(screen.getAllByText('Normal')).toBeTruthy();
    expect(screen.getByText('Expanded')).toBeTruthy();
  });
});
