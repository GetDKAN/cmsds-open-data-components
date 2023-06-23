import { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';

const useMetastoreDataset = (datasetId, rootAPIUrl, additionalParams={}) => {
  const [dataset, setDataset] = useState({});
  const [id, setId] = useState(datasetId)
  const [rootUrl, setRootUrl] = useState(rootAPIUrl)
  const additionalParamsString = Object.keys(additionalParams).length ? `&${qs.stringify(additionalParams)}` : '';
  useEffect(() => {
    async function fetchData() {
      return axios.get(`${rootUrl}/metastore/schemas/dataset/items/${id}?show-reference-ids${additionalParamsString}`)
        .then((res) => setDataset(res.data))
        .catch((error) => setDataset({error: error}));
    }
    fetchData();
  }, [id, rootUrl]);
  return {dataset, setId, setRootUrl};
}

export default useMetastoreDataset;
