import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FilteredDispatch } from './FilteredDatasetContext'
import useDatastore from '../../../hooks/useDataStore'
import { getApiBaseUrl } from '../../../utilities/getApiBaseUrl'

import {
  useTable,
  usePagination,
  useFilters,
  useSortBy,
  useFlexLayout,
  useResizeColumns,
  useColumnOrder
} from 'react-table'

const FilteredDatasetResource = ({
  children,
  resource
}) => {
  const [filters, setFilters] = useState([{ column: '', condition: '', value: '' }]) // keep track of the applied filters
  const [filtersApplied, setFiltersApplied] = useState([])
  const [initCol, setInitCol] = useState([]) // we want to save a reference to filter against
  const [col, setCol] = useState([]) // columns we pass to table, post filter
  const [data, setData] = useState([]) // these are our cell values
  const [initOrder, setInitOrder] = useState([]) // initial order saved as a reference
  const [curOrder, setCurOrder] = useState([]) // current order that we pass to the data table
  const [visCol, setVisCol] = useState([]) // our visible column reference to prevent more datastore queries than need be
  const [activeDensity, setActiveDensity] = useState('Normal')
  const [downloadSize, setDownloadSize] = useState({
    sizeLabel: 'KB',
    size: 0
  })
  const prepareColumns = (columns, schema) => {
    return columns.map((column) => ({
      Header: schema && schema.fields[column].description ? schema.fields[column].description : column,
      accessor: column
    }))
  }
  const baseUrl = getApiBaseUrl()
  const filteredResource = useDatastore(
    '',
    baseUrl,
    {
      limit: 20,
      manual: true
    },
    {}
    // additionalParams
  )

  // listen to our filter resource changing, and flip the go switch once we have the info to query.
  useEffect(() => {
    if (resource.identifier) {
      filteredResource.setResource(resource.identifier)
      filteredResource.setManual(false)
    }
    if (!resource.identifier) {
      setInitOrder([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  useEffect(() => {
    if (visCol.length) {
      const newCol = initCol.filter((item) => visCol.includes(item.accessor))
      setCol(newCol)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visCol])

  // the issue is that this fires more than expected.
  useEffect(() => {
    if (Object.keys(filteredResource.schema).length > 0) {
      setData(filteredResource.values)
      // we only want to initialize columns if we don't have any info
      if (!initCol.length) {
        const newColumns = prepareColumns(filteredResource.columns, filteredResource.schema[Object.keys(filteredResource.schema)])
        setCol(newColumns) // init
        setInitCol(newColumns) // init
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredResource.loading])

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => (
        rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      )
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      // Filter: DefaultColumnFilter,
      Filter: false,
      minWidth: 30,
      // width: 150,
      maxWidth: 400
    }),
    []
  )
  const filteredTable = useTable(
    {
      columns: col,
      data,
      initialState: { pageIndex: Number(filteredResource.offset / filteredResource.limit), pageSize: 20 },
      manualPagination: true,
      manualSortBy: true,
      manualFilters: true,
      pageCount: Math.ceil(Number(filteredResource.count) / filteredResource.limit),
      defaultColumn,
      filterTypes
      // NextPage and previous Page are defined methods in the Dataset explorer instead
    },
    useFilters,
    useFlexLayout,
    useResizeColumns,
    useColumnOrder,
    useSortBy,
    usePagination
  )

  // Initialize current and init orders
  useEffect(() => {
    if (filteredTable.allColumns.length && !initOrder.length) {
      setInitOrder(filteredTable.allColumns)
      setCurOrder(filteredTable.allColumns.map((d) => d.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTable.allColumns.length, initOrder.length])

  const resetVisibility = () => {
    const initialCol = initCol.map((item) => item.accessor)
    setVisCol(initialCol)
  }

  return (
    <FilteredDispatch.Provider
      value={{
        filteredResource,
        filteredTable,
        initOrder,
        curOrder,
        setCurOrder,
        setVisCol,
        resetVisibility,
        initCol,
        visCol,
        activeDensity,
        setActiveDensity,
        filters,
        setFilters,
        filtersApplied,
        setFiltersApplied,
        downloadSize,
        setDownloadSize
      }}
    >
      {children}
    </FilteredDispatch.Provider>
  )
}
FilteredDatasetResource.propTypes = {
  children: PropTypes.node,
  identifier: PropTypes.string,
  resource: PropTypes.object
}
FilteredDatasetResource.displayName = 'FilteredDatasetResource'
export default FilteredDatasetResource
