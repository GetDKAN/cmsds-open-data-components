import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterDataset from './index';
import { MockDataTableActionsProvider } from "../DatasetTableTab/DataTableActionsContext";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import { ResourceType, SchemaType } from "../../types/dataset";
import { DataTableActionsContextProps } from "../DatasetTableTab/DataTableActionsContext";
import { DataTableContextType } from "../../templates/Dataset/DataTableContext";

jest.mock('../../templates/FilteredResource/functions', () => ({
  buildOperatorOptions: jest.fn(() => [
    { label: 'Is', value: '=' },
    { label: 'Starts With', value: 'starts with' },
    { label: 'Contains', value: 'contains' },
    { label: 'Is Not', value: '<>' },
    { label: 'Or', value: 'in' },
    { label: 'Greater Than', value: '>' },
    { label: 'Less Than', value: '<' },
    { label: 'Like', value: 'like' },
  ]),
  buildCustomColHeaders: jest.fn(() => null),
  cleanText: jest.fn((value) => value),
  convertUTCToLocalDate: jest.fn((date) => date)
}));

jest.mock('../DatasetTableTab', () => ({
  prepareColumns: jest.fn(() => [{ header: 'Test', accessor: 'test' }])
}));

global.scrollTo = jest.fn()

const createMockContext = ({ mainOverrides = {}, resourceOverrides = {} } = {}): DataTableContextType => ({
  id: "test-id",
  resource: {
    ...resource,
    conditions: [],
    setLimit: jest.fn(),
    setOffset: jest.fn(),
    setSort: jest.fn(),
    setConditions: jest.fn(),
    setResource: jest.fn(),
    schema: {
      'd60b31aa-bfa8-527e-9b50-6c3f972ee9a9': {
        fields: {
          'ndc1': { mysql_type: 'varchar', description: 'NDC1', type: 'string' },
          'ndc2': { mysql_type: 'varchar', description: 'NDC2', type: 'string' },
          'ndc3': { mysql_type: 'varchar', description: 'NDC3', type: 'string' },
          'labeler_name': { mysql_type: 'varchar', description: 'Labeler Name', type: 'string' },
          'labeler_status': { mysql_type: 'varchar', description: 'Labeler Status', type: 'string' },
          'fda_name': { mysql_type: 'varchar', description: 'FDA Name', type: 'string' },
          'cod_status': { mysql_type: 'varchar', description: 'COD Status', type: 'string' },
          'fda_application_numberotc_monograph_number': { mysql_type: 'varchar', description: 'FDA Application Number/OTC Monograph Number', type: 'string' },
          'drug_category': { mysql_type: 'varchar', description: 'Drug Category', type: 'string' },
          'drug_type': { mysql_type: 'varchar', description: 'Drug Type', type: 'string' },
          'line_extension': { mysql_type: 'varchar', description: 'Line Extension', type: 'string' },
          'fda_approval_date': { mysql_type: 'date', description: 'FDA Approval Date', type: 'date' },
          'market_date': { mysql_type: 'date', description: 'Market Date', type: 'date' },
          'unit_type': { mysql_type: 'varchar', description: 'Unit Type', type: 'string' },
          'units_per_package_size': { mysql_type: 'varchar', description: 'Units Per Package Size', type: 'string' },
          'therapeutic_equivalent_code': { mysql_type: 'varchar', description: 'Therapeutic Equivalent Code', type: 'string' },
          '5i_indicator': { mysql_type: 'varchar', description: '5i Indicator', type: 'string' },
          'purchased_product_date': { mysql_type: 'date', description: 'Purchased Product Date', type: 'date' },
          'coverage_effective_date': { mysql_type: 'date', description: 'Coverage Effective Date', type: 'date' },
          'drug_termination_date': { mysql_type: 'date', description: 'Drug Termination Date', type: 'date' },
          'drug_reactivation_date': { mysql_type: 'date', description: 'Drug Reactivation Date', type: 'date' },
          'date_reported_to_cms': { mysql_type: 'date', description: 'Date Reported to CMS', type: 'date' }
        }
      }
    },
    ...resourceOverrides
  } as ResourceType,
  distribution: distribution.distribution[0],
  rootUrl: "test/api/",
  ...mainOverrides
});

