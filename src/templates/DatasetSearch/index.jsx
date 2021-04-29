import React, { useState } from 'react';
import qs from 'qs';
import { SearchPaginationResults } from '@civicactions/data-catalog-components';
import { useSearchAPI, separateFacets } from '@civicactions/data-catalog-services';
import { TextField, Dropdown, Spinner, Button } from '@cmsgov/design-system'
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import Pagination from '../../components/Pagination';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';

function updateUrl(selectedFacets, fulltext, sort) {
  let newParams = {...selectedFacets}
  if(fulltext) {
    newParams.fulltext = fulltext;
  }
  if(sort) {
    newParams.sort = sort;
  }
  return qs.stringify(newParams, {addQueryPrefix: true, encode: false})
}

export function selectedFacetsMessage(facets, alternateTitles) {
  let message = [];
  const keys = Object.keys(facets);
  keys.forEach((k) => {
    if(facets[k].length) {
      message.push(`${alternateTitles[k]}: ${facets[k].join(', ')}`)
    }
  })
  return message.join(' & ');
}

export function transformUrlParamsToSearchObject(searchParams, facetList) {
  const params = qs.parse(searchParams, { ignoreQueryPrefix: true })
  const selectedFacets = {}
  facetList.forEach((facet) => {
    selectedFacets[facet] = params[facet] ? params[facet] : [];
  })
  return {
    selectedFacets: selectedFacets,
    fulltext: params.fulltext,
    sort: params.sort
  }
}


const DatasetSearch = ({rootUrl, location}) => {
  console.log(decodeURI(location.search))
  const {
    fulltext,
    selectedFacets,
    loading,
    items,
    sort,
    totalItems,
    facets,
    updateSelectedFacets,
    setFulltext, 
    setSort,
    setPage,
    pageSize,
    page,
    resetFilters,
  } = useSearchAPI(rootUrl, {...transformUrlParamsToSearchObject(decodeURI(location.search), ['theme', 'keyword'])})
  const { theme, keyword } = separateFacets(facets);
  const [filterText, setFilterText] = useState('');
  React.useEffect(() => {
    if(fulltext !== filterText) {
      setFilterText(fulltext)
    }
  }, [fulltext])
  React.useEffect(() => {
    const url = new URL(window.location);
    const searchParams = updateUrl(selectedFacets, fulltext, sort)
    window.history.pushState({}, '', `${url.origin}${url.pathname}${searchParams}`);
  },[fulltext, selectedFacets, sort])


  return(
    <section className="ds-l-container">
      <h1 className="dc-search-header ds-title ds-u-margin-y--3">
        Datasets
      </h1>
      <div className="ds-l-row">
        <div className="ds-l-col--8 ds-u-margin-bottom--3">
          <form
            onSubmit={(e) => {e.preventDefault(); () => setFulltext(filterText);}}
            className="ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--2 "
          >
            <TextField
              fieldClassName="ds-u-margin--0"
              value={filterText}
              className="dc-fulltext--input-container ds-u-padding-right--2"
              label="Search term"
              labelClassName="ds-u-visibility--screen-reader"
              placeholder="Type search term here"
              name="dataset_fulltext_search"
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Button
              type="submit"
              htmlFor="dataset_fulltext_search"
              variation="primary"
              onClick={() => setFulltext(filterText)}
            >
              Search
            </Button>
          </form>
          <div className="ds-u-display--flex ds-u-justify-content--between">
            <p className="ds-u-margin-y--0">
              {selectedFacetsMessage(selectedFacets, {theme: 'Categories', keyword: 'Tags'})}
            </p>
            <Button
              className="ds-u-padding--0 dc-c-clear-filters"
              variation="transparent"
              onClick={() => resetFilters()}
            >
              Clear all filters
            </Button>
          </div>
          {/* <p className="ds-u-text-align--center ds-u-color--gray">{`[${items.length} ${items.length === 1 ? 'entry' : 'entries'} total on page]`}</p> */}
          {/* <SearchPaginationResults
            total={Number(totalItems)}
            pageSize={Number(pageSize)}
            currentPage={Number(page + 1)}
          /> */}
          
          <ol className="dc-dataset-search-list ds-u-padding--0">
            {items.map((item) => (
              <li className="ds-u-padding--0">
                <DatasetSearchListItem item={item} updateFacets={updateSelectedFacets}/>
              </li>
            ))}
          </ol>
          {totalItems &&
            (<Pagination
              currentPage={page}
              totalItems={Number(totalItems)}
              itemsPerPage={pageSize}
              gotoPage={setPage}
            />)
          }
        </div>
        <div className="ds-l-col--4">
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            <Dropdown
              options={[{ label: 'Recently Updated', value: 'modified' },{ label: 'Alphabetical', value: 'title' }]}
              value={sort}
              label="Sort by"
              labelClassName="ds-u-margin-top--0"
              name="dataset_search_sort"
              onChange={(e) => setSort(e.target.value)}
            />
          </div>
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            {theme ?
              (
                <DatasetSearchFacets
                  title="Categories"
                  facets={theme}
                  onclickFunction={updateSelectedFacets}
                  selectedFacets={selectedFacets.theme}
                />
              )
              : (<Spinner className="ds-u-valign--middle" />)
            }
            {keyword ?
              (
                <DatasetSearchFacets
                  title="Tags"
                  facets={keyword}
                  onclickFunction={updateSelectedFacets}
                  selectedFacets={selectedFacets.keyword}
                />
              )
              : (<Spinner className="ds-u-valign--middle" />)
            } 
          </div>
        </div>
      </div>
    </section>
  );
}

export default DatasetSearch;
