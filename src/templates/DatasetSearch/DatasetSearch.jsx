import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { TextField, Dropdown, Spinner, Button, Alert, Pagination } from '@cmsgov/design-system';
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';
import { useQuery } from '@tanstack/react-query';
import { separateFacets, updateSelectedFacetObject, selectedFacetsMessage, transformUrlParamsToSearchObject } from '../../services/useSearchAPI/helpers';

import axios from 'axios';
import './dataset-search.scss';

const DatasetSearch = ({
  rootUrl,
  pageTitle,
  introText,
  fulltextLabel,
  fulltextLabelClassName,
  fulltextPlaceholder,
  filterTitle,
  formClassName,
  additionalParams,
  sortOptions,
  defaultSort,
  showSort,
}) => {
  const defaultSortBy = "";
  const defaultFulltext = "";
  const defaultSelectedFacets = {};
  const defaultSortOrder = "";
  const defaultPage = 1;
  const defaultPageSize = 10;

  const location = useLocation();
  const transformedParams = transformUrlParamsToSearchObject(location.search, ['theme', 'keyword'], defaultSort);

  const [currentResultNumbers, setCurrentResultNumbers] = useState(null);
  const [noResults, setNoResults] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [fulltext, setFullText] = useState(transformedParams.fulltext);
  const [filterText, setFilterText] = useState(transformedParams.fulltext);
  const [totalItems, setTotalItems] = useState(null);
  const [page, setPage] = useState(transformedParams.page ? transformedParams.page : defaultPage);
  const [sort, setSort] = useState(
    transformedParams.sort ? transformedParams.sort : defaultSort ? defaultSort.defaultSort : defaultSortBy
  );
  const [sortOrder, setSortOrder] = useState(
    transformedParams.sortOrder
      ? transformedParams.sortOrder
      : defaultSort ? defaultSort.defaultOrder : defaultSortOrder
  );
  const [selectedFacets, setSelectedFacets] = useState(
    transformedParams.selectedFacets
      ? transformedParams.selectedFacets
      : defaultSelectedFacets
  )

  function updateSelectedFacets(currentFacet) {
    const facets = updateSelectedFacetObject(currentFacet, selectedFacets);
    setPage(1);
    setSelectedFacets(facets);
  }

  const pageSize = location.search.pageSize ? location.search.pageSize : defaultPageSize;

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

  useEffect(() => {
    var params = buildSearchParams(true);
    if (params !== location.search) {
      setSearchParams(params);
    }
  }, [page, sort, sortOrder, fulltext, selectedFacets]);

  function resetFilters() {
    setFullText(defaultFulltext);
    setFilterText(defaultFulltext);
    setSelectedFacets(defaultSelectedFacets);
    setPage(defaultPage);
  }

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

  let params = {
    fulltext: fulltext ? fulltext : undefined,
    ...selectedFacets,
    sort: sort ? sort : undefined,
    ['sort-order']: sortOrder ? sortOrder : undefined,
    page: page !== 1 ? page : undefined,  //use index except for when submitting to Search API
    ['page-size']: pageSize !== 10 ? pageSize : undefined,
    ...additionalParams
  }
  const { data, status, error } = useQuery(["datasets", params], () =>
    axios.get(`${rootUrl}/search/?${qs.stringify(params, {arrayFormat: 'comma',encode: false, skipEmptyString: true })}`)
  );

  if (data && totalItems != data.data.total) setTotalItems(data.data.total);

  const { theme, keyword } = separateFacets(data ? data.data.facets : []);

  return (
    <section className="ds-l-container">
      <h1 className="dc-search-header ds-title ds-u-margin-y--3">{pageTitle}</h1>
      <div className="ds-l-row">
        <div className="ds-l-col--12">
        {introText ? introText : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            () => {
              setFullText(filterText);
              setPage(defaultPage)
            }
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
            variation="solid"
            htmlFor="dataset_fulltext_search"
            onClick={() => {
              setFullText(filterText);
              setPage(defaultPage)
            }}
          >
            Search
          </Button>
        </form>
        </div>
      </div>
      <div className="ds-l-row ds-u-padding-top--6">
        <div className="ds-l-col--12 ds-l-sm-col--4">
            <Button
              className="dc-dataset-search--clear-all-filters ds-u-margin-bottom--2"
              onClick={() => resetFilters()}
            >
              Clear all filters
            </Button>
            {data && (
              <DatasetSearchFacets
                facets={theme}
                title="Categories"
                onClickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.theme}
              />
            )}
            {data && (
              <DatasetSearchFacets
                facets={keyword}
                title={filterTitle ? filterTitle : "Tags"}
                onClickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.keyword}
              />
            )}
        </div>
        <div className="ds-l-col--12 ds-l-sm-col--8">
          {status === "loading" ? (
            <Spinner
              className="ds-u-valign--middle"
              aria-valuetext="Dataset Search loading"
              role="status"
            />
          ) : (
            <>
              <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end">
              <div>
                {currentResultNumbers && (
                  <p className="ds-u-margin-y--0" role="region" aria-live="polite" data-testid="currentResults" >
                    Showing {currentResultNumbers.startingNumber} -{' '}
                    {currentResultNumbers.endingNumber} of {data.data.total} datasets
                  </p>
                )}
                <p className="ds-u-margin-y--0">
                  {selectedFacetsMessage(selectedFacets, {
                    theme: 'Categories',
                    keyword: 'Tags',
                  })}
                </p>
              </div>
            </div>
            <ol className="dc-dataset-search-list ds-u-padding--0">
              {noResults && <Alert variation="error" heading="No results found." />}
              {Object.keys(data.data.results).map((key) => {
                  return data.data.results[key];
                }).map((item) => (
                  <li className="ds-u-padding--0" key={item.identifier}>
                    <DatasetSearchListItem item={item} updateFacets={updateSelectedFacets} />
                  </li>
                ))}
            </ol>
            {data.data.total != 0 && (
              <Pagination
                id="test-default"
                currentPage={Number(page)}
                totalPages={Math.ceil(Number(data.data.total) / pageSize)}
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

          </>
          )}
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

export default withQueryProvider(DatasetSearch);
