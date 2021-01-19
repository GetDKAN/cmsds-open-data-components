import React, { useEffect } from 'react';
import { Button } from '@cmsgov/design-system';
import { usePagination, buildPageArray } from '@civicactions/data-catalog-services';

const Pagination = ({
  currentPage, totalItems, itemsPerPage, gotoPage,
}) => {
  const {
    pageIndex,
    pages,
    setPageIndex,
    canGoToPrevious,
    canGoToNext,
    goToNext,
    goToPrevious,
  } = usePagination(currentPage, totalItems, itemsPerPage);
  const pageButtons = buildPageArray(pageIndex, 3, pages);
  useEffect(()=> {
    if (pageIndex !== currentPage) {
      gotoPage(pageIndex)
    }
  }, [pageIndex])
  return (
    <div className="dc-pagination ds-u-display--flex ds-u-flex-direction--row ds-u-justify-content--between ds-u-align-items--center">
      <Button
        disabled={!canGoToPrevious}
        className="dc-pagination--previous"
        size="small"
        variation="transparent"
        onClick={() => goToPrevious()}
      >
        Previous
      </Button>
      <ol className="ds-u-display--flex ds-u-flex-direction--row ds-u-padding-x--0">
        {pageButtons.map((p) => {
          if (p === 'end') {
            return (
              <li key={p}>
                <Button
                  className={p === currentPage ? "dc-pagination-current" : ""}
                  size="small"
                  variation="transparent"
                  onClick={() => setPageIndex(pages - 1)}
                >
                  {pages}
                </Button>
              </li>
            )
          } else if (p === 'start') {
            return (
              <li key={p}>
                <Button
                  className={p === currentPage ? "dc-pagination-current" : ""}
                  size="small"
                  variation="transparent"
                  onClick={() => setPageIndex(0)}
                >
                  1
                </Button>
              </li>
            )
          } else if (p === 'filler') {
            return (
              <li key={p + (Math.random() * 10)}>
                <span>...</span>
              </li>
            )
          } else {
            return (
              <li key={p}>
                <Button
                  className={p === currentPage ? "dc-pagination-current" : ""}
                  size="small"
                  variation="transparent"
                  onClick={() => setPageIndex(p)}
                >
                  {p + 1}
                </Button>
              </li>
            )
          }
        })}
      </ol>
      <Button
        disabled={!canGoToNext}
        className="dc-pagination--next"
        size="small"
        variation="transparent"
        onClick={() => goToNext()}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
