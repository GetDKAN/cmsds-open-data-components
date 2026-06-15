import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryRow from './index';

// Stub heavy children — they have their own ecosystems and aren't this row's responsibility.
jest.mock('react-datepicker', () => () => <div data-testid="date-picker" />);
jest.mock('react-responsive', () => ({ useMediaQuery: () => false }));

const schema = {
  'dist-001': {
    fields: {
      product_name: { mysql_type: 'text' },
      sale_date: { mysql_type: 'date' },
    },
  },
};

const propertyOptions = [
  { label: 'Product name', value: 'product_name' },
  { label: 'Sale date', value: 'sale_date' },
];

const baseCondition = {
  key: 'cond-1',
  property: 'product_name',
  operator: '=',
  value: 'Alpha',
};

const renderRow = (overrides: Partial<typeof baseCondition> = {}, handlers: any = {}) => {
  const condition = { ...baseCondition, ...overrides };
  const update = handlers.update ?? jest.fn();
  const remove = handlers.remove ?? jest.fn();
  render(
    <QueryRow
      id="dist-001"
      condition={condition as any}
      index={0}
      update={update}
      remove={remove}
      propertyOptions={propertyOptions}
      schema={schema}
    />,
  );
  return { update, remove };
};

describe('QueryRow', () => {
  it('renders a TextField value input for non-date properties', () => {
    renderRow();
    expect(screen.getByLabelText('Value')).toHaveValue('Alpha');
    expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
  });

  it('renders a DatePicker when the selected property is a date field', () => {
    renderRow({ property: 'sale_date', value: '2024-01-15' });
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.queryByLabelText('Value')).not.toBeInTheDocument();
  });

  it('invokes remove(index) when the delete button is clicked', () => {
    const { remove } = renderRow();
    fireEvent.click(screen.getByRole('button', { name: /delete filter/i }));
    expect(remove).toHaveBeenCalledWith(0);
  });
});
