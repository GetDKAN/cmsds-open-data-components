import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { Spinner, Alert } from '@cmsgov/design-system';
import DatasetListSubmenuItem from '../DatasetListSubmenuItem';
import { useQuery } from '@tanstack/react-query';
import { transformUrlParamsToSearchObject } from '../../services/useSearchAPI/helpers';

import "./dataset-list-submenu.scss";
import { DatasetSubmenuListProps } from '../../types/search';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const DatasetListSubmenu = ({
  rootUrl,
  enablePagination = true,
  defaultPageSize = 4,
  defaultSort = { defaultSort: 'modified', defaultOrder: 'desc' },
  dataDictionaryLinks = false,
  location,
  subLinkClasses
}: DatasetSubmenuListProps) => {
  const { ACA } = useContext(ACAContext);

  const defaultSortBy = "";
  const defaultSortOrder = "";
  const defaultPage = 1;

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

  const pageSize = defaultPageSize;

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

    setTimeout(() => {
      setAnnouncementText(`Showing ${startingNumber} to ${endingNumber} of ${totalItems} datasets`);
    }, 100);

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

  if ((data && data.data.total) && totalItems != data.data.total) setTotalItems(data.data.total);

  return (
    <>
      <section className=" dkan-c-site-menu--sub-menu">
        {isPending ? (
          <Spinner
            className="ds-u-valign--middle"
            aria-valuetext="Dataset Search loading"
            role="status"
          />
        ) : (
          <>
            <ol className="dc-dataset-search-list ds-u-padding--0 ds-u-margin-top--0 ds-u-lg-margin-top--2 ds-u-margin-bottom--2 ds-u-display--block" data-testid="results-list">
              {noResults && <Alert variation="error" heading="No results found." />}
              {data && data.data.results ? Object.keys(data.data.results).map((key) => {
                return data.data.results[key];
              }).map((item) => {
                return (
                  <DatasetListSubmenuItem
                    key={item.identifier}
                    title={item.title}
                    identifier={item.identifier}
                    linkClasses={subLinkClasses}
                  />
                )
              }) : (
                <Alert variation="error" heading="Could not connect to the API." />
              )}
            </ol>
            <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center ds-u-border-top--1 ds-u-padding-top--3 ds-u-padding-bottom--2 ds-u-margin-x--3 ds-u-lg-margin-x--0">
              {enablePagination && (
                <>
                  <div className="">
                    <p className="ds-u-margin-y--0 ds-u-font-size--sm" aria-hidden="true">
                      {(currentResultNumbers && data) && (
                        <>
                          Viewing {currentResultNumbers.endingNumber} of {data.data.total}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="">
                    {(data && data.data.total > 0) && (
                      <Link className="ds-u-padding--0 ds-c-button ds-c-button--ghost dkan-c-header--link" to={`../whats-new`}>
                        <span className="ds-text-heading--md"> {`View all ${data.data.total} entries`} </span>
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default withQueryProvider(DatasetListSubmenu);
