import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisplaySettings from './index';
import { ResourceType } from '../../types/dataset';
import DataTableContext, { DataTableContextType } from '../../templates/Dataset/DataTableContext';
import { DataTableActionsContextProps, MockDataTableActionsProvider } from '../DatasetTableTab/DataTableActionsContext';

// Define proper types for mock components
interface TooltipProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  ariaLabel?: string;
  [key: string]: any;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number;
  defaultValue?: string | number;
  [key: string]: any;
}

// Mock the @cmsgov/design-system components
jest.mock('@cmsgov/design-system', () => ({
  Tooltip: ({ children, title, maxWidth, activeClassName, dialog, offset, placement, ...props }: TooltipProps) => (
    <div data-testid="tooltip" {...props}>
      <button data-testid="tooltip-trigger">Display Settings</button>
      <div data-testid="tooltip-content" className="tooltip-content">
        {title}
      </div>
      {children}
    </div>
  ),
  Dropdown: ({ options, onChange, value, defaultValue, size, label, labelClassName, name, ...props }: DropdownProps) => {
    const selectValue = value || defaultValue || '';
    return (
      <select 
        data-testid="dropdown" 
        onChange={onChange} 
        value={selectValue}
        {...props}
      >
        {options.map((option: DropdownOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
}));

describe('DisplaySettings', () => {
  const mockResource: ResourceType = {
    columns: ['col1', 'col2', 'col3'],
    count: 100,
    totalRows: 100,
    totalColumns: 3,
    limit: 25,
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
  };

  const mockDataTableActions: DataTableActionsContextProps = {
    columnOrder: ['col1', 'col2', 'col3'],
    setColumnOrder: jest.fn(),
    columnVisibility: { col1: true, col2: true, col3: true },
    setColumnVisibility: jest.fn(),
    page: 1,
    setPage: jest.fn(),
    tableDensity: 'normal',
    setTableDensity: jest.fn()
  };

  const defaultDataTableContextType: DataTableContextType = {
    id: 'test-dataset',
    resource: mockResource,
    distribution: undefined,
    rootUrl: 'http://localhost:3000',
    customColumns: undefined,
    dataDictionaryBanner: false,
    datasetTableControls: true
  };

  const renderWithProviders = (
    DataTableContextType: DataTableContextType = defaultDataTableContextType,
    dataTableActionsValue: DataTableActionsContextProps = mockDataTableActions
  ) => {
    return render(
      <DataTableContext.Provider value={DataTableContextType}>
        <MockDataTableActionsProvider value={dataTableActionsValue}>
          <DisplaySettings />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('renders the tooltip trigger button', () => {
      renderWithProviders();
      expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-trigger')).toHaveTextContent('Display Settings');
    });

    it('renders the tooltip content with display settings', () => {
      renderWithProviders();
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('renders the sliders icon', () => {
      renderWithProviders();
      const slidersIcon = screen.getByTestId('tooltip').querySelector('.far.fa-sliders-h');
      expect(slidersIcon).toBeInTheDocument();
    });

    it('renders the chevron icons', () => {
      renderWithProviders();
      const chevronDown = screen.getByTestId('tooltip').querySelector('.fa.fa-chevron-down');
      const chevronUp = screen.getByTestId('tooltip').querySelector('.fa.fa-chevron-up');
      expect(chevronDown).toBeInTheDocument();
      expect(chevronUp).toBeInTheDocument();
    });

    it('renders the display settings text on large screens', () => {
      renderWithProviders();
      const displayText = screen.getByTestId('tooltip').querySelector('.dkan-dataset-toolbar-button-label');
      expect(displayText).toHaveTextContent('Display Settings');
    });
  });

  describe('Row Height Settings', () => {
    it('renders row height section', () => {
      renderWithProviders();
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent.querySelector('.dkan-data-table-display-settings-row')).toBeInTheDocument();
      expect(tooltipContent).toHaveTextContent('Row height');
    });

    it('renders three density buttons', () => {
      renderWithProviders();
      const densityButtons = screen.getByTestId('tooltip-content').querySelectorAll('.dkan-table-density-button');
      expect(densityButtons).toHaveLength(3);
    });

    it('renders expanded density button with correct aria-label', () => {
      renderWithProviders();
      const expandedButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]');
      expect(expandedButton).toBeInTheDocument();
    });

    it('renders normal density button with correct aria-label', () => {
      renderWithProviders();
      const normalButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]');
      expect(normalButton).toBeInTheDocument();
    });

    it('renders compact density button with correct aria-label', () => {
      renderWithProviders();
      const compactButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Compact"]');
      expect(compactButton).toBeInTheDocument();
    });

    it('applies active class to current density setting', () => {
      renderWithProviders();
      const normalButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]');
      expect(normalButton).toHaveClass('active');
      expect(normalButton).toHaveClass('ds-u-fill--primary-lightest');
    });

    it('does not apply active class to non-current density settings', () => {
      renderWithProviders();
      const expandedButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]');
      const compactButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Compact"]');
      
      expect(expandedButton).not.toHaveClass('active');
      expect(compactButton).not.toHaveClass('active');
    });

    it('calls setTableDensity when expanded button is clicked', () => {
      renderWithProviders();
      const expandedButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]') as HTMLButtonElement;
      
      fireEvent.click(expandedButton);
      
      expect(mockDataTableActions.setTableDensity).toHaveBeenCalledWith('expanded');
    });

    it('calls setTableDensity when normal button is clicked', () => {
      renderWithProviders();
      const normalButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]') as HTMLButtonElement;
      
      fireEvent.click(normalButton);
      
      expect(mockDataTableActions.setTableDensity).toHaveBeenCalledWith('normal');
    });

    it('calls setTableDensity when compact button is clicked', () => {
      renderWithProviders();
      const compactButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Compact"]') as HTMLButtonElement;
      
      fireEvent.click(compactButton);
      
      expect(mockDataTableActions.setTableDensity).toHaveBeenCalledWith('compact');
    });
  });

  describe('Rows Per Page Settings', () => {
    it('renders rows per page section', () => {
      renderWithProviders();
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent('Rows per page');
    });

    it('renders dropdown with correct options', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown');
      expect(dropdown).toBeInTheDocument();
      
      const options = dropdown.querySelectorAll('option');
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('10');
      expect(options[1]).toHaveValue('25');
      expect(options[2]).toHaveValue('50');
      expect(options[3]).toHaveValue('100');
    });

    it('sets correct value based on current limit', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
      expect(dropdown.value).toBe('25');
    });

    it('calls setLimit, setPage, and setOffset when dropdown value changes', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
      
      fireEvent.change(dropdown, { target: { value: '50' } });
      
      expect(mockResource.setLimit).toHaveBeenCalledWith(50);
      expect(mockDataTableActions.setPage).toHaveBeenCalledWith(1);
      expect(mockResource.setOffset).toHaveBeenCalledWith(0);
    });

    it('handles string to number conversion correctly', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
      
      fireEvent.change(dropdown, { target: { value: '100' } });
      
      expect(mockResource.setLimit).toHaveBeenCalledWith(100);
    });
  });

  describe('Context Integration', () => {
    it('uses resource from DataTableContext', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
      expect(dropdown.value).toBe('25');
    });

    it('uses tableDensity from DataTableActionsContext', () => {
      renderWithProviders();
      const normalButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]');
      expect(normalButton).toHaveClass('active');
    });

    it('calls setTableDensity from DataTableActionsContext', () => {
      renderWithProviders();
      const expandedButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]') as HTMLButtonElement;
      
      fireEvent.click(expandedButton);
      
      expect(mockDataTableActions.setTableDensity).toHaveBeenCalledWith('expanded');
    });

    it('calls setPage from DataTableActionsContext', () => {
      renderWithProviders();
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
      
      fireEvent.change(dropdown, { target: { value: '50' } });
      
      expect(mockDataTableActions.setPage).toHaveBeenCalledWith(1);
    });
  });

  describe('Conditional Rendering', () => {
    it('returns null when resource is not available', () => {
      const { container } = renderWithProviders({
        ...defaultDataTableContextType,
        resource: undefined
      });
      
      expect(container.firstChild).toBeNull();
    });

    it('renders when resource is available', () => {
      renderWithProviders();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Different Density States', () => {
    it('shows expanded as active when tableDensity is expanded', () => {
      const expandedActions: DataTableActionsContextProps = {
        ...mockDataTableActions,
        tableDensity: 'expanded'
      };
      
      renderWithProviders(defaultDataTableContextType, expandedActions);
      
      const expandedButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]');
      expect(expandedButton).toHaveClass('active');
    });

    it('shows compact as active when tableDensity is compact', () => {
      const compactActions: DataTableActionsContextProps = {
        ...mockDataTableActions,
        tableDensity: 'compact'
      };
      
      renderWithProviders(defaultDataTableContextType, compactActions);
      
      const compactButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Compact"]');
      expect(compactButton).toHaveClass('active');
    });

    it('shows normal as active when tableDensity is normal', () => {
      renderWithProviders();
      
      const normalButton = screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]');
      expect(normalButton).toHaveClass('active');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for density buttons', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Expanded"]')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Normal"]')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content').querySelector('[aria-label="Row height, Compact"]')).toBeInTheDocument();
    });

    it('has proper ARIA label for tooltip', () => {
      renderWithProviders();
      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('has proper ARIA attributes for SVG icons', () => {
      renderWithProviders();
      const svgElements = screen.getByTestId('tooltip-content').querySelectorAll('svg');
      
      svgElements.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg).toHaveAttribute('role', 'img');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid limit values gracefully', () => {
      const resourceWithInvalidLimit: ResourceType = {
        ...mockResource,
        limit: 999
      };
      
      renderWithProviders({
        ...defaultDataTableContextType,
        resource: resourceWithInvalidLimit
      });
      
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;

      expect(dropdown.value).toBe('10');
    });

    it('handles zero limit value', () => {
      const resourceWithZeroLimit: ResourceType = {
        ...mockResource,
        limit: 0
      };
      
      renderWithProviders({
        ...defaultDataTableContextType,
        resource: resourceWithZeroLimit
      });
      
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;

      expect(dropdown.value).toBe('10');
    });

    it('handles negative limit value', () => {
      const resourceWithNegativeLimit: ResourceType = {
        ...mockResource,
        limit: -10
      };
      
      renderWithProviders({
        ...defaultDataTableContextType,
        resource: resourceWithNegativeLimit
      });
      
      const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;

      expect(dropdown.value).toBe('10');
    });
  });

  describe('Integration with Context Providers', () => {
    it('works with different context configurations', () => {
      const customDataTableContext: DataTableContextType = {
        ...defaultDataTableContextType,
        id: 'custom-dataset',
        datasetTableControls: false
      };
      
      renderWithProviders(customDataTableContext);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('handles missing optional context properties', () => {
      const minimalDataTableContext: DataTableContextType = {
        id: 'minimal-dataset',
        resource: mockResource
      };
      
      renderWithProviders(minimalDataTableContext);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });
});
