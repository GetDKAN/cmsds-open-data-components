import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTableDensity from './index';

describe('<DataTableRowDetails />', () => {
  test('Renders 3 buttons', () => {
    render(
      <DataTableDensity setTablePadding={(p) => (console.log(p))} />,
    );
    expect(screen.getByRole('button', { name: /Table padding Tight/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Table padding Normal/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Table padding Expanded/i })).toBeTruthy();
  });
});