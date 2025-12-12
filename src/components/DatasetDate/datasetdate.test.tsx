import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetDate from './index';

describe('<DatasetDate />', () => {
  test('Renders single modified date correctly', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01'
        }}
      />
    );

    expect(screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023')).toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  test('Renders modified and released dates with bullet separator', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01'
        }}
      />
    );

    expect(screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.textContent === 'Released: January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
  });

  test('Renders all three dates with bullet separators', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01',
          refresh: '2023-03-01'
        }}
      />
    );

    expect(screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.textContent === 'Released: January 1, 2023')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.textContent === 'Planned Update: March 1, 2023')).toBeInTheDocument();
    
    // Should have two bullet separators
    const bullets = screen.getAllByText('•');
    expect(bullets).toHaveLength(2);
  });

  test('Applies bold labels when specified', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01'
        }}
        modifiedBoldLabel={true}
        releasedBoldLabel={true}
      />
    );

    const modifiedContainer = screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023').closest('div');
    const releasedContainer = screen.getByText((content, element) => element?.textContent === 'Released: January 1, 2023').closest('div');
    
    expect(modifiedContainer).toHaveClass('dataset-date-item bold-label');
    expect(releasedContainer).toHaveClass('dataset-date-item bold-label');
  });

  test('Disables tooltips when displayTooltips is false', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01'
        }}
        displayTooltips={false}
      />
    );

    // Tooltips should not be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('Shows tooltips by default', () => {
    render(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01'
        }}
      />
    );

    // Tooltips should be present by default
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('Renders nothing when no dates are provided', () => {
    render(
      <DatasetDate
        date={{}}
      />
    );

    expect(screen.queryByText('Last Modified:')).not.toBeInTheDocument();
    expect(screen.queryByText('Released:')).not.toBeInTheDocument();
    expect(screen.queryByText('Planned Update:')).not.toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });
}); 