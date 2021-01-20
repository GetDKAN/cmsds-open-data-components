import React from 'react';
import PropTypes from 'prop-types';

const DataTableRowDetails = ({ totalRows, limit, offset }) => {
  const ofTotal = () => {
    if (limit >= totalRows) { return totalRows; }
    if (offset === 0) { return limit; }
    return (offset + limit);
  }
  const page = offset / limit;
  const startTotal = () => (page * limit + 1)
  return (
    <p>{`${startTotal()} - ${ofTotal()} of ${totalRows} rows`}</p>
  )
}

DataTableRowDetails.propTypes = {
  totalRows: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}

export default DataTableRowDetails;
