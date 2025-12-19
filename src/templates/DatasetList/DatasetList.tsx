import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { Accordion, AccordionItem, Dropdown, Spinner, Alert, Pagination } from '@cmsgov/design-system';
import DatasetListItem from '../../components/DatasetListItem';
import LargeFileInfo from '../../components/LargeFileInfo';
import PageHeader from '../../components/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { transformUrlParamsToSearchObject } from '../../services/useSearchAPI/helpers';

// import '../DatasetSearch/dataset-search.scss';
import { DatasetSearchPageProps } from '../../types/search';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const DatasetList = ({
  rootUrl,
  enableSort = true,
  enablePagination = true,
  defaultPageSize = 10,
  defaultSort = { defaultSort: 'modified', defaultOrder: 'desc' },
  pageTitle = 'What\'s New ',
  showLargeFileWarning = false,
  introText = '',
  dataDictionaryLinks = false,
}: DatasetSearchPageProps) => {

  const { ACA } = useContext(ACAContext);

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Title A-Z', value: 'titleAZ' },
    { label: 'Title Z-A', value: 'titleZA' }
  ];

  const defaultSortBy = "";
  const defaultSortOrder = "";
  const defaultPage = 1;

  const location = useLocation();
  const transformedParams = transformUrlParamsToSearchObject(location.search, defaultSort);

  const [currentResultNumbers, setCurrentResultNumbers] = useState({ total: 0, startingNumber: 0, endingNumber: 0 });
  const [noResults, setNoResults] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  let [searchParams, setSearchParams] = useSearchParams();
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

  const pageSize = defaultPageSize;

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
    return qs.stringify(newParams, { addQueryPrefix: includePage, encode: true });
  }

  let params = {
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

  useEffect(() => {
    // Update browser URL with current search params
    const params = buildSearchParams(true);
    const url = new URL(window.location.href);
    window.history.pushState({}, '', `${url.origin}${url.pathname}${params}`);

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
  }, [page, sort, sortOrder]);

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
          </div>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12">
            {isPending ? (
              <Spinner
                className="ds-u-valign--middle"
                aria-valuetext="Dataset Search loading"
                role="status"
              />
            ) : (
              <>
                <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end ds-u-flex-wrap--reverse ds-u-sm-flex-wrap--wrap">
                  <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--8 ds-u-sm-padding-left--0">
                    <div className="ds-u-margin-bottom--3">{introText ? introText : null}</div>
                    {enablePagination && (
                      <div>
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
                  </div>
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
                <ol className="dc-dataset-search-list ds-u-padding--0 ds-u-margin-top--0 ds-u-margin-bottom--4 ds-u-display--block" data-testid="datasetlist-results-list">
                  {noResults && <Alert variation="error" role="region" heading="No results found." />}
                  {data && data.data.results ? Object.keys(data.data.results).map((key) => {
                    return data.data.results[key];
                  }).map((item) => {
                    return (
                      <DatasetListItem
                        key={item.identifier}
                        title={item.title}
                        modified={item.modified}
                        identifier={item.identifier}
                        paginationEnabled={enablePagination}
                        dataDictionaryLinks={dataDictionaryLinks}
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

export default withQueryProvider(DatasetList);
