import React, { useContext, useEffect, useState, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '../../common/Tooltip/Tooltip';
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro';
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext';
import { DatasetContentLoading } from '../DatasetContentLoading/DatasetContentLoading';
import './DataTable.scss';

const DataTable = ({ datasetTitle }) => {
  const { filteredTable, filteredResource, activeDensity } = useContext(FilteredDispatch);
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('');
  const [columnResizing, setColumnResizing] = useState([]);
  const resetFeedbackTimer = useRef(undefined);

  const densityMap = {
    Expanded: 'density-1',
    Normal: 'density-2',
    Compact: 'density-3',
  };
  const density = activeDensity
    ? `${densityMap[activeDensity]} -striped -highlight`
    : '-striped -highlight';

  if (!filteredTable || !filteredTable.state) {
    return <DatasetContentLoading />;
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { sortBy },
    pageOptions,
    dispatch,
  } = filteredTable;

  const { count, offset, setOffset, limit, loading } = filteredResource;

  // limit is actually a string causing pagination failures since Javascript would concatenate it
  const goToNext = () => {
    setOffset(offset + Number(limit));
  };
  const goToPrev = () => {
    setOffset(offset - Number(limit));
  };

  const canNextPage = Number(limit) + offset < count;
  // Used to disable all tooltip hover actions while resizing
  let anyIsResizing = false;
  const resizeHandler = () => {
    anyIsResizing = true;
  };
  useEffect(() => {
    if (sortBy.length) {
      // useDataStore needs desc or asc
      const order = sortBy[0].desc === true ? 'desc' : 'asc';
      const sortObject = {
        property: sortBy[0].id,
        order,
      };
      filteredResource.setSort([sortObject]);
    } else {
      filteredResource.setSort([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    if (headerGroups.length) {
      const columns = [];

      headerGroups.forEach((headerGroup) => {
        headerGroup.headers.forEach((column) => {
          columns.push({
            id: column.id,
            resizing: false,
          });
        });
      });

      setColumnResizing(columns);
    }
  }, [headerGroups]);

  const resetFeedback = () => {
    if (resetFeedbackTimer.current) {
      clearTimeout(resetFeedbackTimer.current);
    }

    resetFeedbackTimer.current = setTimeout(() => {
      setAriaLiveFeedback('');
    }, 5000);
  };

  useEffect(() => {
    if (ariaLiveFeedback) {
      resetFeedback();
    }
  }, [ariaLiveFeedback]);

  const currentPage = Number(offset / limit);
  if (loading && !count) {
    return <DatasetContentLoading />;
  }

  // Add comma separators to total page number
  const pageSeparator = pageOptions && pageOptions.length.toLocaleString();

  return (
    <div className={`DataTable dc-datatable -striped -highlight ${density}`}>
      <div className="dc-table-container">
        <PerfectScrollbar>
          <div {...getTableProps()} role="grid" className="dc-table">
            <div className="dc-thead -header" role="rowgroup">
              {headerGroups.map((headerGroup, i) => (
                <div key={i} role="row" {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column, i) => {
                    column.isResizing && resizeHandler();

                    return (
                      <div
                        key={i}
                        style={{ position: 'relative' }}
                        className={cx('th', {
                          '-sort-desc': column.isSortedDesc === true,
                          '-sort-asc': column.isSortedDesc === false,
                          resizeCursor: column.isResizing,
                        })}
                        {...column.getHeaderProps()}
                        aria-sort={
                          column.isSortedDesc === true
                            ? 'descending'
                            : column.isSortedDesc === false
                            ? 'ascending'
                            : undefined
                        }
                      >
                        <Tooltip
                          tooltip={column.Header}
                          customClass="column-title"
                          interactive
                          show="true"
                          trigger={!anyIsResizing ? 'hover' : 'null'}
                        >
                          {column.render('Header')}
                        </Tooltip>
                        {!column.isSorted ? (
                          <Tooltip
                            tooltip="Sort"
                            customClass="sort-icon"
                            trigger={!anyIsResizing ? 'hover' : 'null'}
                          >
                            <button
                              {...column.getSortByToggleProps({ title: undefined })}
                              aria-label={`Sort ${column.Header} column in ascending order`}
                            >
                              <FontAwesomePro icon="sort" aria-hidden />
                            </button>
                          </Tooltip>
                        ) : column.isSortedDesc ? (
                          <Tooltip
                            tooltip="Descending"
                            customClass="sort-icon"
                            trigger={!anyIsResizing ? 'hover' : 'null'}
                          >
                            <button
                              {...column.getSortByToggleProps({ title: undefined })}
                              aria-label={`Reset ${column.Header} column sort order`}
                            >
                              <FontAwesomePro icon="sort-down" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            tooltip="Ascending"
                            customClass="sort-icon"
                            trigger={!anyIsResizing ? 'hover' : 'null'}
                          >
                            <button
                              {...column.getSortByToggleProps({ title: undefined })}
                              aria-label={`Sort ${column.Header} column in descending order`}
                            >
                              <FontAwesomePro icon="sort-up" />
                            </button>
                          </Tooltip>
                        )}
                        <Tooltip
                          tooltip="Resize column"
                          customClass="resizer-container"
                          tooltipClass={`resize-tooltip ${
                            column.isResizing ? 'hide-resize-tooltip' : ''
                          }`}
                          delayHide={0}
                        >
                          <button
                            {...column.getResizerProps()}
                            role=""
                            className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              const thisColumn = columnResizing.filter(
                                (col) => col.id === column.id
                              )[0];

                              switch (e.key) {
                                case 'Enter':
                                case ' ':
                                  e.preventDefault();
                                  e.stopPropagation();

                                  if (thisColumn.resizing) {
                                    setColumnResizing(
                                      columnResizing.map((item) =>
                                        item.id === column.id ? { ...item, resizing: false } : item
                                      )
                                    );

                                    // Dispatch react-table 'columnDoneResizing' event
                                    // We are done resizing
                                    dispatch({
                                      type: 'columnDoneResizing',
                                    });

                                    // Update the user
                                    setAriaLiveFeedback(`${column.Header} dropped.`);
                                  } else {
                                    setColumnResizing(
                                      columnResizing.map((item) =>
                                        item.id === column.id ? { ...item, resizing: true } : item
                                      )
                                    );

                                    // Dispatch react-table 'columnStartResizing' event
                                    // We are going to start resizing
                                    dispatch({
                                      type: 'columnStartResizing',
                                      columnId: column.id,
                                      columnWidth: column.totalWidth,
                                      // We will pass an array for only this column because if we passed
                                      // an array item for all columns, all columns would get resized at once
                                      headerIdWidths: [[column.id, column.totalWidth]],
                                      // clientX values are only available with mouse events so we will use
                                      // column width values to calculate and apply the updated width
                                      clientX: column.width,
                                    });

                                    // Update the user
                                    setAriaLiveFeedback(`${column.Header} grabbed.`);
                                  }
                                  break;

                                case 'Escape':
                                  /* istanbul ignore else */
                                  if (thisColumn.resizing) {
                                    setColumnResizing(
                                      columnResizing.map((item) =>
                                        item.id === column.id ? { ...item, resizing: false } : item
                                      )
                                    );

                                    // Dispatch react-table 'columnDoneResizing' event
                                    // We are done resizing
                                    dispatch({
                                      type: 'columnDoneResizing',
                                    });

                                    // Update the user
                                    setAriaLiveFeedback(`${column.Header} dropped.`);
                                  }
                                  break;

                                case 'ArrowRight':
                                  /* istanbul ignore else */
                                  if (thisColumn.resizing) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const updatedWidth =
                                      Math.round(column.width + 10) > column.maxWidth
                                        ? column.maxWidth
                                        : Math.round(column.width + 10);

                                    // Dispatch react-table 'columnResizing' event
                                    // We are resizing
                                    dispatch({
                                      type: 'columnResizing',
                                      clientX: updatedWidth,
                                    });

                                    // Update the user
                                    setAriaLiveFeedback(
                                      `${column.Header} has been resized. The new width is ${updatedWidth} pixels.`
                                    );
                                  }
                                  break;

                                case 'ArrowLeft':
                                  /* istanbul ignore else */
                                  if (thisColumn.resizing) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const updatedWidth =
                                      Math.round(column.width - 10) < column.minWidth
                                        ? column.minWidth
                                        : Math.round(column.width - 10);

                                    // Dispatch react-table 'columnResizing' event
                                    // We are resizing
                                    dispatch({
                                      type: 'columnResizing',
                                      clientX: updatedWidth,
                                    });

                                    // Update the user
                                    setAriaLiveFeedback(
                                      `${column.Header} has been resized. The new width is ${updatedWidth} pixels.`
                                    );
                                  }
                                  break;
                              }
                            }}
                            onBlur={() => {
                              setColumnResizing(
                                columnResizing.map((item) => ({ ...item, resizing: false }))
                              );

                              // Dispatch react-table 'columnDoneResizing' event
                              // We are done resizing
                              dispatch({
                                type: 'columnDoneResizing',
                              });
                            }}
                            aria-label={`Resize ${column.Header} column`}
                          />
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="dc-thead -filters" role="rowgroup">
              {headerGroups.map((headerGroup, i) => (
                <div key={i} role="row" {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column, i) => {
                    return (
                      <div
                        key={i}
                        style={{ position: 'relative' }}
                        {...column.getHeaderProps()}
                        className={`th ${column.filterValue ? 'filter-value' : null}`}
                      >
                        <div>
                          {column.canFilter ? column.render('Filter') : null}
                          {column.filterValue && (
                            <Tooltip tooltip="Clear text">
                              <button
                                onClick={
                                  /* istanbul ignore next */
                                  () => column.setFilter('')
                                }
                                aria-label="Clear text"
                              >
                                <FontAwesomePro icon="times-circle" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div {...getTableBodyProps()} className="dc-tbody">
              {page.map((row, i) => {
                prepareRow(row);

                return (
                  <div {...row.getRowProps()} key={i} className="tr dc-tr">
                    {row.cells.map((cell, i) => (
                      <div key={i} {...cell.getCellProps()} className="td dc-td">
                        {cell.render('Cell')}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sr-only aria-live-feedback" aria-live="assertive" aria-atomic="true">
            {ariaLiveFeedback}
          </div>
        </PerfectScrollbar>
      </div>
      <div className="pagination-bottom">
        <div className="-pagination">
          <div className="-previous">
            <button
              type="button"
              onClick={() => {
                goToPrev();
              }}
              disabled={offset === 0}
              className="-btn"
            >
              <FontAwesomePro icon="long-arrow-left" aria-hidden />
              Previous <span className="sr-only"></span>
            </button>
          </div>
          <div className="-center" aria-live="assertive" aria-atomic={true}>
            <span className="-pageInfo">
              <span>Page </span>
              <strong>{currentPage + 1}</strong>
              <span> of </span>
              <strong>{pageSeparator}</strong>
              <span className="sr-only"> for {datasetTitle}</span>
            </span>
          </div>
          <div className="-next">
            <button
              type="button"
              onClick={() => {
                goToNext();
              }}
              disabled={!canNextPage}
              className="-btn"
            >
              Next <span className="sr-only"></span>
              <FontAwesomePro icon="long-arrow-right" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  /**
   * Dataset title. Used for UTag logic
   */
  datasetTitle: PropTypes.string,
};
DataTable.displayName = 'DataTable';
export default DataTable;
