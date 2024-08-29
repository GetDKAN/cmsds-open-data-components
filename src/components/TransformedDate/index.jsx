import React from 'react';

const TransformedDate = ({
  date,
  options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }
}) => {
  const rawDate = new Date(date);
  let modifiedDate = '';
  if (rawDate) {
    modifiedDate = rawDate.toLocaleDateString('en-US', options);
  }
  return <>{modifiedDate}</>;
};

export default TransformedDate;
