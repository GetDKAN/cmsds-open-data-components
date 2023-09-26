import axios from 'axios';
import qs from 'qs';
import { SearchAPIFacetType, SelectedFacetsType, SortType } from '../../types/search';

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

export function selectedFacetsMessage(facets: any, alternateTitles: any) {
  let message: string[] = [];
  const keys = Object.keys(facets);
  keys.forEach((k: any) => {
    if (facets[k].length) {
      message.push(`${alternateTitles[k]}: ${facets[k].join(', ')}`);
    }
  });
  return message.join(' & ');
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

export function isSelectedFacet(currentFacet: any, selectedFacets: any) {
  const isInSelectedFacets = selectedFacets[currentFacet.key] ? selectedFacets[currentFacet.key].indexOf(currentFacet.value) : -1;
  return isInSelectedFacets;
}

export function updateSelectedFacetObject(currentFacet: any, selectedFacets: SelectedFacetsType[]) {
  const key = currentFacet['key']
  let newFacetList: any = {...selectedFacets};
  if(newFacetList[key]) {
    const existingFacet = isSelectedFacet(currentFacet, newFacetList);
    if(existingFacet > -1) {
      newFacetList[key].splice(existingFacet, 1);
    } else {
      newFacetList[key] = [...newFacetList[key], currentFacet.value]
    }
  } else {
    newFacetList[key] = [currentFacet.value]
  }
  return newFacetList;
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

export function stringifySearchParams(selectedFacets: SelectedFacetsType[], fulltext: string, sort: any) {
  let newParams: any = {...selectedFacets}
  if(fulltext) {
    newParams.fulltext = fulltext;
  }
  if(sort) {
    newParams.sort = sort;
  }
  return qs.stringify(newParams, {addQueryPrefix: true, encode: false, arrayFormat: 'brackets'})
}