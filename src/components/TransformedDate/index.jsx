import React from 'react';

const TransformedDate = ({ date, options }) => {
  const rawDate = new Date(date);
  let modifiedDate = '';
  if (rawDate) {
    modifiedDate = rawDate.toLocaleDateString('en-US', options);
  }
  return <>{modifiedDate}</>;
};

TransformedDate.defaultProps = {
  options: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  },
};

export default TransformedDate;
