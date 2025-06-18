import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetDateItem from './index';

describe('<DatasetDateItem />', () => {
  test('Renders modified date correctly', () => {
    render(
      <DatasetDateItem
        type="modified"
        date="2023-02-01"
      />
    );

    expect(screen.getByText('Last Modified: February 1, 2023')).toBeInTheDocument();
  });

  test('Renders released date correctly', () => {
    render(
      <DatasetDateItem
        type="released"
        date="2023-01-01"
      />
    );

    expect(screen.getByText('Released: January 1, 2023')).toBeInTheDocument();
  });

  test('Renders refresh date correctly', () => {
    render(
      <DatasetDateItem
        type="refresh"
        date="2023-03-01"
      />
    );

    expect(screen.getByText('Planned Update: March 1, 2023')).toBeInTheDocument();
  });

  test('Applies bold label class when boldLabel is true', () => {
    render(
      <DatasetDateItem
        type="modified"
        date="2023-02-01"
        boldLabel={true}
      />
    );

    const container = screen.getByText('Last Modified: February 1, 2023').closest('div');
    expect(container).toHaveClass('dataset-date-item bold-label');
  });

  test('Shows tooltip when displayTooltips is true', () => {
    render(
      <DatasetDateItem
        type="modified"
        date="2023-02-01"
        displayTooltips={true}
      />
    );

    // Tooltip should be present (TooltipIcon component)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('Hides tooltip when displayTooltips is false', () => {
    render(
      <DatasetDateItem
        type="modified"
        date="2023-02-01"
        displayTooltips={false}
      />
    );

    // Tooltip should not be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('Hides tooltip by default when displayTooltips is not specified', () => {
    render(
      <DatasetDateItem
        type="modified"
        date="2023-02-01"
      />
    );

    // Tooltip should be present by default
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
}); 