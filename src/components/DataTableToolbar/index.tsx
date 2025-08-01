import React, { ReactNode } from "react";
import qs from 'qs';
import DataTablePageResults from '../DataTablePageResults';
import { Button, Tooltip, Dropdown } from '@cmsgov/design-system';
import { ResourceType, ConditionType } from '../../types/dataset';
import ManageColumns from "../ManageColumns/ManageColumns";
import FullScreenDataTable from "../FullScreenDataTable";
import FilterDataset from "../FilterDataset";
import FilterChip from "../FilterChip"
import DisplaySettings from "../DisplaySettings";

import "./DataTableToolbar.scss";

type DataTableToolbarProps = {
  resource: ResourceType;
  id: string;
  columns: Array<any>;
  defaultColumnOrder: Array<string>;
  isModal: boolean;
  closeFullScreenModal: Function;
  datasetTableControls: boolean;
  columnVisibility: {
    [key: string]: boolean
  };
  setColumnVisibility: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const updateBrowserURL = (newConditions: Array<ConditionType>) => {
  const url = new URL(window.location.href);
  const urlString = qs.stringify(
    { conditions: newConditions },
    { encodeValuesOnly: true, addQueryPrefix: true }
  );
  window.history.pushState({}, '', `${url.origin}${url.pathname}${urlString}`);
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  resource,
  id,
  columns,
  defaultColumnOrder,
  isModal,
  closeFullScreenModal,
  datasetTableControls,
  columnVisibility,
  setColumnVisibility,
}) => {
  const { limit, offset, count, conditions, setConditions } = resource;
  const intCount = count ? count : 0;
  const rowOptions = [10, 25, 50, 100];
  const hiddenColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key] === false).length;

  const resetColumnVisibility = () => {
    const columns = { ...columnVisibility };

    for (let key in columns) {
      if (columns[key] === false) {
        columns[key] = true;
      }
    }

    setColumnVisibility(columns);

    // save to localStorage
    const currentLocalStorage = JSON.parse(localStorage.getItem(id) as string);
    const updatedLocalStorageData = {
      ...currentLocalStorage,
      tableColumnVisibility: columns
    }

    localStorage.setItem(id, JSON.stringify(updatedLocalStorageData));
  }

  const removeCondition = (index: number) => {
    // just removes the condition from the UI - "Apply Filters" must be clicked to change the data model
    let updatedConditions: ConditionType[] = JSON.parse(JSON.stringify(conditions))
    updatedConditions.splice(index, 1);

    setConditions(updatedConditions);
    updateBrowserURL(updatedConditions);
  };

  return (
    <div className="ds-u-margin-top--2">
      <div className="dkan-filter-dataset-toolbar ds-u-fill--white ds-u-border--1">
        <div className="ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--between">
          <div className="ds-l-col--12 ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center ds-u-flex-wrap--wrap ds-u-padding-y--2">
            <div>
              <div>
                {!resource.loading && resource.count !== null && (
                  <DataTablePageResults
                    totalRows={intCount}
                    limit={limit}
                    offset={offset}
                    className="data-table-results ds-u-margin--0 ds-u-font-size--sm ds-u-padding-y--1"
                  />
                )}
              </div>
            </div>
            {datasetTableControls && (
              <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
                <FilterDataset />
                <ManageColumns id={id} columns={columns} defaultColumnOrder={defaultColumnOrder} />
                <DisplaySettings />
                <FullScreenDataTable isModal={isModal} closeFullScreenModal={closeFullScreenModal} />
              </div>
            )}
            {/*<div className="ds-l-col--12 ds-l-sm-col--4 ds-u-display--flex ds-u-justify-content--end ds-u-padding-x--0">
              <div>
                <Dropdown
                  options={rowOptions.map((row) => ({ label: row.toString(), value: row }))}
                  size="medium"
                  label="Rows per page:"
                  labelClassName="ds-u-margin-top--0"
                  name="datatable_rows_per_page"
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                    setOffset(0);
                  }}
                  value={limit.toString()}
                  defaultValue={limit.toString()}
                />
              </div>
            </div>*/}
          </div>
        </div>
      </div>
      {(conditions.length > 0 || hiddenColumns > 0) && (
        <div className="ds-u-fill--white ds-u-padding-x--2 ds-u-padding-top--2">
          <h2 className="ds-u-margin--0 ds-u-margin-bottom--2 ds-u-font-size--lg ds-u-font-weight--bold">Selected filters</h2>
          <div className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--end">
            <div className="ds-u-display--flex ds-u-padding-right--4 ds-u-flex-wrap--wrap">
              {conditions.length > 0
                ? conditions.map((condition, index) => (
                  <FilterChip
                    iconClass="far fa-filter"
                    text={`"${condition.property}" ${condition.operator} ${condition.value}`}
                    onClick={() => {
                      removeCondition(index);
                    }}
                  />
                ))
                : null}
              {hiddenColumns > 0
                ? <FilterChip
                    iconClass="fa fa-columns"
                    text={`${hiddenColumns} Column${hiddenColumns === 1 ? '' : 's'} Hidden`}
                    onClick={() => {
                      resetColumnVisibility();
                    }}
                  />
                : null
              }
            </div>
            <div className="ds-l-col--auto">
              <button
                className="ds-u-color--primary ds-u-font-size--md ds-u-font-weight--bold ds-u-border--0 ds-u-padding--0 ds-u-margin--0 ds-u-fill--transparent ds-u-text-decoration--underline ds-u-margin-bottom--1"
                onClick={() => {
                  setConditions([]);
                  updateBrowserURL([]);
                  resetColumnVisibility();
                }}
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTableToolbar;
