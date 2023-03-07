import React from 'react';
import { Pagination } from '@cmsgov/design-system';

const ResourceFooter = ({ resource }) => {
  const { limit, values, offset, count, setOffset } = resource;

  return (
    <div>
      {values.length > 0 && (
        <Pagination
          id="test-default"
          currentPage={Number(offset) / limit + 1}
          totalPages={Math.ceil(Number(count) / limit)}
          onPageChange={(evt, page) => {
            evt.preventDefault();
            setOffset((page - 1) * limit);
          }}
          renderHref={(page) => {
            return "";
          }}
        />
      )}
    </div>
  );
};

export default ResourceFooter;
