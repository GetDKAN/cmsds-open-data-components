import React from 'react';
import DataTablePageResults from '../DataTablePageResults';
import { Button, Tooltip } from '@cmsgov/design-system';
import { ResourceType } from '../../types/dataset';

const DataTableHeader = ({ resource, downloadURL, jsonUrl } : {resource: ResourceType, downloadURL: string, jsonUrl: string | undefined}) => {
  const { limit, offset, count } = resource;
  const intCount = count ? count : 0;

  return (
    <div className="ds-l-row ds-u-align-items--center ds-u-margin-bottom--2">
      <div className="ds-l-col--12 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--between ds-u-align-items--center">
        <div>
          <DataTablePageResults
            totalRows={intCount}
            limit={limit}
            offset={offset}
          />
        </div>
        <div className="dc-c-resource-header--buttons ds-l-col--12 ds-l-lg-col--8 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end ds-u-margin-bottom--2 ds-u-md-margin-bottom--0 ds-u-padding-x--0">
          <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-sm-margin-right--2 ds-u-margin-bottom--2 ds-u-sm-margin-bottom--0">
            <Tooltip
              onOpen={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="ds-c-button ds-u-text-align--center ds-u-display--inline-block ds-l-col--12"
              placement="bottom"
              dialog
              ariaLabel="Copy link to filtered data"
              title="Link copied to clipboard"
            >
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-copy"></i> Copy link to filtered data
              </span>
            </Tooltip>
          </div>
          <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0">
            <Button
              className="ds-u-text-align--center ds-u-font-weight--normal ds-u-font-size--base ds-u-margin-right--1 ds-u-display--inline-block ds-l-col--12"
              href={downloadURL}
              aria-label="Download filtered data (CSV)"
            >
              <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                <i className="fas fa-file-csv"></i> Export CSV
              </span>
            </Button>
          </div>
          {jsonUrl && (
            <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-margin-left--2 ds-u-margin-top--2 ds-u-sm-margin-top--0">
              <Button
                className="ds-u-text-align--center ds-u-font-weight--normal ds-u-font-size--base ds-u-margin-right--1 ds-u-display--inline-block ds-l-col--12"
                href={jsonUrl}
                aria-label="Export to .JSON"
              >
                <span className="ds-u-font-weight--semibold ds-u-margin-left--1 ds-u-padding--0">
                  <i className="fas fa-file-code"></i> Export to JSON
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;