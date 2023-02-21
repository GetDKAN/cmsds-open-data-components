import axios from 'axios';
import qs from 'qs';
import { DatasetSearchReqTypes } from './datasetSearchReq.types';

function datasetSearchReq (
  {rootUrl, selectedTags, selectedTopics, fulltext}: DatasetSearchReqTypes
  ) {
    console.log(rootUrl)
  return axios({
    method: "GET",
    url: `${rootUrl}/search`,
    params: {
      theme: selectedTopics.length ? selectedTopics.join(",") : null,
      keyword: selectedTags.length ? selectedTags.join(",") : null,
      fulltext: fulltext ? fulltext : null,
    },
    paramsSerializer: {
      serialize: (params) => {
        return qs.stringify(params, {skipNulls: true})
      }
    }
  }).then((res) => res.data)
}

export default datasetSearchReq;