const createMockActionsContext = (overrides = {}): DataTableActionsContextProps => ({
  columnOrder: [],
  setColumnOrder: jest.fn(),
  setColumnVisibility: jest.fn(),
  columnVisibility: { teaching_hospital_ccn: true, change_type: true, covered_recipient_type: true, teaching_hospital_id: true },
  page: 1,
  setPage: jest.fn(),
  tableDensity: 'normal' as const,
  setTableDensity: jest.fn(),
  ...overrides
});

describe('FilterDataset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no conditions', () => {
    render(
      <DataTableContext.Provider value={createMockContext()}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    expect(screen.getAllByText(/Filter Dataset/i)).toHaveLength(2);
  });

  it('renders correctly with existing conditions', () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: 'test_value', key: '1' }
    ];

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    expect(screen.getByText('Edit Filters')).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('does not render when required props are missing', () => {
    render(
      <DataTableContext.Provider value={createMockContext({ mainOverrides: { resource: undefined } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    expect(screen.queryByLabelText('Filter dataset')).not.toBeInTheDocument();
  });

  it('opens modal when filter button is clicked', async () => {
    render(
      <DataTableContext.Provider value={createMockContext()}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    expect(screen.getAllByText('Filter Dataset')).toHaveLength(2);
    expect(screen.getByText('Add filters to only display data that meets your criteria. Filtered results can be downloaded.')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    render(
      <DataTableContext.Provider value={createMockContext()}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    expect(screen.getAllByText('Filter Dataset')).toHaveLength(2);

    const closeButton = screen.getByLabelText(/Close dialog/i);
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('adds a new condition when "Add filter" button is clicked', async () => {
    render(
      <DataTableContext.Provider value={createMockContext()}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    expect(screen.getAllByText('Column Name')).toHaveLength(5);
  });

  it('removes a condition when remove is called', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: 'test_value', key: '1' }
    ];

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    expect(screen.getByText('Edit Filters')).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('submits conditions when Apply button is clicked', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText(/\+ Add filter/i);
    await userEvent.click(addFilterButton);

    const valueInputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.type(valueInputs[0], 'test_value');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "=", "property": "ndc1", "value": "test_value"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('does not submit when no valid conditions exist', async () => {
    const mockSetConditions = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const applyButton = screen.getByText(/Apply/);
    expect(applyButton).toBeDisabled();
  });

  it('clears all conditions when clear filters is clicked', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: 'test_value', key: '1' }
    ];
    const mockSetConditions = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions, setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const clearButton = screen.getByText('Reset');
    await userEvent.click(clearButton);

    expect(mockSetConditions).toHaveBeenCalledWith([]);
  });

  it('updates browser URL when conditions are applied', async () => {
    const mockSetConditions = jest.fn();
    const mockPushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const valueInputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.type(valueInputs[0], 'test_value');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockPushStateSpy).toHaveBeenCalled();
  });

  it('handles Is operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: '=' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, 'value1,value2,value3');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "=", "property": "ndc1", "value": "value1,value2,value3"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles Is Not operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: '<>' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, 'value1');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "<>", "property": "ndc1", "value": "value1"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles Contains operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: 'contains' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, 'value1');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "contains", "property": "ndc1", "value": "value1"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles Starts With operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: 'starts with' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, 'value1');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "starts with", "property": "ndc1", "value": "value1"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles > operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: '>' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, '100');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": ">", "property": "ndc1", "value": "100"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles < operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: '<' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, '50');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "<", "property": "ndc1", "value": "50"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles Or operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: 'in' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, '100');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "in", "property": "ndc1", "value": ["100"]}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles Like operator', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const operatorSelect = screen.getAllByLabelText(/condition/i)[0];
    fireEvent.change(operatorSelect, { target: { value: 'like' } });

    const valueInput = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(valueInput, '50');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "like", "property": "ndc1", "value": "%50%"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('clears conditions when all conditions are removed', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: 'test_value', key: '1' }
    ];
    const mockSetConditions = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions, setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const removeButtons = screen.getAllByLabelText(/Delete filter/);
    await userEvent.click(removeButtons[0]);

    expect(mockSetConditions).toHaveBeenCalledWith([]);
  });

  it('removes condition but keeps other conditions when not empty', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: 'test_value', key: '1' },
      { property: 'ndc2', operator: '!=', value: 'test_value2', key: '2' }
    ];
    const mockSetConditions = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions, setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const removeButtons = screen.getAllByLabelText(/Delete filter/);
    await userEvent.click(removeButtons[0]);

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([
      {
        operator: "!=",
        property: "ndc2",
        value: "test_value2",
      }
    ]);
  });

  it('updates condition values correctly', async () => {
    render(
      <DataTableContext.Provider value={createMockContext()}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const valueInputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.type(valueInputs[0], 'new_value');

    const applyButton = screen.getByText(/Apply/);
    expect(applyButton).not.toBeDisabled();
  });

  it('submits with complete conditions', async () => {
    const mockSetConditions = jest.fn();
    const mockSetPage = jest.fn();
    const mockSetOffset = jest.fn();

    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions, setOffset: mockSetOffset } })}>
        <MockDataTableActionsProvider value={createMockActionsContext({ setPage: mockSetPage })}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const valueInputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.type(valueInputs[0], 'valid_value');

    const applyButton = screen.getByText(/Apply/);
    await userEvent.click(applyButton);

    expect(mockSetConditions).toHaveBeenCalledWith([{"operator": "=", "property": "ndc1", "value": "valid_value"}]);
    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it('handles missing schema fields', () => {
    const mockContext = createMockContext();
    (mockContext.resource as ResourceType).schema = { 'd60b31aa-bfa8-527e-9b50-6c3f972ee9a9': { fields: { 'test_field': { mysql_type: 'varchar', description: 'Test Field', type: 'string' } } } } as SchemaType;

    render(
      <DataTableContext.Provider value={mockContext}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    expect(screen.getAllByText('Filter Dataset')).toHaveLength(2);
  });

  it('handles conditions with undefined values', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: '=', value: undefined, key: '1' }
    ];
    const mockSetConditions = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions, setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    expect(screen.getByText('Add filters to only display data that meets your criteria. Filtered results can be downloaded.')).toBeInTheDocument();
  });

  it('handles conditions with array values', async () => {
    const mockConditions = [
      { property: 'ndc1', operator: 'IN', value: ['value1', 'value2'], key: '1' }
    ];
    const mockSetConditions = jest.fn();
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { conditions: mockConditions, setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    expect(screen.getByText('Add filters to only display data that meets your criteria. Filtered results can be downloaded.')).toBeInTheDocument();
  });

  it('updates browser URL when conditions are applied', async () => {
    const mockSetConditions = jest.fn();
    const mockPushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});;
    
    render(
      <DataTableContext.Provider value={createMockContext({ resourceOverrides: { setConditions: mockSetConditions } })}>
        <MockDataTableActionsProvider value={createMockActionsContext()}>
          <FilterDataset />
        </MockDataTableActionsProvider>
      </DataTableContext.Provider>
    );

    const filterButton = screen.getByLabelText(/Filter dataset/i);
    await userEvent.click(filterButton);

    const addFilterButton = screen.getByText('+ Add filter');
    await userEvent.click(addFilterButton);

    const columnSelect = screen.getAllByLabelText(/column name/i)[0];
    fireEvent.change(columnSelect, { target: { value: 'ndc1' } });

    const valueInputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.type(valueInputs[0], 'test_value');

    const applyButton = screen.getByText(/Apply.*filter/);
    await userEvent.click(applyButton);

    expect(mockPushStateSpy).toHaveBeenCalledWith({}, "", expect.stringContaining("?conditions[0][property]=ndc1&conditions[0][value]=test_value&conditions[0][operator]=%3D"));
  });
});
