import { useState, useEffect } from 'react';
import qs from 'qs';
import { DatasetType } from '../../types/dataset';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

  const { data, isPending } = useQuery({
    queryKey: ["metastore" + id + additionalParamsString],
    queryFn: () => {
      return axios.get(`${rootUrl}/metastore/schemas/dataset/items/${id}?show-reference-ids${additionalParamsString}`)
        .then((res) => res.data)
        .catch((error) => {return {title: dataset.title, distribution: dataset.distribution, error: error, description: dataset.description, identifier: dataset.identifier, modified: dataset.modified}});
    }
  })
  useEffect(() => {
    if (!isPending && data && data != dataset)
      setDataset(data)
  }, [data])

  return {dataset, isPending, setId, setRootUrl};
}

export default useMetastoreDataset;
