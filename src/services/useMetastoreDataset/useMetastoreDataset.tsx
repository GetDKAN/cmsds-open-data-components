import { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import { DatasetType } from '../../types/dataset';

const useMetastoreDataset = (datasetId : string, rootAPIUrl : string, additionalParams={}) => {
  const [dataset, setDataset] = useState({
    title: '',
    distribution: [],
    error: '',
    description: '',
  } as DatasetType);
  const [id, setId] = useState(datasetId)
  const [rootUrl, setRootUrl] = useState(rootAPIUrl)
  const additionalParamsString = Object.keys(additionalParams).length ? `&${qs.stringify(additionalParams)}` : '';
  useEffect(() => {
    async function fetchData() {
      return axios.get(`${rootUrl}/metastore/schemas/dataset/items/${id}?show-reference-ids${additionalParamsString}`)
        .then((res) => setDataset(res.data))
        .catch((error) => setDataset({title: dataset.title, distribution: dataset.distribution, error: error, description: dataset.description}));
    }
    fetchData();
  }, [id, rootUrl]);
  return {dataset, setId, setRootUrl};
}

export default useMetastoreDataset;
