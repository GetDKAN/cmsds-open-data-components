import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QueryRow from './QueryRow';

const schema = {
  'dist-001': {
    fields: {
      product_name: { mysql_type: 'text', description: 'Product name', type: 'string' },
      sale_date: { mysql_type: 'date', description: 'Sale date', type: 'date' },
    },
  },
};

const propertyOptions = [
  { label: 'Product name', value: 'product_name' },
  { label: 'Sale date', value: 'sale_date' },
];

const buildProps = (overrides = {}) => ({
  id: 'dist-001',
  condition: {
    key: 'row-0',
    operator: '=',
    property: 'product_name',
    value: 'widget',
  },
  index: 0,
  update: jest.fn(),
  remove: jest.fn(),
  propertyOptions,
  schema,
  ...overrides,
});

describe('QueryRow', () => {
  it('renders a TextField value input for non-date properties', () => {
    render(<QueryRow {...buildProps()} />);
    expect(screen.getByLabelText('Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Value').tagName).toBe('INPUT');
  });

  it('renders a date input section for date properties', () => {
    const { container } = render(
      <QueryRow
        {...buildProps({
          condition: { key: 'row-0', operator: '=', property: 'sale_date', value: '2025-01-15' },
        })}
      />,
    );
    expect(container.querySelector('input[name="row-0_date_value"]')).toBeInTheDocument();
  });

  it('renders the property and operator dropdowns with current values', () => {
    const { container } = render(<QueryRow {...buildProps()} />);
    const propertyDropdown = container.querySelector('select[name="row-0_property"]');
    const operatorDropdown = container.querySelector('select[name="row-0_operator"]');
    expect(propertyDropdown.value).toBe('product_name');
    expect(operatorDropdown.value).toBe('=');
  });

  it('calls remove with the row index when Delete filter is clicked', async () => {
    const user = userEvent.setup();
    const props = buildProps();
    render(<QueryRow {...props} />);
    await user.click(screen.getByRole('button', { name: /delete filter/i }));
    expect(props.remove).toHaveBeenCalledWith(0);
  });

  it('calls update with the new operator when the operator dropdown changes', async () => {
    const user = userEvent.setup();
    const props = buildProps();
    const { container } = render(<QueryRow {...props} />);
    const operatorDropdown = container.querySelector('select[name="row-0_operator"]');
    await user.selectOptions(operatorDropdown, 'starts with');
    expect(props.update).toHaveBeenCalledWith(0, 'operator', 'starts with');
  });
});
