import React from 'react';

const DataTableRowDetails = ({ totalRows, limit, offset, currentPage }) => {
  const ofTotal = () => {
    if (limit >= totalRows) { return totalRows; }
    if (offset === 0) { return limit; }
    return (offset * limit);
  }
  const startTotal = () => (currentPage * limit + 1)
  return (
    <p>{`${startTotal()} - ${ofTotal()} of ${totalRows} rows`}</p>
  )
}

export default DataTableRowDetails;
