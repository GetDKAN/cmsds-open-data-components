import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import qs from 'qs'

const fetchDataFromQuery = async (
  id,
  rootUrl,
  options,
  additionalParams
) => {
  const {
    keys,
    limit,
    offset,
    conditions,
    sort,
    groupings,
    prepareColumns,
    properties,
    unfilteredColumnCount,
    unfilteredCount,
    setValues,
    setUnfilteredColumnCount,
    setCount,
    setUnfilteredCount,
    setColumns,
    setLoading,
    setSchema
  } = options
  if (!id) {
    return false
  }
  if (typeof setLoading === 'function') {
    setLoading(true)
  }
  return await axios({
    method: 'GET',
    url: `${rootUrl}/datastore/query/${id}`,
    params: {
      keys,
      limit,
      offset,
      conditions,
      sorts: sort,
      properties,
      groupings,
      ...additionalParams
    },
    paramsSerializer: (params) => {
      return qs.stringify(params)
    }
  }).then((res) => {
    const { data } = res
    const propertyKeys =
      data.schema[id] && data.schema[id].fields
        ? Object.keys(data.schema[id].fields)
        : []

    setValues(data.results)
    setCount(data.count)

    if ([null, 0].includes(unfilteredCount)) {
      setUnfilteredCount(data.count)
    }

    if ([null, 0].includes(unfilteredColumnCount)) {
      const cols = prepareColumns ? prepareColumns(propertyKeys) : propertyKeys
      setUnfilteredColumnCount(cols.length)
    }

    if (propertyKeys.length) {
      setColumns(prepareColumns ? prepareColumns(propertyKeys) : propertyKeys)
    }
    setSchema(data.schema)

    if (typeof setLoading === 'function') {
      setLoading(false)
    }

    return data
  })
}

const useDatastore = (
  resourceId,
  rootAPIUrl,
  options,
  additionalParams = {}
) => {
  const keys = options.keys ? options.keys : true
  const { prepareColumns } = options
  const [manual, setManual] = useState(options.manual ? options.manual : false)
  const [requireConditions, setRequireConditions] = useState(
    options.requireConditions ? options.requireConditions : false
  )
  const [values, setValues] = useState([])
  const [id, setResource] = useState(resourceId)
  const [rootUrl, setRootUrl] = useState(rootAPIUrl)
  const [limit, setLimit] = useState(options.limit ? options.limit : 20)
  const [count, setCount] = useState(null)
  const [unfilteredCount, setUnfilteredCount] = useState(null)
  const [columns, setColumns] = useState([])
  const [unfilteredColumnCount, setUnfilteredColumnCount] = useState(null)
  const [offset, setOffset] = useState(options.offset ? options.offset : 0)
  const [loading, setLoading] = useState(false)
  const [conditions, setConditions] = useState(
    options.conditions ? options.conditions : undefined
  )
  const [sort, setSort] = useState(options.sort ? options.sort : undefined)
  const [groupings, setGroupings] = useState(
    options.groupings ? options.groupings : undefined
  )
  const [schema, setSchema] = useState({})
  // const [joins, setJoins] = useState()
  const [properties, setProperties] = useState(
    options.properties ? options.properties : undefined
  )
  const prevLimitRef = useRef()
  const prevOffsetRef = useRef()

  useEffect(() => {
    prevLimitRef.current = limit
    prevOffsetRef.current = offset
  })
  const prevLimit = prevLimitRef.current
  const prevOffset = prevOffsetRef.current

  function fetchData () {
    const newOffset = prevLimit === limit ? (prevOffset !== offset ? offset : 0) : 0

    setOffset(newOffset)
    fetchDataFromQuery(
      id,
      rootUrl,
      {
        keys,
        limit,
        offset: newOffset,
        conditions,
        sort,
        groupings,
        prepareColumns,
        properties,
        unfilteredColumnCount,
        unfilteredCount,
        setValues,
        setCount,
        setUnfilteredColumnCount,
        setUnfilteredCount,
        setColumns,
        setLoading,
        setSchema,
        setProperties
      },
      additionalParams
    )
  }

  useEffect(() => {
    if (!loading && !manual) {
      if (!requireConditions) {
        fetchData()
      } else if (requireConditions) {
        if (conditions && conditions.length) {
          fetchData()
        } else {
          setCount(null)
          setUnfilteredCount(null)
          setValues([])
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, rootUrl, offset, conditions, sort, limit, requireConditions])

  return {
    loading,
    values,
    count,
    columns,
    limit,
    offset,
    schema,
    conditions,
    properties,
    unfilteredColumnCount,
    unfilteredCount,
    setProperties,
    setGroupings,
    setResource,
    setRootUrl,
    setLimit,
    setOffset,
    setConditions,
    setSort,
    setManual,
    setRequireConditions,
    fetchData
  }
}

export default useDatastore
