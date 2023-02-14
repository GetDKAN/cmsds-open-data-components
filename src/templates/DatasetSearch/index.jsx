import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useSearchAPI, separateFacets } from '@civicactions/data-catalog-services';
import { TextField, Dropdown, Spinner, Button, Alert, Pagination } from '@cmsgov/design-system';
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';

export function selectedFacetsMessage(facets, alternateTitles) {
  let message = [];
  const keys = Object.keys(facets);
  keys.forEach((k) => {
    if (facets[k].length) {
      message.push(`${alternateTitles[k]}: ${facets[k].join(', ')}`);
    }
  });
  return message.join(' & ');
}

export function transformUrlParamsToSearchObject(searchParams, facetList, defaultSortOptions) {
  const params = qs.parse(searchParams, { ignoreQueryPrefix: true });
  const selectedFacets = {};
  facetList.forEach((facet) => {
    selectedFacets[facet] = params[facet] ? params[facet] : [];
  });
  return {
    page: params.page,
    sort: !params.sort ? defaultSortOptions.defaultSort : params.sort,
    sortOrder: !params.sortOrder ? defaultSortOptions.defaultOrder : params.sortOrder,
    fulltext: params.fulltext,
    selectedFacets: selectedFacets,
  };
}

const DatasetSearch = ({
  rootUrl,
  pageTitle,
  introText,
  fulltextLabel,
  fulltextLabelClassName,
  fulltextPlaceholder,
  formClassName,
  additionalParams,
  sortOptions,
  defaultSort,
  showSort,
}) => {
  const [currentResultNumbers, setCurrentResultNumbers] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const [filterText, setFilterText] = useState('');

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
    sortOrder,
    setSortOrder,
    setPage,
    pageSize,
    page,
    resetFilters,
  } = useSearchAPI(
    rootUrl,
    {
      ...transformUrlParamsToSearchObject(location.search, ['theme', 'keyword'], defaultSort),
    },
    additionalParams
  );
  const { theme, keyword } = separateFacets(facets);
  function buildSearchParams(includePage) {
    let newParams = {};
    if (Number(page) !== 1 && includePage) {
      newParams.page = page;
    }
    if (sort !== defaultSort.defaultSort) {
      newParams.sort = sort;
    }
    if (sortOrder !== defaultSort.defaultOrder) {
      newParams.sortOrder = sortOrder;
    }
    if (fulltext !== '') {
      newParams.fulltext = fulltext;
    }
    if (Object.keys(selectedFacets).length) {
      Object.keys(selectedFacets).forEach((key) => {
        newParams[key] = selectedFacets[key];
      });
    }
    return qs.stringify(newParams, { addQueryPrefix: includePage, encode: true });
  }

  useEffect(() => {
    if (fulltext !== filterText) {
      setFilterText(fulltext);
    }
  }, [fulltext]);

  useEffect(() => {
    // update search on browser back button press
    // parse params to get fulltext
    const urlParams = location.search.split("?")[1];
    if (urlParams) {
      const paramArray = urlParams.indexOf("&") != -1 ? urlParams.split("&") : [urlParams]
      
      let updatedFullText = fulltext;
      paramArray.forEach((query) => {
        let param = query.split("=");
        if (param[0] === "fulltext")
          updatedFullText = param[1];
      });
      if (updatedFullText !== fulltext)
        setFulltext(updatedFullText);
    }
  }, [location.search])

  useEffect(() => {
    var params = buildSearchParams(true);
    if (params !== location.search) {
      setSearchParams(params);
    }
  }, [page, sort, sortOrder, fulltext, selectedFacets]);

  useEffect(() => {
    const baseNumber = Number(totalItems) > 0 ? 1 : 0;
    const startingNumber = baseNumber + (Number(pageSize) * Number(page) - Number(pageSize));
    const endingNumber = Number(pageSize) * Number(page);
    setCurrentResultNumbers({
      total: Number(totalItems),
      startingNumber: Number(totalItems) >= startingNumber ? startingNumber : 0,
      endingNumber: Number(totalItems) < endingNumber ? Number(totalItems) : endingNumber,
    });
    if (totalItems <= 0 && currentResultNumbers !== null) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [totalItems, pageSize, page]);

  return (
    <section className="ds-l-container">
      <h1 className="dc-search-header ds-title ds-u-margin-y--3">{pageTitle}</h1>
      <div className="ds-l-row">
        <div className="ds-l-md-col--8 ds-l-sm-col--12ds-u-margin-bottom--3">
          {introText ? introText : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              () => setFulltext(filterText);
            }}
            className={formClassName}
          >
            <TextField
              fieldClassName="ds-u-margin--0"
              value={filterText}
              className="dc-fulltext--input-container ds-u-padding-right--2"
              label={fulltextLabel}
              labelClassName={fulltextLabelClassName}
              placeholder={fulltextPlaceholder}
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
          <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end">
            <div>
              {currentResultNumbers && (
                <p className="ds-u-margin-y--0">
                  Showing {currentResultNumbers.startingNumber} -{' '}
                  {currentResultNumbers.endingNumber} of {currentResultNumbers.total} datasets
                </p>
              )}
              <p className="ds-u-margin-y--0">
                {selectedFacetsMessage(selectedFacets, {
                  theme: 'Categories',
                  keyword: 'Tags',
                })}
              </p>
            </div>

            <Button
              className="ds-u-padding--0 dc-c-clear-filters"
              variation="transparent"
              onClick={() => resetFilters()}
            >
              Clear all filters
            </Button>
          </div>
          <ol className="dc-dataset-search-list ds-u-padding--0">
            {noResults && <Alert variation="error" heading="No results found." />}
            {items.map((item) => (
              <li className="ds-u-padding--0" key={item.identifier}>
                <DatasetSearchListItem item={item} updateFacets={updateSelectedFacets} />
              </li>
            ))}
          </ol>
          {totalItems && (
            <Pagination
              id="test-default"
              currentPage={Number(page)}
              totalPages={Math.ceil(Number(totalItems) / pageSize)}
              onPageChange={(evt, page) => {
                evt.preventDefault();
                window.scroll(0, 0);
                setPage(page);
              }}
              renderHref={(page) => {
                const searchParams = buildSearchParams(false);
                const includeAnd = searchParams ? '&' : '';
                return `/datasets?page=${page}${includeAnd}${searchParams}`;
              }}
            />
          )}
        </div>
        <div className="ds-l-md-col--4 ds-l-sm-col--12">
          {showSort && (
            <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
              <Dropdown
                options={sortOptions}
                value={sort}
                label="Sort by"
                labelClassName="ds-u-margin-top--0"
                name="dataset_search_sort"
                onChange={(e) => setSort(e.target.value)}
              />
              <Dropdown
                options={[
                  { label: 'Ascending', value: 'asc' },
                  { label: 'Descending', value: 'desc' },
                ]}
                value={sortOrder}
                label="Sort order"
                labelClassName="ds-u-margin-top--0"
                name="dataset_search_sort_order"
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          )}
          <div className="ds-u-padding--2 ds-u-margin-bottom--4 ds-u-border--1">
            {theme ? (
              <DatasetSearchFacets
                title="Categories"
                facets={theme}
                onclickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.theme}
                loading={loading}
              />
            ) : (
              <Spinner
                className="ds-u-valign--middle"
                aria-valuetext="Categories loading"
                role="status"
              />
            )}
            {keyword ? (
              <DatasetSearchFacets
                title="Tags"
                facets={keyword}
                onclickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.keyword}
                loading={loading}
              />
            ) : (
              <Spinner
                className="ds-u-valign--middle"
                aria-valuetext="Tags loading"
                role="status"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

DatasetSearch.defaultProps = {
  pageTitle: 'Datasets',
  introText: '',
  fulltextLabel: 'Search term',
  fulltextLabelClassName: 'ds-u-visibility--screen-reader',
  fulltextPlaceholder: 'Type search term here',
  formClassName: 'ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--2',
  showSort: true,
  sortOptions: [
    { label: 'Recently Updated', value: 'modified' },
    { label: 'Title', value: 'title' },
  ],
  defaultSort: { defaultSort: 'modified', defaultOrder: 'desc' },
};

export default DatasetSearch;
