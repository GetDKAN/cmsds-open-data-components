import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from 'qs';
import { acaToParams } from "../../utilities/aca";
import { ACAContext } from "../../utilities/ACAContext";

const useDatastore = (
  resourceId,
  rootAPIUrl,
  options,
  additionalParams = {}
) => {
  const keys = options.keys ? options.keys : true;
  const { prepareColumns } = options;

  const {ACA} = useContext(ACAContext);

  const [values, setValues] = useState([]);
  const [id, setResource] = useState(resourceId);
  const [rootUrl, setRootUrl] = useState(rootAPIUrl);
  const [limit, setLimit] = useState(options.limit ? options.limit : 20);
  const [count, setCount] = useState(null);
  const [columns, setColumns] = useState([]);
  // unfiltered row / column count for overview tab
  const [totalRows, setTotalRows] = useState(0);
  const [totalColumns, setTotalColumns] = useState(0);
  const [offset, setOffset] = useState(options.offset ? options.offset : 0);
  const [conditions, setConditions] = useState(
    options.conditions ? options.conditions : undefined
  );
  const requireConditions = options.requireConditions;
  const [sort, setSort] = useState(options.sort ? options.sort : undefined);
  const [groupings, setGroupings] = useState(
    options.groupings ? options.groupings : undefined
  );
  const [schema, setSchema] = useState({});
  // const [joins, setJoins] = useState()
  const [properties, setProperties] = useState(
    options.properties ? options.properties : undefined
  );

  let params = {
    keys: keys,
    limit: limit,
    offset: offset,
    conditions: conditions,
    sorts: sort,
    properties: properties,
    groupings: groupings,
    ...additionalParams,
  }
  params = acaToParams(params, ACA);
  const paramsString = Object.keys(params).length ? `${qs.stringify(params)}` : '';
  
  let enabled = false;
  if (id) {
    if (!requireConditions)
      enabled = true;
    if (conditions && conditions.length)
      enabled = true;
  }
  // Change whether distribution API or dataset API is used based on option
  const queryID = options.useDatasetAPI ? params.datasetID + "/0" : id;

  const {data, isPending, error} = useQuery({
    queryKey: ["datastore" + id + paramsString],
    queryFn: () => {
      setCount(null)
      return fetch(`${rootUrl}/datastore/query/${queryID}?${paramsString}`)
        .then(res => res.json())
    },
    enabled: enabled
  })

  const{data: unfiltered} = useQuery({
    queryKey: ["datastore" + id + "-unfilteredRowsAndCols"],
    queryFn: () => {
      const unfilteredParams = {
        results: false,
        count: true,
        schema: true
      }
      return fetch(`${rootUrl}/datastore/query/${queryID}?${qs.stringify(acaToParams(unfilteredParams, ACA))}`)
        .then(res => res.json())
    },
  })
  

  useEffect(() => {
    if(data) {
      const propertyKeys =
        data.schema && data.schema[id] && data.schema[id].fields
          ? Object.keys(data.schema[id].fields)
          : [];
      setValues(data.results), setCount(data.count);
      if (propertyKeys.length) {
        setColumns(prepareColumns ? prepareColumns(propertyKeys) : propertyKeys);
      }
      if(data.schema) {
        setSchema(data.schema);
      }
    }
  }, [data])
  useEffect(() => {
    if (unfiltered) {
      if (unfiltered.count) setTotalRows(unfiltered.count);
      if (unfiltered.schema && unfiltered.schema[id] && unfiltered.schema[id].fields) setTotalColumns(Object.keys(unfiltered.schema[id].fields).length);
    }
  }, [unfiltered])

  return {
    loading: enabled ? isPending : false,
    values,
    count,
    columns,
    totalRows,
    totalColumns,
    limit,
    offset,
    schema,
    conditions,
    properties,
    setProperties,
    setGroupings,
    setResource,
    setRootUrl,
    setLimit,
    setOffset,
    setConditions,
    setSort,
  };
};

export default useDatastore;
