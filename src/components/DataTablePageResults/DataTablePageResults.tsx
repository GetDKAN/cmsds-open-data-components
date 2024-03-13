import React from 'react';
import PropTypes from 'prop-types';

type DataTablePageResultsType = {
  totalRows: number;
  limit: number;
  offset: number;
  className: string;
}

const DataTablePageResults = ({
  totalRows, limit, offset, className
}: DataTablePageResultsType) => {
  const numTotalRows = totalRows;
  if (numTotalRows === 0) {
    return <p className={className}>{`0 - 0 of 0 rows`}</p>
  }
  const ofTotal = () => {
    if (limit >= numTotalRows) { return numTotalRows; }
    if (limit + offset >= numTotalRows) { return numTotalRows; }
    if (offset === 0) { return limit; }
    return (offset + limit);
  }
  const page = offset / limit;
  const startTotal = () => (page * limit + 1)
  return (
    <p className={className}>
      Displaying{' '}
      <span className="ds-u-font-weight--bold">{`${startTotal().toLocaleString()} - ${ofTotal().toLocaleString()}`}</span>{' '}
      of <span className="ds-u-font-weight--bold">{`${numTotalRows.toLocaleString()}`}</span>{' '}
      results
    </p>
  );
};

DataTablePageResults.defaultProps = {
  className: 'data-table-results',
};

DataTablePageResults.propTypes = {
  className: PropTypes.string,
  totalRows: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
};

export default DataTablePageResults;