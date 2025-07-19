import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import ManageColumns from '../../ManageColumns/ManageColumns';
import DataHeaderButton from './DataHeaderButton';
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext';
import PopoverContent from './PopOverContent';
// import { Popover } from 'react-tiny-popover';
import './DataTableToolbar.scss';
import { useCurrentBreakpointName, useCurrentWidth } from 'react-socks';

const DataTableToolbar = ({
  fullscreen,
  datasetTitle,
  datasetDescription,
  datasetModified,
  datasetReleased,
  datasetRefresh,
  instanceId,
}) => {
  const {
    filteredResource,
    filteredTable,
    initOrder,
    curOrder,
    setCurOrder,
    resetVisibility,
    activeDensity,
    filters,
    setFilters,
    filtersApplied,
    setFiltersApplied,
  } = useContext(FilteredDispatch);
  const { limit, count, offset } = filteredResource;
  const updateRows = (r) => {
    filteredResource.setLimit(r);
  };
  // const currentBreakpoint = useCurrentBreakpointName();
  // const currentWidth = useCurrentWidth();
  // const [showTooltip, setShowTooltip] = useState(false);
  // const displaySettingsContainer = useRef(null);

  // useEffect(() => {
  //   if (!fullscreen && currentWidth < 1200) {
  //     setShowTooltip(true);
  //   } else if (fullscreen && currentWidth < 800) {
  //     setShowTooltip(true);
  //   } else {
  //     setShowTooltip(false);
  //   }
  //   processUrlFilters();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentBreakpoint]);

  // // have columns been reordered from initial order?
  // const checkOrder = (arr1, arr2) => {
  //   if (!arr1 || !arr2) {
  //     return false;
  //   }
  //   for (let i = 0; i < arr1.length; i++) {
  //     if (arr1[i].id !== arr2[i]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  // const reordered = checkOrder(initOrder, curOrder);
  // const resetColumnOrder = () => {
  //   const order = initOrder.map((item) => item.id);
  //   setCurOrder(order);
  //   filteredTable.setColumnOrder(order);
  // };

  // // have columns been hidden?
  // const hidden = filteredTable?.visibleColumns?.length !== initOrder?.length
  // // const hidden = false;
  // const [popoverOpen, setPopoverOpen] = useState(false);
  // const togglePopover = () => {
  //   setPopoverOpen(!popoverOpen);
  // };

  // // Dataset filter
  // const emptyFilter = { column: '', condition: '', value: '' };
  // const [filterOpen, setFilterOpen] = useState(false);
  // const applyConditions = (conditions) => {
  //   if (conditions.length === 0) {
  //     filteredResource.setConditions([]);
  //     return;
  //   }
  //   const mapped = conditions.map((f) => {
  //     if (f.condition === 'LIKE') {
  //       // edge case for contains, we want to add some sql
  //       f.value = `%${f.value}%`;
  //     }
  //     return { property: f.column.toLowerCase(), operator: f.condition, value: f.value };
  //   });
  //   filteredResource.setConditions(mapped);
  // };

  // const applyFilter = (filters) => {
  //   setFiltersApplied(filters);
  //   applyConditions(filters);

  //   const queryParams = new URLSearchParams();

  //   filters.forEach((filter) => {
  //     queryParams.append('column', filter.column);
  //     queryParams.append('condition', filter.condition);
  //     queryParams.append('value', filter.value);
  //   });

  //   // const urlQueryString = queryParams.toString();

  //   const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
  //   window.history.replaceState(null, '', newUrl);
  // };

  // const addFilter = () => {
  //   setFilters((prevFilters) => {
  //     console.log('add Filter called+++++++', prevFilters);
  //     const copied = prevFilters.slice();
  //     return copied.concat([emptyFilter]);
  //   });
  // };

  // // this should not reset visibility.
  // const resetFilters = () => {
  //   setFiltersApplied([]);
  //   setFilters([emptyFilter]);
  //   filteredResource.setConditions([]);
  // };

  // function processUrlFilters() {
  //   const queryString = window.location.search;
  //   const searchParams = new URLSearchParams(queryString);
  //   const numFilters = searchParams.size / 3;
  //   const filters = Array.from({ length: numFilters }, () => ({}));

  //   let i = 0;
  //   searchParams.forEach((value, key) => {
  //     const objectToUpdate = Math.floor(i / 3);
  //     filters[objectToUpdate][key] = value;
  //     i++;
  //   });
  //     setFilters(filters);
  //     applyFilter(filters);
  // }

  // // for filter modal
  // const deleteFilters = (i) => {
  //   if (filters.length === 0) {
  //     resetFilters();
  //     return;
  //   }
  //   setFilters((prevFilters) => {
  //     const copied = prevFilters.slice();
  //     copied.splice(i, 1);
  //     return copied;
  //   });
  // };

  // // delete applied filter, and immediately reflect changes to local filters (filterChips)
  // const deleteFilter = (i) => {
  //   // no deleting last filter
  //   if (filtersApplied.length === 1) {
  //     resetFilters();
  //     return;
  //   }
  //   // we need local filters to reflect this state.
  //   setFiltersApplied((prevFilters) => {
  //     const copied = prevFilters.slice();
  //     copied.splice(i, 1);
  //     setFilters(copied);
  //     applyConditions(copied);
  //     return copied;
  //   });
  // };

  // const updateFilters = (index, type, value) => {
  //   setFilters((prevFilters) => {
  //     const copied = prevFilters.slice();
  //     copied[index][type] = value;
  //     return copied;
  //   });
  // };

  // const filterText =
  //   filtersApplied.length > 0 ? `Edit filters (${filtersApplied.length})` : 'Filter dataset';
  // const filterIcon = filtersApplied.length > 0 ? 'filter-solid' : 'filter';
  // const pageIndex = offset / Number(limit);
  // const total = count || 0;

  return (
    <div>
      <div
        className={`resource-table-header${fullscreen ? ' fullscreen-resource-table-header' : ''}`}
      >
       
        <div
          className={`resource-table-header-container${
            fullscreen ? ' fullscreen-resource-table-header-container' : ''
          }`}
        >
          <h1>test case</h1>
          {/* ChoiceList now only takes types for radio or checkboxes. ChoiceList has been converted to an html select component */}
          <div className={`table-controls${fullscreen ? ' fullscreen-table-controls' : ''}`}></div>
        </div>
      </div>
      <p className="resize-help">
        Activate the column resize button and use the right and left arrow keys to resize a column
        or use your mouse to drag/resize. Press escape to cancel the resizing.
      </p>
    </div>
  );
};

DataTableToolbar.propTypes = {
  /**
   * `true` removes the 'Fullscreen' button.
   * Used when in fullscreen mode
   */
  fullscreen: PropTypes.bool,
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * Dataset description
   */
  datasetDescription: PropTypes.string,
  /**
   * Dataset modified date string
   */
  datasetModified: PropTypes.string,
  /**
   * Dataset released date string
   */
  datasetReleased: PropTypes.string,
  /**
   * Dataset anticipated refresh date string
   */
  datasetRefresh: PropTypes.string,
  /**
   * Unique instance ID.
   * Used to apply a unique classname to display settings wrapper element.
   * Needed for properly scoped logic
   */
  instanceId: PropTypes.number,
};
DataTableToolbar.displayName = 'DataTableToolbar';
export default DataTableToolbar;
