import { useState, useEffect } from 'react';
import axios from 'axios';

function useMetastoreDataset(datasetId, rootAPIUrl) {
  const [dataset, setDataset] = useState({});
  const [id, setId] = useState(datasetId)
  const [rootUrl, setRootUrl] = useState(rootAPIUrl)
  useEffect(() => {
    async function fetchData() {
      return axios.get(`${rootUrl}/metastore/schemas/dataset/items/${id}?show-reference-ids`)
        .then((res) => setDataset(res.data));
    }
    fetchData();
  }, [id, rootUrl]);
  return {dataset, setId, setRootUrl};
}

export default useMetastoreDataset;