import { createContext } from 'react'

export const FilteredDispatch = createContext(null)

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
