import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTableToolbar from './index';
import { ResourceType, ColumnType } from '../../types/dataset';
import { FilterChipProps } from '../FilterChip';
import { FullScreenDataTableProps } from '../FullScreenDataTable';
import { DataTablePageResultsType } from '../DataTablePageResults/DataTablePageResults';

interface ManageColumnsProps {
  id: string;
  columns: ColumnType[];
  defaultColumnOrder: string[];
}

jest.mock('../DataTablePageResults', () => {
  return function MockDataTablePageResults({ totalRows, limit, offset, className }: DataTablePageResultsType) {
    return (
      <div data-testid="data-table-page-results" className={className}>
        Showing {offset + 1}-{Math.min(offset + limit, totalRows)} of {totalRows} results
      </div>
    );
  };
});

jest.mock('../ManageColumns/ManageColumns', () => {
  return function MockManageColumns({ id, columns, defaultColumnOrder }: ManageColumnsProps) {
    return (
      <div data-testid="manage-columns">
        Manage Columns - ID: {id}, Columns: {columns.length}
      </div>
    );
  };
});

jest.mock('../FullScreenDataTable', () => {
  return function MockFullScreenDataTable({ isModal }: FullScreenDataTableProps) {
    return (
      <button data-testid="full-screen-button" onClick={() => jest.fn()}>
        Full Screen - Modal: {isModal.toString()}
      </button>
    );
  };
});

jest.mock('../FilterDataset', () => {
  return function MockFilterDataset() {
    return <div data-testid="filter-dataset">Filter Dataset</div>;
  };
});

jest.mock('../DisplaySettings', () => {
  return function MockDisplaySettings() {
    return <div data-testid="display-settings">Display Settings</div>;
  };
});

