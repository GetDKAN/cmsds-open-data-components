/**
 * @jest-environment jsdom
 */

import React from 'react';
// import { act } from 'react-dom/test-utils';
import { act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResourceFilter from './index';

const columns = ['column_1', 'column_2', 'column_3'];
const sampleDefaultCondition = { operator: '', property: '', value: '' };
const sampleSchema = {
  '1234-abcd': {
    fields: {
      column_1: { description: '', type: 'text' },
      column_2: { description: '', type: 'text' },
      column_3: { description: '', type: 'text' },
    },
  },
};
const sampleResource = {
  columns: columns,
  conditions: [],
  properties: undefined,
  schema: sampleSchema,
  setConditions: () => ({}),
};
const sampleResource2 = {
  columns: columns,
  conditions: [{ operator: 'like', property: 'column_2', value: 'dkan' }],
  properties: undefined,
  schema: sampleSchema,
  setConditions: () => ({}),
};

const BasicFilter = (
  <ResourceFilter
    id={'1234-abcd'}
    filterOpen={true}
    setFilterOpen={() => !filterOpen}
    defaultCondition={sampleDefaultCondition}
    resource={sampleResource}
    includeSearchParams={true}
  />
);

const PreFilledFilter = (
  <ResourceFilter
    id={'1234-abcd'}
    filterOpen={true}
    setFilterOpen={() => !filterOpen}
    defaultCondition={sampleDefaultCondition}
    resource={sampleResource2}
    includeSearchParams={true}
  />
);

const WrapperComponent = () => {
  const [conditions, setConditions] = React.useState([]);
  return (
    <ResourceFilter
      id={'1234-abcd'}
      filterOpen={true}
      setFilterOpen={() => !filterOpen}
      defaultCondition={sampleDefaultCondition}
      resource={{
        columns: columns,
        conditions: conditions,
        properties: undefined,
        schema: sampleSchema,
        setConditions: setConditions,
      }}
      includeSearchParams={true}
    />
  );
};

describe('Resource Filter Functions', () => {
  test('renders with header and close button', async () => {
    render(BasicFilter);
    expect(screen.getByRole('heading', { level: 3, name: 'Add filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close help drawer' })).toBeInTheDocument();
  });
  test('renders with footer', async () => {
    render(BasicFilter);
    expect(screen.getByRole('heading', { level: 4, name: 'Update actions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update table' })).toBeInTheDocument();
  });
  test('does not render Remove all filters button with less than 2 filters', async () => {
    render(BasicFilter);
    expect(screen.queryByRole('button', { name: 'Remove all filters' })).not.toBeInTheDocument();
  });
  test('renders an empty field on clean start', async () => {
    render(BasicFilter);
    expect(screen.getByLabelText('Filter column')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter operator')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select column')).toBeInTheDocument();
    expect(screen.getByDisplayValue('--')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove filter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add another filter' })).toBeInTheDocument();
  });
  test('test basic filter', async () => {
    render(BasicFilter);
    expect(screen.getByDisplayValue('Select column')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select column' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'column_1' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: '--' }).selected).toBe(true);
    expect(screen.getByLabelText('Filter value')).toBeDisabled();
    await act(async () => {
      userEvent.selectOptions(screen.getByRole('combobox', { name: 'Filter column' }), [
        'column_1',
      ]);
    });
    expect(screen.getByRole('option', { name: 'Select column' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'column_1' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Is' }).selected).toBe(true);
    expect(screen.getByLabelText('Filter value')).not.toBeDisabled();
    await act(async () => {
      userEvent.selectOptions(screen.getByRole('combobox', { name: 'Filter column' }), [
        'Select column',
      ]);
    });
    expect(screen.getByRole('option', { name: 'Select column' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'column_1' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: '--' }).selected).toBe(true);
    expect(screen.getByLabelText('Filter value')).toBeDisabled();
  });
  test('opens pre-filled', async () => {
    render(PreFilledFilter);
    expect(screen.getByDisplayValue('column_2')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'column_2' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Contains' }).selected).toBe(true);
    expect(screen.getByLabelText('Filter value')).not.toBeDisabled();
    expect(screen.getByDisplayValue('dkan')).toBeInTheDocument();
  });
  test('remove all works', async () => {
    render(PreFilledFilter);
    expect(screen.getByRole('option', { name: 'column_2' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Contains' }).selected).toBe(true);
    expect(screen.getByDisplayValue('dkan')).toBeInTheDocument();
    expect(screen.queryAllByLabelText('Filter value').length).toBe(1);
    expect(screen.getByRole('button', { name: '+ Add another filter' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove all filters' })).not.toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: '+ Add another filter' }));
    });
    expect(screen.queryAllByLabelText('Filter value').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Remove all filters' })).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'Remove all filters' }));
    });
    expect(screen.queryAllByLabelText('Filter value').length).toBe(0);
  });

  test('url updates correctly', async () => {
    render(<WrapperComponent />);
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Filter column' }), ['column_1']);
    await userEvent.type(screen.getByLabelText('Filter value'), 'dkan', { delay: 1 });
    await act(async () => {});
    userEvent.click(screen.getByRole('button', { name: 'Update table' }, {}));
    await act(async () => {});
    expect(window.location.search).toBe(
      '?conditions[0][operator]=%3D&conditions[0][property]=column_1&conditions[0][value]=dkan'
    );
  });
});
