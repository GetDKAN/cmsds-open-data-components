import React from 'react';
import PropTypes from 'prop-types';
import { calculateDatatablePages } from './functions';

const DataTablePageResults = ({
  totalRows, limit, offset, className
}) => {
  const {startTotal, ofTotal, numTotalRows} = calculateDatatablePages(totalRows, limit, offset);
  return (
    <p className={className}>{`${startTotal()} - ${ofTotal()} of ${numTotalRows.toLocaleString()} rows`}</p>
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