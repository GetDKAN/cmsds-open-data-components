import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from 'qs';
import { acaToParams } from "../../utilities/aca";
import { ACAContext } from "../../utilities/ACAContext";

const useDatastore = (
  datasetID,
  rootAPIUrl,
  options,
  additionalParams = {}
) => {
  const keys = options.keys ? options.keys : true;
  const { prepareColumns } = options;
  const distributionIndex = options.distributionIndex ?? 0;

  const {ACA} = useContext(ACAContext);

  const [values, setValues] = useState([]);
  // Datastore queries stay disabled until the caller confirms this dataset/distribution is CSV
  const resourceKey = `${datasetID}/${distributionIndex}`;
  const [csvConfirmedKey, setCSVConfirmedKey] = useState(null);
  const setCSVDistribution = (isCSV) => setCSVConfirmedKey(isCSV ? resourceKey : null);
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

  // Reset results and schema-specific request state when switching dataset/distribution
  const [stateKey, setStateKey] = useState(resourceKey);
  if (stateKey !== resourceKey) {
    setStateKey(resourceKey);
    setValues([]);
    setCount(null);
    setColumns([]);
    setSchema({});
    setTotalRows(0);
    setTotalColumns(0);
    setConditions(options.conditions ? options.conditions : undefined);
    setSort(options.sort ? options.sort : undefined);
    setGroupings(options.groupings ? options.groupings : undefined);
    setProperties(options.properties ? options.properties : undefined);
    setOffset(options.offset ? options.offset : 0);
  }

  // options.CSVDistribution skips confirmation, for callers without a metastore call
  const csvDistribution = !!options.CSVDistribution || csvConfirmedKey === resourceKey;
  
  // Remove datasetID from params to avoid sending it to the API
  const { datasetID: _, ...restAdditionalParams } = additionalParams;
  
  const apiConditions = conditions?.map(c => {
    if (c.operator === 'is_empty') return { ...c, operator: '=', value: '' };
    if (c.operator === 'not_empty') return { ...c, operator: '<>', value: '' };
    return c;
  });

  let params = {
    keys: keys,
    limit: limit,
    offset: offset,
    conditions: apiConditions,
    sorts: sort,
    properties: properties,
    groupings: groupings,
    ...restAdditionalParams,
  }
  params = acaToParams(params, ACA);
  const paramsString = Object.keys(params).length ? `${qs.stringify(params)}` : '';
  
  let enabled = false;
  if (datasetID && csvDistribution) {
    if (!requireConditions)
      enabled = true;
    if (conditions && conditions.length)
      enabled = true;
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(body.message || body.error || res.statusText);
      err.status = res.status;

      throw err;
    }
    return body;
  }

  const {data, isPending, error} = useQuery({
    queryKey: ["datastore" + datasetID + '/' + distributionIndex + paramsString],
    queryFn: () => {
      setCount(null);
      return fetchJson(`${rootUrl}/datastore/query/${datasetID}/${distributionIndex}?${paramsString}`);
    },
    enabled: enabled
  })

  const{data: unfiltered} = useQuery({
    queryKey: ["datastore" + datasetID + '/' + distributionIndex + "-unfilteredRowsAndCols"],
    queryFn: () => {
      const unfilteredParams = {
        results: false,
        count: true,
        schema: true
      };
      return fetchJson(`${rootUrl}/datastore/query/${datasetID}/${distributionIndex}?${qs.stringify(acaToParams(unfilteredParams, ACA))}`);
    },
    enabled: enabled
  })

  useEffect(() => {
    if(data) {
      const schemaID = Object.keys(data.schema)[0];
      const propertyKeys =
        data.schema && data.schema[schemaID] && data.schema[schemaID].fields
          ? Object.keys(data.schema[schemaID].fields)
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
      const schemaID = unfiltered.schema ? Object.keys(unfiltered.schema)[0] : undefined;
      if (schemaID && unfiltered.schema[schemaID].fields) setTotalColumns(Object.keys(unfiltered.schema[schemaID].fields).length);
    }
  }, [unfiltered])


  return {
    loading: enabled ? isPending : false,
    error,
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
    setCSVDistribution,
    setProperties,
    setGroupings,
    setRootUrl,
    setLimit,
    setOffset,
    setConditions,
    setSort,
  };
};

export default useDatastore;
