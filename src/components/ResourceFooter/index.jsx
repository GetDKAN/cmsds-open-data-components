import React from 'react';
import { ResourceDispatch } from '@civicactions/data-catalog-services';
import Pagination from '../Pagination';
 
const ResourceFooter = ({}) => {
  const {
    limit,
    items,
    offset, 
    totalRows,
    actions } = React.useContext(ResourceDispatch);
  const { setLimit, setOffset } = actions;
  return(
    <div>
      {items.length > 0 &&
        (<Pagination
          currentPage={offset}
          totalItems={Number(totalRows)}
          itemsPerPage={limit}
          gotoPage={setOffset}
          calcByOffset
        />)
      }
    </div>
  )
}

export default ResourceFooter;
