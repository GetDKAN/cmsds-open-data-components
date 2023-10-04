import axios from 'axios';
import qs from 'qs';
import { SearchAPIFacetType, SortType } from '../../types/search';

export function separateFacets(facets: SearchAPIFacetType[]) {
  let facetObj: any = {};
  if (facets) {
    facets.forEach((f) => {
      if(facetObj[f.type]) {
        facetObj[f.type] = [...facetObj[f.type], f]
      } else {
        facetObj[f.type] = [f]
      }
    })
    return facetObj;
  }
}

export function transformUrlParamsToSearchObject(searchParams: string, facetList: [string, string], defaultSortOptions: SortType) {
  const params = qs.parse(searchParams, { ignoreQueryPrefix: true });
  let themes = params.theme as string[];
  let keywords = params.keyword as string[];
  return {
    page: params.page,
    sort: !params.sort ? defaultSortOptions.defaultSort : params.sort,
    sortOrder: !params.sortOrder ? defaultSortOptions.defaultOrder : params.sortOrder,
    fulltext: params.fulltext,
    selectedFacets: {
      theme: themes ? themes : [],
      keyword: keywords ? keywords : [],
    },
  };
}

export async function fetchDatasets(rootUrl: string, options: any, additionalParams: any) {
  const { fulltext, selectedFacets, sort, sortOrder, page, pageSize } = options;

  let params = {
    fulltext: fulltext ? fulltext : undefined,
    ...selectedFacets,
    sort: sort ? sort : undefined,
    ['sort-order']: sortOrder ? sortOrder : undefined,
    page: page !== 1 ? page : undefined,  //use index except for when submitting to Search API
    ['page-size']: pageSize !== 10 ? pageSize : undefined,
    ...additionalParams
  }
  return await axios.get(`${rootUrl}/search/?${qs.stringify(params, {arrayFormat: 'comma',encode: false})}`)
}