jest.mock('../FilterChip', () => {
  return function MockFilterChip({ iconClass, text, onClick }: FilterChipProps) {
    return (
      <button data-testid="filter-chip" onClick={onClick}>
        {iconClass} - {text}
      </button>
    );
  };
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('DataTableToolbar', () => {
  const defaultProps = {
    resource: {
      columns: ['col1', 'col2', 'col3'],
      count: 100,
      totalRows: 100,
      totalColumns: 3,
      limit: 10,
      offset: 0,
      loading: false,
      conditions: [],
      schema: {},
      values: [],
      setLimit: jest.fn(),
      setOffset: jest.fn(),
      setSort: jest.fn(),
      setConditions: jest.fn(),
      setResource: jest.fn()
    } as ResourceType,
    id: 'test-dataset',
    columns: [
      { header: 'Column 1', accessor: 'col1' } as ColumnType,
      { header: 'Column 2', accessor: 'col2' } as ColumnType,
      { header: 'Column 3', accessor: 'col3' } as ColumnType
    ],
    defaultColumnOrder: ['col1', 'col2', 'col3'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      col1: true,
      col2: true,
      col3: true
    },
    setColumnVisibility: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('{"tableColumnVisibility": {"col1": true, "col2": true, "col3": true}}');
  });

  it('renders correctly', () => {
    render(<DataTableToolbar {...defaultProps} />);
    expect(screen.getByTestId('filter-dataset')).toBeInTheDocument();
    expect(screen.getByTestId('manage-columns')).toBeInTheDocument();
    expect(screen.getByTestId('display-settings')).toBeInTheDocument();
    expect(screen.getByTestId('full-screen-button')).toBeInTheDocument();
    expect(screen.getByTestId('data-table-page-results')).toBeInTheDocument();
  });

  it('does not render page results when loading', () => {
    const loadingProps = {
      ...defaultProps,
      resource: { ...defaultProps.resource, loading: true }
    };
    render(<DataTableToolbar {...loadingProps} />);
    expect(screen.queryByTestId('data-table-page-results')).not.toBeInTheDocument();
  });

  it('does not render page results when count is null', () => {
    const nullCountProps = {
      ...defaultProps,
      resource: { ...defaultProps.resource, count: null }
    };
    render(<DataTableToolbar {...nullCountProps} />);
    expect(screen.queryByTestId('data-table-page-results')).not.toBeInTheDocument();
  });

  it('renders table controls when datasetTableControls is true', () => {
    render(<DataTableToolbar {...defaultProps} />);
    expect(screen.getByTestId('filter-dataset')).toBeInTheDocument();
    expect(screen.getByTestId('manage-columns')).toBeInTheDocument();
    expect(screen.getByTestId('display-settings')).toBeInTheDocument();
    expect(screen.getByTestId('full-screen-button')).toBeInTheDocument();
  });

  it('does not render table controls when datasetTableControls is false', () => {
    const noControlsProps = {
      ...defaultProps,
      datasetTableControls: false
    };
    render(<DataTableToolbar {...noControlsProps} />);
    expect(screen.queryByTestId('filter-dataset')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-columns')).not.toBeInTheDocument();
    expect(screen.queryByTestId('display-settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('full-screen-button')).not.toBeInTheDocument();
  });

  it('renders filter chips when conditions exist', () => {
    const conditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [
          { property: 'name', operator: '=', value: 'test' },
          { property: 'age', operator: '>', value: '18' }
        ]
      }
    };
    render(<DataTableToolbar {...conditionsProps} />);
    
    const filterChips = screen.getAllByTestId('filter-chip');
    expect(filterChips).toHaveLength(2);
    expect(filterChips[0]).toHaveTextContent('far fa-filter - "name" = test');
    expect(filterChips[1]).toHaveTextContent('far fa-filter - "age" > 18');
  });

  it('renders hidden columns chip when columns are hidden', () => {
    const hiddenColumnsProps = {
      ...defaultProps,
      columnVisibility: {
        col1: true,
        col2: false,
        col3: false
      }
    };
    render(<DataTableToolbar {...hiddenColumnsProps} />);
    
    const filterChips = screen.getAllByTestId('filter-chip');
    expect(filterChips).toHaveLength(1);
    expect(filterChips[0]).toHaveTextContent('fa fa-columns - 2 Columns Hidden');
  });

  it('renders singular "Column Hidden" when only one column is hidden', () => {
    const oneHiddenColumnProps = {
      ...defaultProps,
      columnVisibility: {
        col1: true,
        col2: false,
        col3: true
      }
    };
    render(<DataTableToolbar {...oneHiddenColumnProps} />);
    
    const filterChips = screen.getAllByTestId('filter-chip');
    expect(filterChips).toHaveLength(1);
    expect(filterChips[0]).toHaveTextContent('fa fa-columns - 1 Column Hidden');
  });

  it('does not render filter chips section when no conditions and no hidden columns', () => {
    render(<DataTableToolbar {...defaultProps} />);
    expect(screen.queryByText('Selected filters')).not.toBeInTheDocument();
  });

  it('renders "Clear all filters" button when filters are active', () => {
    const conditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [{ property: 'name', operator: '=', value: 'test' }]
      }
    };
    render(<DataTableToolbar {...conditionsProps} />);
    
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('calls clear all filters when "Clear all filters" button is clicked', () => {
    const mockPushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

    const conditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [{ property: 'name', operator: '=', value: 'test' }]
      },
      columnVisibility: {
        col1: true,
        col2: false,
        col3: true
      }
    };
    render(<DataTableToolbar {...conditionsProps} />);
    
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    
    expect(conditionsProps.resource.setConditions).toHaveBeenCalledWith([]);
    expect(mockPushStateSpy).toHaveBeenCalled();
    expect(conditionsProps.setColumnVisibility).toHaveBeenCalledWith({
      col1: true,
      col2: true,
      col3: true
    });
  });

  it('handles localStorage when no existing data', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const hiddenColumnsProps = {
      ...defaultProps,
      columnVisibility: {
        col1: true,
        col2: false,
        col3: false
      }
    };
    render(<DataTableToolbar {...hiddenColumnsProps} />);
    
    const filterChip = screen.getByTestId('filter-chip');
    fireEvent.click(filterChip);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-dataset',
      JSON.stringify({
        tableColumnVisibility: {
          col1: true,
          col2: true,
          col3: true
        }
      })
    );
  });

  it('updates browser URL when removing condition', () => {
    const mockPushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

    const conditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [{ property: 'name', operator: '=', value: 'test' }]
      }
    };
    render(<DataTableToolbar {...conditionsProps} />);
    
    const filterChip = screen.getByTestId('filter-chip');
    fireEvent.click(filterChip);
    
    expect(mockPushStateSpy).toHaveBeenCalledWith({}, '', 'http://localhost/');
  });

  it('updates browser URL when clearing all filters', () => {
    const mockPushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

    const conditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [{ property: 'name', operator: '=', value: 'test' }]
      }
    };
    render(<DataTableToolbar {...conditionsProps} />);
    
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    
    expect(mockPushStateSpy).toHaveBeenCalledWith({}, '', 'http://localhost/');
  });

  it('handles empty conditions array', () => {
    const emptyConditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: []
      }
    };
    render(<DataTableToolbar {...emptyConditionsProps} />);
    expect(screen.queryByText('Selected filters')).not.toBeInTheDocument();
  });

  it('handles null count gracefully', () => {
    const nullCountProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        count: null
      }
    };
    render(<DataTableToolbar {...nullCountProps} />);
    expect(screen.queryByTestId('data-table-page-results')).not.toBeInTheDocument();
  });

  it('handles zero count', () => {
    const zeroCountProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        count: 0
      }
    };
    render(<DataTableToolbar {...zeroCountProps} />);
    expect(screen.getByTestId('data-table-page-results')).toBeInTheDocument();
  });

  it('handles all columns hidden', () => {
    const allHiddenProps = {
      ...defaultProps,
      columnVisibility: {
        col1: false,
        col2: false,
        col3: false
      }
    };
    render(<DataTableToolbar {...allHiddenProps} />);
    
    const filterChips = screen.getAllByTestId('filter-chip');
    expect(filterChips).toHaveLength(1);
    expect(filterChips[0]).toHaveTextContent('fa fa-columns - 3 Columns Hidden');
  });

  it('handles complex condition objects', () => {
    const complexConditionsProps = {
      ...defaultProps,
      resource: {
        ...defaultProps.resource,
        conditions: [
          { property: 'complex_field', operator: 'IN', value: ['value1', 'value2'] },
          { property: 'date_field', operator: '>=', value: '2023-01-01' }
        ]
      }
    };
    render(<DataTableToolbar {...complexConditionsProps} />);
    
    const filterChips = screen.getAllByTestId('filter-chip');
    expect(filterChips).toHaveLength(2);
    expect(filterChips[0]).toHaveTextContent('far fa-filter - "complex_field" IN value1,value2');
    expect(filterChips[1]).toHaveTextContent('far fa-filter - "date_field" >= 2023-01-01');
  });

  it('passes correct props to child components', () => {
    render(<DataTableToolbar {...defaultProps} />);
    
    const manageColumns = screen.getByTestId('manage-columns');
    expect(manageColumns).toHaveTextContent('Manage Columns - ID: test-dataset, Columns: 3');
    
    const fullScreenButton = screen.getByTestId('full-screen-button');
    expect(fullScreenButton).toHaveTextContent('Full Screen - Modal: false');
  });

  it('handles modal state correctly', () => {
    const modalProps = {
      ...defaultProps,
      isModal: true
    };
    render(<DataTableToolbar {...modalProps} />);
    
    const fullScreenButton = screen.getByTestId('full-screen-button');
    expect(fullScreenButton).toHaveTextContent('Full Screen - Modal: true');
  });
});
