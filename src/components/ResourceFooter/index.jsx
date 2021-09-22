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
   
  function calcPageByOffset(page) {
    setOffset((page - 1) * limit);
  }

  return(
    <div>
      {values.length > 0 &&
        (<Pagination
          totalPages={Math.ceil(Number(count) / limit)}
          currentPage={(Number(offset) / limit) + 1}
          buttonAction={calcPageByOffset}
        />)
        // (<Pagination
        //   currentPage={offset}
        //   totalItems={Number(count)}
        //   itemsPerPage={limit}
        //   gotoPage={}
        //   calcByOffset
        // />)
      }
    </div>
  )
}

export default ResourceFooter;
