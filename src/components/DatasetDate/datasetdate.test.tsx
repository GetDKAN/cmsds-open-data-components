import React from 'react';
import { act, render, screen } from '@testing-library/react';
import DatasetDate from './index';

// The CMSDS Tooltip used by DatasetDateItem runs an async positioning effect on mount,
// so plain `render` triggers act warnings. Route renders through this helper.
const renderDate = async (ui: React.ReactElement) => {
  await act(async () => {
    render(ui);
  });
};

describe('<DatasetDate />', () => {
  test('Renders single modified date correctly', async () => {
    await renderDate(
      <DatasetDate
        date={{
          modified: '2023-02-01'
        }}
      />
    );

    expect(screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023')).toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  test('Renders modified and released dates with bullet separator', async () => {
    await renderDate(
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

  test('Renders all three dates with bullet separators', async () => {
    await renderDate(
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

  test('Applies bold labels when specified', async () => {
    await renderDate(
      <DatasetDate
        date={{
          modified: '2023-02-01',
          released: '2023-01-01'
        }}
        modifiedBoldLabel={true}
        releasedBoldLabel={true}
      />
    );

    const modifiedContainer = screen.getByText((content, element) => element?.textContent === 'Last Modified: February 1, 2023').closest('span');
    const releasedContainer = screen.getByText((content, element) => element?.textContent === 'Released: January 1, 2023').closest('span');

    expect(modifiedContainer).toHaveClass('dataset-date-item-label ds-u-font-weight--bold');
    expect(releasedContainer).toHaveClass('dataset-date-item-label ds-u-font-weight--bold');
  });

  test('Disables tooltips when displayTooltips is false', async () => {
    await renderDate(
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

  test('Shows tooltips by default', async () => {
    await renderDate(
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

  test('Renders nothing when no dates are provided', async () => {
    await renderDate(
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
