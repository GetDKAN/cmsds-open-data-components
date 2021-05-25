import React from 'react';
import Pagination from '../Pagination';
 
const ResourceFooter = ({resource}) => {
  const {
    limit,
    values,
    offset, 
    count,
    setOffset
   } = resource;
  return(
    <div>
      {values.length > 0 &&
        (<Pagination
          currentPage={offset}
          totalItems={Number(count)}
          itemsPerPage={limit}
          gotoPage={setOffset}
          calcByOffset
        />)
      }
    </div>
  )
}

export default ResourceFooter;
