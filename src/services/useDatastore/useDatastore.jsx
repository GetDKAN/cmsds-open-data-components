import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from 'qs';

const useDatastore = (
  resourceId,
  rootAPIUrl,
  options,
  additionalParams = {},
) => {
  const keys = options.keys ? options.keys : true;
  const { prepareColumns } = options;

  const [values, setValues] = useState([]);
  const [id, setResource] = useState(resourceId);
  const [rootUrl, setRootUrl] = useState(rootAPIUrl);
  const [limit, setLimit] = useState(options.limit ? options.limit : 20);
  const [count, setCount] = useState(null);
  const [columns, setColumns] = useState([]);
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
  const additionalParamsString = Object.keys(params).length ? `${qs.stringify(params)}` : '';
  
  let enabled = false;
  if (id) {
    if (!requireConditions)
      enabled = true;
    if (conditions && conditions.length)
      enabled = true;
  }

  const {data, isPending, error} = useQuery({
    queryKey: ["datastore" + id + additionalParamsString],
    queryFn: () => {
      return fetch(`${rootUrl}/datastore/query/${id}?${additionalParamsString}`)
        .then(res => res.json())
    },
    enabled: enabled
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

  return {
    loading: enabled ? isPending : false,
    values,
    count,
    columns,
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
