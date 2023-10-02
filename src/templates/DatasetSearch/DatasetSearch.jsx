import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { Accordion, AccordionItem, TextField, Dropdown, Spinner, Button, Alert, Pagination } from '@cmsgov/design-system';
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';
import LargeFileInfo from '../../components/LargeFileInfo';
import SearchButton from '../../components/SearchButton';
import PageHeader from '../../components/PageHeader';
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
  showLargeFileWarning,
  showDownloadIcon,
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
  const [sortDisplay, setSortDisplay] = useState(() => {
    return sort === 'modified' ? (sortOrder === 'desc' ? 'newest' : 'oldest') : (sortOrder === 'desc' ? 'titleZA' : 'titleAZ');
  })
  const [selectedFacets, setSelectedFacets] = useState(
    transformedParams.selectedFacets
      ? transformedParams.selectedFacets
      : defaultSelectedFacets
  )

  const setSortOptions = (value) => {
    setSortDisplay(value)
    switch(value) {
      case 'newest':
        setSort('modified');
        setSortOrder('desc');
        break;
      case 'oldest':
        setSort('modified');
        setSortOrder('asc');
        break;
      case 'titleAZ':
        setSort('title');
        setSortOrder('asc');
        break;
      case 'titleZA':
        setSort('title');
        setSortOrder('desc');
        break;
    }
  }

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
    <>
    <PageHeader headerText={pageTitle} />
    <section className="ds-l-container">
      <div className="ds-l-row">
        <div className="ds-l-col--12 ds-u-margin-bottom--3">
          {introText ? introText : null}
          {showLargeFileWarning && (
            <div className="ds-l-row ds-u-margin-bottom--6">
              <div className="ds-l-md-col--12">
                <Accordion bordered openItems={[0]}>
                  <AccordionItem
                    contentClassName="downloading-datasets"
                    heading="Please read before downloading datasets"
                  >
                    <LargeFileInfo />
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}
        <form
          onSubmit={() => {
            e.preventDefault();
            setFullText(filterText);
          }}
          className="dkan-dataset-search ds-l-form-row ds-u-padding-bottom--6 ds-u-border-bottom--1"
        >
          <span className="ds-c-field__before fas fa-search ds-u-display--none ds-u-sm-display--inline-block" />
          <TextField
            fieldClassName="ds-u-margin--0"
            value={filterText}
            className="ds-u-padding-right--2 ds-l-col--10"
            label="Search datasets"
            labelClassName="ds-u-visibility--screen-reader"
            placeholder="Search datasets"
            name="dataset_fulltext_search"
            onChange={() => setFilterText(e.target.value)}
          />
          <SearchButton />
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
            {theme && (
              <DatasetSearchFacets
                facets={theme}
                title="Categories"
                onClickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.theme}
              />
            )}
            {keyword && (
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
              <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end ds-u-flex-wrap--reverse ds-u-sm-flex-wrap--wrap">
                <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--8">
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
                {showSort && (
                  <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-sm-padding-right--0">
                    <Dropdown
                      options={sortOptions}
                      value={sortDisplay}
                      label="Sort"
                      labelClassName="ds-u-margin-top--0"
                      name="dataset_search_sort"
                      onChange={(e) => setSortOptions(e.target.value)}
                    />
                  </div>
                )}
              </div>
            <ol className="dc-dataset-search-list ds-u-padding--0">
              {noResults && <Alert variation="error" heading="No results found." />}
              {Object.keys(data.data.results).map((key) => {
                  return data.data.results[key];
                }).map((item) => {
                  function getDownloadUrl(item) {
                    let distribution_array = item.distribution ? item.distribution : [];
                    return distribution_array.length ? item.distribution[0].downloadURL : null;
                  }
                  return (
                    <DatasetSearchListItem 
                      title={item.title}
                      modified={item.modified}
                      description={item.description}
                      theme={item.theme}
                      identifier={item.identifier}
                      downloadUrl={showDownloadIcon && getDownloadUrl(item)}
                      largeFile={item.theme.includes('General Payments')} // Hardcoded for Open Payments for now, until we have a better way of detecting this
                    />
                  )
                })}
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
    </>
  );
};

DatasetSearch.defaultProps = {
  pageTitle: 'Dataset Explorer',
  introText: '',
  fulltextLabel: 'Search term',
  fulltextLabelClassName: 'ds-u-visibility--screen-reader',
  fulltextPlaceholder: 'Search datasets',
  formClassName: 'ds-u-display--flex ds-u-justify-content--between ds-u-margin-bottom--2',
  showSort: true,
  sortOptions: [
    { label: 'Newest', value: 'newest'},
    { label: 'Oldest', value: 'oldest'},
    { label: 'Title A-Z', value: 'titleAZ'},
    { label: 'Title Z-A', value: 'titleZA'}
  ],
  defaultSort: { defaultSort: 'modified', defaultOrder: 'desc' },
  showLargeFileWarning: false,
  showDownloadIcon: false
};

export default withQueryProvider(DatasetSearch);
