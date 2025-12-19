import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterItem from './FilterItem';
import { buildOperatorOptions, convertUTCToLocalDate, cleanText } from '../../templates/FilteredResource/functions';
import { FilterItemType, ConditionType, SchemaType, PropertyType } from '../../types/dataset';

jest.mock('react-datepicker', () => {
  return function MockDatePicker({ selected, onChange, showMonthDropdown, showYearDropdown, dropdownMode, withPortal, ...props }: {
    selected?: Date;
    onChange: (date: Date) => void;
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    dropdownMode?: string;
    withPortal?: boolean;
    [key: string]: unknown;
  }) {
    return (
      <input
        data-testid="date-picker"
        value={selected && selected instanceof Date && !isNaN(selected.getTime()) ? selected.toISOString().split('T')[0] : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const date = new Date(e.target.value);
          if (!isNaN(date.getTime())) {
            onChange(date);
          }
        }}
        {...props}
      />
    );
  };
});

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn(() => false)
}));

jest.mock('@cmsgov/design-system', () => ({
  Button: ({ children, onClick, ...props }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Dropdown: ({ options, value, onChange, label, name, ...props }: {
    options?: PropertyType[];
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    name?: string;
    [key: string]: unknown;
  }) => (
    <select
      value={value || ''}
      onChange={onChange}
      aria-label={label}
      data-testid={name}
      {...props}
    >
      {options?.map((option: PropertyType, index: number) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  TextField: ({ value, onChange, label, name, ...props }: {
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name?: string;
    [key: string]: unknown;
  }) => (
    <input
      value={value || ''}
      onChange={onChange}
      aria-label={label}
      data-testid={name}
      {...props}
    />
  )
}));

jest.mock('../../templates/FilteredResource/functions', () => ({
  buildOperatorOptions: jest.fn(),
  convertUTCToLocalDate: jest.fn((date: Date) => date),
  cleanText: jest.fn((text: string, operator: string) => text)
}));

describe('FilterItem', () => {
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();

  const defaultProps: FilterItemType = {
    condition: {
      property: 'test_property',
      operator: '=',
      value: 'test_value',
      key: 'test_key'
    },
    schema: {
      test_id: {
        fields: {
          test_property: {
            mysql_type: 'varchar',
            description: 'Test Property',
            type: 'string'
          },
          date_property: {
            mysql_type: 'date',
            description: 'Date Property',
            type: 'date'
          }
        }
      }
    },
    id: 'test_id',
    index: 0,
    update: mockUpdate,
    remove: mockRemove,
    propertyOptions: [
      { label: 'Test Property', value: 'test_property' },
      { label: 'Date Property', value: 'date_property' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (buildOperatorOptions as jest.Mock).mockReturnValue([
      { label: 'Is', value: '=' },
      { label: 'Is Not', value: '<>' }
    ]);
  });

  it('renders correctly', () => {
    render(<FilterItem {...defaultProps} />);
    
    expect(screen.getByTestId('test_key_property')).toBeInTheDocument();
    expect(screen.getByTestId('test_key_operator')).toBeInTheDocument();
    expect(screen.getByTestId('test_key_value')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete filter/i })).toBeInTheDocument();
  });

  it('should render date picker for date fields', () => {
    const dateProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property',
        value: '2023-01-01'
      }
    };

    render(<FilterItem {...dateProps} />);
    
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.queryByTestId('test_key_value')).not.toBeInTheDocument();
  });

  it('should render text field for non-date fields', () => {
    render(<FilterItem {...defaultProps} />);
    
    expect(screen.getByTestId('test_key_value')).toBeInTheDocument();
    expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customProps: FilterItemType = {
      ...defaultProps,
      className: 'custom-class'
    };

    const { container } = render(<FilterItem {...customProps} />);
    const fieldset = container.querySelector('fieldset');
    
    expect(fieldset).toHaveClass('custom-class');
  });

  it('should handle property dropdown change', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);
    
    const propertyDropdown = screen.getByTestId('test_key_property');
    await user.selectOptions(propertyDropdown, 'date_property');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'property', 'date_property');
  });

  it('should handle operator dropdown change', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);
    
    const operatorDropdown = screen.getByTestId('test_key_operator');
    await user.selectOptions(operatorDropdown, '<>');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'operator', '<>');
  });

  it('should handle text field value change', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);
    
    const textField = screen.getByTestId('test_key_value');
    await user.clear(textField);
    await user.type(textField, 'new value');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'value', 'new value');
  });

  it('should handle date picker change', async () => {
    const user = userEvent.setup();
    const dateProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property',
        value: '2023-01-01'
      }
    };

    render(<FilterItem {...dateProps} />);
    
    const datePicker = screen.getByTestId('date-picker');
    await user.clear(datePicker);
    await user.type(datePicker, '2023-02-01');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'value', expect.any(String));
  });

  it('should handle delete button click', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete filter/i });
    await user.click(deleteButton);
    
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('should update property state when condition property changes', () => {
    const newProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property'
      }
    };

    render(<FilterItem {...newProps} />);
    
    const propertyDropdown = screen.getByTestId('test_key_property');
    expect(propertyDropdown).toHaveValue('date_property');
  });

  it('should update operator state when condition operator changes', () => {
    const newProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        operator: '<>'
      }
    };

    render(<FilterItem {...newProps} />);
    
    const operatorDropdown = screen.getByTestId('test_key_operator');
    expect(operatorDropdown).toHaveValue('<>');
  });

  it('should update value state when condition value changes', () => {
    const newProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        value: 'new_value'
      }
    };

    render(<FilterItem {...newProps} />);
    
    const textField = screen.getByTestId('test_key_value');
    expect(textField).toHaveValue('new_value');
  });

  it('should handle empty value', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);
    
    const textField = screen.getByTestId('test_key_value');
    await user.clear(textField);
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'value', '');
  });

  it('should handle null or undefined values', () => {
    const nullValueProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        value: null as unknown as string
      }
    };
    
    expect(() => {
      render(<FilterItem {...nullValueProps} />);
    }).not.toThrow();
  });

  it('should handle invalid date values', () => {
    const invalidDateProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property',
        value: 'invalid-date'
      }
    };
    
    expect(() => {
      render(<FilterItem {...invalidDateProps} />);
    }).not.toThrow();
  });

  it('should call update with empty string when operator becomes empty', () => {
    render(<FilterItem {...defaultProps} />);
    
    const operatorDropdown = screen.getByTestId('test_key_operator');
    fireEvent.change(operatorDropdown, { target: { value: '' } });
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'operator', '');
  });

  it('should call buildOperatorOptions with correct mysql_type', () => {
    render(<FilterItem {...defaultProps} />);
    
    expect(buildOperatorOptions).toHaveBeenCalledWith('varchar');
  });

  it('should call convertUTCToLocalDate for date fields', () => {
    const dateProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property',
        value: '2023-01-01'
      }
    };

    render(<FilterItem {...dateProps} />);
    
    expect(convertUTCToLocalDate).toHaveBeenCalled();
  });

  it('should call cleanText for text fields', () => {
    render(<FilterItem {...defaultProps} />);
    
    expect(cleanText).toHaveBeenCalledWith('test_value', '=');
  });

  it('should handle empty property in useEffect', () => {
    const schemaWithEmptyProperty: SchemaType = {
      test_id: {
        fields: {
          '': {
            mysql_type: 'varchar',
            description: 'Empty Property',
            type: 'string'
          },
          test_property: {
            mysql_type: 'varchar',
            description: 'Test Property',
            type: 'string'
          },
          date_property: {
            mysql_type: 'date',
            description: 'Date Property',
            type: 'date'
          }
        }
      }
    };

    const propsWithEmptyProperty: FilterItemType = {
      ...defaultProps,
      schema: schemaWithEmptyProperty,
      condition: {
        ...defaultProps.condition,
        property: 'test_property'
      }
    };

    render(<FilterItem {...propsWithEmptyProperty} />);
    
    mockUpdate.mockClear();
    
    const propertyDropdown = screen.getByTestId('test_key_property');
    fireEvent.change(propertyDropdown, { target: { value: '' } });
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'property', '');
  });

  it('should handle date field with empty value', async () => {
    const user = userEvent.setup();
    
    const propsWithDifferentProperty: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'test_property'
      }
    };
    
    render(<FilterItem {...propsWithDifferentProperty} />);
    mockUpdate.mockClear();
    
    const propertyDropdown = screen.getByTestId('test_key_property');
    await user.selectOptions(propertyDropdown, 'date_property');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'property', 'date_property');
  });

  it('should reset value when changing from date type to non-date type', async () => {
    const user = userEvent.setup();
    
    const dateProps: FilterItemType = {
      ...defaultProps,
      condition: {
        ...defaultProps.condition,
        property: 'date_property',
        value: '2023-01-01'
      }
    };
    
    render(<FilterItem {...dateProps} />);
    mockUpdate.mockClear();
    
    const propertyDropdown = screen.getByTestId('test_key_property');
    await user.selectOptions(propertyDropdown, 'test_property');
    
    expect(mockUpdate).toHaveBeenCalledWith(0, 'value', '');
  });
});
