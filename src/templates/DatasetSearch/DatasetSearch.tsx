import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { Accordion, AccordionItem, TextField, Dropdown, Spinner, Button, Alert, Pagination } from '@cmsgov/design-system';
import DatasetSearchListItem from '../../components/DatasetSearchListItem';
import DatasetSearchFacets from '../../components/DatasetSearchFacets';
import LargeFileInfo from '../../components/LargeFileInfo';
import SearchButton from '../../components/SearchButton';
import PageHeader from '../../components/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { separateFacets, transformUrlParamsToSearchObject } from '../../services/useSearchAPI/helpers';

import './dataset-search.scss';
import { DatasetSearchPageProps, SelectedFacetsType, SidebarFacetTypes, DistributionItemType } from '../../types/search';
import { TextFieldValue } from '@cmsgov/design-system/dist/react-components/types/TextField/TextField';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

export const isValidSearch = (query: string) => {
  // Only allow letters, numbers, spaces, and empty string
  // A search containing any special character will be rejected
  console.log('query', query);
  return /^[a-zA-Z0-9 ]*$/.test(query.trim());
};

const DatasetSearch = (props: DatasetSearchPageProps) => {
  const {
    rootUrl,
    enableSort = true,
    enablePagination = true,
    defaultPageSize = 10,
    defaultSort = { defaultSort: 'modified', defaultOrder: 'desc' },
    pageTitle = 'Dataset Explorer',
    filterTitle = 'Tags',
    showLargeFileWarning = false,
    largeFileThemes,
    introText = '',
    showDownloadIcon = false,
    altMobileSearchButton,
    dataDictionaryLinks = false,
  } = props;
  const { ACA } = useContext(ACAContext);

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Title A-Z', value: 'titleAZ' },
    { label: 'Title Z-A', value: 'titleZA' }
  ];

  const defaultSortBy = "";
  const defaultFulltext = "";
  const defaultSelectedFacets = { theme: [], keyword: [] };
  const defaultSortOrder = "";
  const defaultPage = 1;

  const location = useLocation();
  const transformedParams = transformUrlParamsToSearchObject(location.search, defaultSort);

  const [currentResultNumbers, setCurrentResultNumbers] = useState({ total: 0, startingNumber: 0, endingNumber: 0 });
  const [noResults, setNoResults] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  let [searchParams, setSearchParams] = useSearchParams();
  const [fulltext, setFullText] = useState(transformedParams.fulltext);
  const [filterText, setFilterText] = useState(transformedParams.fulltext);
  const [totalItems, setTotalItems] = useState(0);
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
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacetsType>(
    transformedParams.selectedFacets
      ? transformedParams.selectedFacets
      : {
        theme: [],
        keyword: [],
      }
  )
  const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

  const setSortOptions = (value: string) => {
    setSortDisplay(value)
    switch (value) {
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

  function updateSelectedFacets(key: string, value: string) {
    const newFacets: SelectedFacetsType = { ...selectedFacets };
    if (key === 'theme') {
      const existingFacet = newFacets.theme.findIndex((s) => s === value);
      if (existingFacet > -1) {
        newFacets.theme.splice(existingFacet, 1);
      } else {
        newFacets.theme.push(value);
      }
    }
    if (key === 'keyword') {
      const existingFacet = newFacets.keyword.findIndex((s) => s === value);
      if (existingFacet > -1) {
        newFacets.keyword.splice(existingFacet, 1);
      } else {
        newFacets.keyword.push(value);
      }
    }
    const urlString = qs.stringify(
      { theme: newFacets.theme, keyword: newFacets.keyword },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    setSelectedFacets(newFacets);
    const url = new URL(window.location.href);
    window.history.pushState({}, '', `${url.origin}${url.pathname}${urlString}`);
  }

  const pageSize = defaultPageSize;

  function resetFilters() {
    setFullText(defaultFulltext);
    setFilterText(defaultFulltext);
    setSelectedFacets(defaultSelectedFacets);
    setPage(defaultPage);
    const url = new URL(window.location.href);
    window.history.pushState({}, '', `${url.origin}${url.pathname}`);
  }

  function buildSearchParams(includePage: boolean) {
    let newParams: any = {};
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
  }
  const { data, isPending, error } = useQuery({
    queryKey: ["datasets", params],
    queryFn: () => {
      return axios.get(`${rootUrl}/search/?${qs.stringify(acaToParams(params, ACA), { arrayFormat: 'comma', encode: false })}`)
    }
  });

// Sync totalItems state with API response data
  // Moved to useEffect to prevent state updates during render (which can cause infinite loops)
  useEffect(() => {
    if (data?.data?.total !== undefined && data.data.total !== totalItems) {
      setTotalItems(data.data.total);
    }
  }, [data?.data?.total]);

  const facets: SidebarFacetTypes = (data && data.data.facets) ? separateFacets(data ? data.data.facets : []) : { theme: null, keyword: null };

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
    if (page !== 1 && (transformedParams.fulltext !== fulltext || transformedParams.selectedFacets !== selectedFacets))
      setPage(1)
  }, [fulltext, selectedFacets]);

  useEffect(() => {
    if (totalItems !== null && totalItems !== undefined && totalItems > 0) {
      var params = buildSearchParams(true);
      if (params !== location.search) {
        setSearchParams(params);
      }
    }
  }, [page, sort, sortOrder, totalItems]);

  useEffect(() => {
    // No results found
    if (noResults) {
      setAnnouncementText('No results found.');
    }

    // Could not connect to the API
    else if (!isPending && (!data || !data.data.results)) {
      setAnnouncementText('Could not connect to the API.');
    }

    // Show results as normal
    else {
      setAnnouncementText(`Showing ${currentResultNumbers.startingNumber} to ${currentResultNumbers.endingNumber} of ${currentResultNumbers.total} datasets`);
    }
  }, [data, isPending, noResults, currentResultNumbers]);

  return (
    <>
      <PageHeader headerText={pageTitle} />
      <section className="ds-l-container">
        <div>
          <p
            className="ds-u-visibility--screen-reader"
            aria-live="assertive"
            aria-atomic="true"
            data-testid="currentResults"
          >
            {announcementText}
          </p>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12">
            {introText ? introText : null}
            {showLargeFileWarning && (
              <div className="ds-l-row ds-u-margin-bottom--2 ds-u-margin-top--4">
                <div className="ds-l-md-col--12">
                  <Accordion bordered>
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
              onSubmit={(e) => {
                e.preventDefault();
                
                if (filterText) {
                  if (isValidSearch(filterText as string)) {
                    setInvalidSearch(false);

                    setFullText(filterText);
                  } else {
                    setInvalidSearch(true);
                  }
                }
              }}
              className="dkan-dataset-search ds-l-form-row ds-u-padding-bottom--4 ds-u-border-bottom--1"
            >
              <span className="ds-c-field__before fas fa-search ds-u-display--none ds-u-sm-display--inline-block" />
              <TextField
                errorMessage={invalidSearch ? 'No special characters allowed. Please enter a valid search term.' : undefined}
                errorPlacement='bottom'
                fieldClassName="ds-u-margin--0"
                value={filterText as TextFieldValue}
                className={`ds-u-padding-right--2 ${altMobileSearchButton ? 'ds-l-col--12 ds-l-md-col--10 --alt-style' : 'ds-l-col--10'}`}
                label="Search datasets"
                labelClassName="ds-u-visibility--screen-reader"
                placeholder="Search datasets"
                name="dataset_fulltext_search"
                onChange={(e) => {
                  setInvalidSearch(false);
                  setFilterText(e.target.value)
                }}
              />
              <SearchButton altMobileStyle={altMobileSearchButton} />
            </form>
          </div>
        </div>
        <div className="ds-l-row ds-u-padding-top--4">
          <div className="ds-l-col--12 ds-l-sm-col--4">
            <Button
              className="dc-dataset-search--clear-all-filters ds-u-margin-bottom--2"
              onClick={() => resetFilters()}
            >
              Clear all filters
            </Button>
            {facets.theme && (
              <DatasetSearchFacets
                facets={facets.theme}
                title="Categories"
                onClickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.theme}
              />
            )}
            {facets.keyword && (
              <DatasetSearchFacets
                facets={facets.keyword}
                title={filterTitle}
                onClickFunction={updateSelectedFacets}
                selectedFacets={selectedFacets.keyword}
              />
            )}
          </div>
          <div className="ds-l-col--12 ds-l-sm-col--8">
            {isPending ? (
              <Spinner
                className="ds-u-valign--middle"
                aria-valuetext="Dataset Search loading"
                role="status"
              />
            ) : (
              <>
                <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end ds-u-flex-wrap--reverse ds-u-sm-flex-wrap--wrap">
                  {enablePagination && (
                    <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--8 ds-u-sm-padding-left--0">
                      <p className="ds-u-margin-y--0">
                        {(currentResultNumbers && data) && (
                          <>
                            Showing {currentResultNumbers.startingNumber} -{' '}
                            {currentResultNumbers.endingNumber} of {data.data.total} datasets
                          </>
                        )}
                      </p>
                    </div>
                  )}
                  {enableSort && (
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
                <ol className="dc-dataset-search-list ds-u-padding--0 ds-u-margin-top--0 ds-u-margin-bottom--4 ds-u-display--block" data-testid="results-list">
                  {noResults && <Alert variation="error" role="region" heading="No results found." />}
                  {data && data.data.results ? Object.keys(data.data.results).map((key) => {
                    return data.data.results[key];
                  }).map((item) => {
                    function getDownloadUrl(item: DistributionItemType) {
                      let distribution_array = item.distribution ? item.distribution : [];
                      return distribution_array.length ? item.distribution[0].downloadURL : null;
                    }
                    let showLargeFile = false;
                    if (largeFileThemes && item.theme)
                      largeFileThemes.forEach(theme => {
                        if (item.theme.includes(theme))
                          showLargeFile = true;
                      });
 
                    return (
                      <DatasetSearchListItem
                        key={item.identifier}
                        location={location}
                        title={item.title}
                        modified={item.modified}
                        description={item.description}
                        identifier={item.identifier}
                        downloadUrl={showDownloadIcon ? getDownloadUrl(item) : null}
                        largeFile={showLargeFile}
                        paginationEnabled={enablePagination}
                        dataDictionaryLinks={dataDictionaryLinks}
                        distribution={"%Ref:distribution" in item ? item["%Ref:distribution"][0] : {}}
                      />
                    )
                  }) : (
                    <Alert variation="error" role="region" heading="Could not connect to the API." />
                  )}
                </ol>
                {enablePagination && (data && data.data.total) && data.data.total != 0 && (
                  <Pagination
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

export default withQueryProvider(DatasetSearch);
