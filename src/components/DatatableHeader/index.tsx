import React from 'react';
import DataTablePageResults from '../DataTablePageResults';
import { Button, Tooltip, Dropdown } from '@cmsgov/design-system';
import { ResourceType } from '../../types/dataset';

const DataTableHeader = ({ resource, downloadURL, unfilteredDownloadURL, setPage } : {resource: ResourceType, downloadURL: string, unfilteredDownloadURL: string, setPage: Function}) => {
  const { limit, offset, count, conditions, setLimit, setOffset } = resource;
  const intCount = count ? count : 0;
  const rowOptions = [10, 25, 50, 100];

  return (
    <div className="ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--between">
      <div className="dc-c-resource-header--buttons ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end ds-l-col--12 ds-u-margin-top--2 ds-u-padding-x--0">
        <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-margin-bottom--2">
          {conditions && conditions.length ? (
            <Tooltip
              onOpen={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="ds-c-button ds-u-text-align--center ds-u-display--inline-block ds-l-col--12"
              placement="bottom"
              dialog
              ariaLabel="Copy link to filtered data"
              title="Link copied to clipboard"
              aria-disabled={!conditions || conditions.length === 0}
            >
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-copy"></i> Copy link to filtered data
              </span>
            </Tooltip>
          ) : (
            <Button aria-disabled={true} aria-label="Copy link to filtered data" className="ds-c-button ds-u-text-align--center ds-u-display--inline-block ds-l-col--12">
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-copy"></i> Copy link to filtered data
              </span>
            </Button>
          )}

        </div>
        <div className="ds-l-col--12 ds-l-md-col--auto ds-u-padding-x--0 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end">
          <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-sm-margin-left--2 ds-u-margin-bottom--2">
            <Button
              className="ds-u-text-align--center ds-u-font-weight--normal ds-u-font-size--base ds-u-margin-right--1 ds-u-display--inline-block ds-l-col--12"
              href={downloadURL}
              aria-disabled={!conditions || conditions.length === 0}
            >
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-file-csv"></i> Download filtered data (CSV)
              </span>
            </Button>
          </div>
          <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-sm-margin-left--2 ds-u-margin-bottom--2">
            <Button
              className="ds-u-text-align--center ds-u-font-weight--normal ds-u-font-size--base ds-u-margin-right--1 ds-u-display--inline-block ds-l-col--12"
              href={unfilteredDownloadURL}
            >
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-file-csv"></i> Download full dataset (CSV)
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="ds-l-col--12 ds-u-display--flex ds-u-align-items--end ds-u-flex-direction--row-reverse ds-u-sm-flex-direction--row ds-u-padding-x--0 ds-u-margin-bottom--2 ds-u-flex-wrap--wrap">
        <div className="ds-l-col--12 ds-l-sm-col--8 ds-u-padding-x--0">
          {(!resource.loading && resource.count !== null) && (
            <DataTablePageResults
              totalRows={intCount}
              limit={limit}
              offset={offset}
            />
          )}
        </div>
        <div className="ds-l-col--12 ds-l-sm-col--4 ds-u-display--flex ds-u-justify-content--end ds-u-padding-x--0">
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
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;