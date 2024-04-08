import { useState, useEffect } from 'react';
import qs from 'qs';
import { DatasetType } from '../../types/dataset';
import { useQuery } from '@tanstack/react-query';

const useMetastoreDataset = (datasetId : string, rootAPIUrl : string, additionalParams={}) => {
  const [dataset, setDataset] = useState({
    title: '',
    distribution: [],
    error: '',
    description: '',
    identifier: '',
    modified: '',
  } as DatasetType);
  const [id, setId] = useState(datasetId)
  const [rootUrl, setRootUrl] = useState(rootAPIUrl)
  const additionalParamsString = Object.keys(additionalParams).length ? `&${qs.stringify(additionalParams)}` : '';

  const {data, isPending, error} = useQuery({
    queryKey: ["metastore" + id],
    queryFn: () => {
      return fetch(`${rootUrl}/metastore/schemas/dataset/items/${id}?show-reference-ids${additionalParamsString}`)
        .then(res => res.json())
        .then((res) => {
          return res;
        })
    }
  })
  useEffect(() => {
    if (data && data != dataset)
      setDataset(data)
  }, [data])

  return {dataset, isPending, setId, setRootUrl};
}

export default useMetastoreDataset;
