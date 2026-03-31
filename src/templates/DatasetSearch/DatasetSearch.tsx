import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { separateFacets } from '../../services/useSearchAPI/helpers';

import './dataset-search.scss';
import { DatasetSearchPageProps, SelectedFacetsType, SidebarFacetTypes, SearchResultItemType } from '../../types/search';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

export const isValidSearch = (query: string) => {
  return /^[a-zA-Z0-9 ]*$/.test(query.trim());
};

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Title A-Z', value: 'titleAZ' },
  { label: 'Title Z-A', value: 'titleZA' }
];

const DatasetSearch = (props: DatasetSearchPageProps) => {
  const {
    rootUrl,
    enableSort = true,
    enablePagination = true,
    defaultPageSize = 10,
    defaultSort = { defaultSort: 'modified', defaultOrder: 'desc' },
    pageTitle = 'Dataset Explorer',
    categoriesTitle = 'Categories',
    filterTitle = 'Tags',
    showLargeFileWarning = false,
    largeFileThemes,
    introText = '',
    showDownloadIcon = false,
    altMobileSearchButton,
    dataDictionaryLinks = false,
    showDateDetails = false,
    showTopics = false,
    topicSlugFunction = undefined,
    children
  } = props;
  const { ACA } = useContext(ACAContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Derive all search state from URL params
  const selectedFacets: SelectedFacetsType = useMemo(() => {
    const parsed = qs.parse(searchParams.toString());
    const toArray = (val: unknown): string[] => {
      if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
      if (typeof val === 'string') return [val];
      return [];
    };
    return {
      theme: toArray(parsed.theme),
      keyword: toArray(parsed.keyword),
    };
  }, [searchParams]);

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || defaultSort.defaultSort;
  const sortOrder = searchParams.get('sortOrder') || defaultSort.defaultOrder;
  const fulltext = searchParams.get('fulltext') || '';
  const sortDisplay = sort === 'modified'
    ? (sortOrder === 'desc' ? 'newest' : 'oldest')
    : (sortOrder === 'desc' ? 'titleZA' : 'titleAZ');

  // Local UI state only
  const [filterText, setFilterText] = useState(fulltext);
  const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

  // Sync filterText from URL on back/forward
  useEffect(() => { setFilterText(fulltext); }, [fulltext]);

  function buildNextQueryString(overrides: Record<string, string | string[] | null>): string {
    const current = qs.parse(searchParams.toString());
    const merged = { ...current };
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === null) {
        delete merged[key];
      } else {
        merged[key] = value;
      }
    });
    return qs.stringify(merged, { arrayFormat: 'indices', encode: true });
  }

  function updateSelectedFacets(key: string, value: string) {
    const current = selectedFacets[key as keyof SelectedFacetsType] || [];
    const idx = current.indexOf(value);
    const updated = idx > -1
      ? current.filter((_, i) => i !== idx)
      : [...current, value];
    navigate({ search: buildNextQueryString({ [key]: updated.length ? updated : null, page: null }) });
  }

  const setSortOptionsHandler = (value: string) => {
    let nextSort: string;
    let nextSortOrder: string;
    switch (value) {
      case 'newest':
        nextSort = 'modified'; nextSortOrder = 'desc'; break;
      case 'oldest':
        nextSort = 'modified'; nextSortOrder = 'asc'; break;
      case 'titleAZ':
        nextSort = 'title'; nextSortOrder = 'asc'; break;
      case 'titleZA':
        nextSort = 'title'; nextSortOrder = 'desc'; break;
      default: return;
    }
    const overrides: Record<string, string | null> = {
      sort: nextSort === defaultSort.defaultSort ? null : nextSort,
      sortOrder: nextSortOrder === defaultSort.defaultOrder ? null : nextSortOrder,
    };
    navigate({ search: buildNextQueryString(overrides) });
  };

  function resetFilters() {
    setFilterText('');
    navigate({ search: '' });
  }

  const pageSize = defaultPageSize;

  const params = {
    fulltext: fulltext ? fulltext : undefined,
    ...selectedFacets,
    sort: sort ? sort : undefined,
    ['sort-order']: sortOrder ? sortOrder : undefined,
    page: page !== 1 ? page : undefined,
    ['page-size']: pageSize !== 10 ? pageSize : undefined,
  }
  const { data, isPending } = useQuery({
    queryKey: ["datasets", params],
    queryFn: () => {
      return axios.get(`${rootUrl}/search/?${qs.stringify(acaToParams(params, ACA), { arrayFormat: 'comma', encode: false })}`)
    }
  });

  const totalItems = data?.data?.total ? Number(data.data.total) : 0;
  const facets: SidebarFacetTypes = (data && data.data.facets) ? separateFacets(data.data.facets) : { theme: null, keyword: null };

  const currentResultNumbers = useMemo(() => {
    const baseNumber = totalItems > 0 ? 1 : 0;
    const startingNumber = baseNumber + (pageSize * page - pageSize);
    const endingNumber = pageSize * page;
    return {
      total: totalItems,
      startingNumber: totalItems >= startingNumber ? startingNumber : 0,
      endingNumber: totalItems < endingNumber ? totalItems : endingNumber,
    };
  }, [totalItems, pageSize, page]);

  const noResults = totalItems <= 0 && !isPending && data?.data?.results !== undefined;

  const announcementText = useMemo(() => {
    if (noResults) return 'No results found.';
    if (!isPending && (!data || !data.data.results)) return 'Could not connect to the API.';
    return `Showing ${currentResultNumbers.startingNumber} to ${currentResultNumbers.endingNumber} of ${currentResultNumbers.total} datasets`;
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
            {children}
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
                  if (isValidSearch(filterText)) {
                    setInvalidSearch(false);
                    navigate({ search: buildNextQueryString({ fulltext: filterText, page: null }) });
                  } else {
                    setInvalidSearch(true);
                  }
                } else {
                  setInvalidSearch(false);
                  navigate({ search: buildNextQueryString({ fulltext: null, page: null }) });
                }
              }}
              className="dkan-dataset-search ds-l-form-row ds-u-padding-bottom--4 ds-u-border-bottom--1"
            >
              <span className="ds-c-field__before fas fa-search ds-u-display--none ds-u-sm-display--inline-block" />
              <TextField
                errorMessage={invalidSearch ? 'No special characters allowed. Please enter a valid search term.' : undefined}
                errorPlacement='bottom'
                fieldClassName="ds-u-margin--0"
                value={filterText}
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
                title={categoriesTitle}
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
                        onChange={(e) => setSortOptionsHandler(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <ol className="dc-dataset-search-list ds-u-padding--0 ds-u-margin-top--0 ds-u-margin-bottom--4 ds-u-display--block" data-testid="results-list">
                  {noResults && <Alert variation="error" role="region" heading="No results found." />}
                  {data && data.data.results ? (Object.values(data.data.results) as SearchResultItemType[]).map((item) => {
                    const downloadUrl = (() => {
                      const distribution_array = item.distribution ?? [];
                      return distribution_array.length ? distribution_array[0].downloadURL : null;
                    })();

                    const showLargeFile = largeFileThemes && item.theme
                      ? largeFileThemes.some(theme => item.theme!.includes(theme))
                      : false;

                    const dateDetailProps = showDateDetails ? {
                      showDateDetails,
                      released: item.released,
                      refresh: item.nextUpdateDate
                    } : {};

                    const topicProps = (() => {
                      if (!showTopics) return {};
                      const topicSlugs: { [key: string]: string } = {};
                      if (item.theme && Array.isArray(item.theme)) {
                        item.theme.forEach((topic: string) => {
                          if (topic) {
                            const slug = topicSlugFunction ? topicSlugFunction(topic) : topic.split(' ').join('-').toLowerCase();
                            if (slug) topicSlugs[topic] = slug;
                          }
                        });
                      }
                      return { showTopics, theme: item.theme, topicSlugs };
                    })();

                    return (
                      <DatasetSearchListItem
                        key={item.identifier}
                        title={item.title}
                        modified={item.modified}
                        description={item.description}
                        identifier={item.identifier}
                        downloadUrl={showDownloadIcon ? downloadUrl : null}
                        largeFile={showLargeFile}
                        paginationEnabled={enablePagination}
                        dataDictionaryLinks={dataDictionaryLinks}
                        distribution={item.distribution?.[0] ?? {}}
                        {...dateDetailProps}
                        {...topicProps}
                      />
                    )
                  }) : (
                    <Alert variation="error" role="region" heading="Could not connect to the API." />
                  )}
                </ol>
                {enablePagination && (data && data.data.total) && Number(data.data.total) !== 0 && (
                  <Pagination
                    currentPage={Number(page)}
                    totalPages={Math.ceil(Number(data.data.total) / pageSize)}
                    onPageChange={(evt, page) => {
                      evt.preventDefault();
                      window.scroll(0, 0);
                      navigate({ search: buildNextQueryString({ page: page > 1 ? String(page) : null }) });
                    }}
                    renderHref={(p) => {
                      const nextQs = buildNextQueryString({ page: p > 1 ? String(p) : null });
                      return `/datasets?${nextQs}`;
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
