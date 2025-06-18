import { createContext } from 'react'

// export const FilteredDispatch = createContext(null)
export const FilteredDispatch = createContext({
  filteredResource: {},
  filteredTable: {},
  initOrder: [
    {id: '0', Header: 'NDC Description'},
    {id: '1', Header: 'NDC'},
    {id: '2', Header: 'Old NADAC Per Unit'}, 
    {id: '3', Header: 'New NADAC Per Unit'}, 
    {id: '4', Header: 'Classification for Rate Setting'}, 
    {id: '5', Header: 'Percent Change'}, 
  ],
  curOrder: [],
  setCurOrder: () => {},
  setVisCol: () => {},
  resetVisibility: () => {},
  initCol: [],
  visCol: [],
  activeDensity: 'density-3',
  setActiveDensity: () => {},
  filters: [
  {column: "two"},
],
  setFilters: () => {},
  filtersApplied: [],
  setFiltersApplied: () => {},
  downloadSize: {
    sizeLabel: 'KB',
    size: 0
  }
})


export const defaultResourceState = {
  columnOrder: [],
  columns: [],
  count: 0,
  unfilteredCount: 0,
  unfilteredColumnCount: 0,
  currentPage: 0,
  density: 'density-3',
  excludedColumns: {},
  filters: [],
  loading: false,
  limit: 20,
  sort: [],
  values: [],
  downloadSize: {
    sizeLabel: 'KB',
    size: 0
  }
}
