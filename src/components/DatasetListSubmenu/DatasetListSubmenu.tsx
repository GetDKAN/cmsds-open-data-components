import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { Spinner, Alert } from '@cmsgov/design-system';
import DatasetListSubmenuItem from '../DatasetListSubmenuItem';
import { useQuery } from '@tanstack/react-query';

import "./dataset-list-submenu.scss";
import { DatasetSubmenuListProps } from '../../types/search';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const DatasetListSubmenu = ({
  rootUrl,
  enablePagination = true,
  defaultPageSize = 4,
  defaultSort = { defaultSort: 'modified', defaultOrder: 'desc' },
  subLinkClasses
}: DatasetSubmenuListProps) => {
  const { ACA } = useContext(ACAContext);

  const [currentResultNumbers, setCurrentResultNumbers] = useState({ total: 0, startingNumber: 0, endingNumber: 0 });
  const [noResults, setNoResults] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = defaultPageSize;

  useEffect(() => {
    if (totalItems <= 0 && currentResultNumbers !== null) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [totalItems, pageSize]);

  let params = {
    sort: defaultSort.defaultSort,
    ['sort-order']: defaultSort.defaultOrder, // Display the default sort order of newest items first.
    ['page-size']: defaultPageSize, // Only show 4 items in the submenu.
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

  let submenuItemsCount = 0;

  if (data) {
    let resultsCount = Object.keys(data.data.results).length;
    // For the submenu pager, If there are fewer than 4 dataset items, display the dataset item count, otherwise, show "Viewing 4..".
    submenuItemsCount = resultsCount > defaultPageSize ? defaultPageSize : resultsCount
  }

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
            <ol className="dc-dataset-search-list ds-u-padding--0 ds-u-margin-top--0 ds-u-lg-margin-top--2 ds-u-margin-bottom--2 ds-u-display--block" data-testid="submenu-results-list">
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
                      {(data) && (
                        <>
                          Viewing {submenuItemsCount} of {data.data.total}
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
