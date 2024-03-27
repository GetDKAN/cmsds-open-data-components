import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { usePopper } from 'react-popper';
import {
  HelpDrawerToggle,
  Button,
  Tooltip,
  Spinner,
  Accordion,
  AccordionItem,
} from '@cmsgov/design-system';
import DataTablePageResults from '../DataTablePageResults';
import DataTableDensity from '../DataTableDensity';
import ManageColumns from '../ManageColumns';
import DataTableRowChanger from '../DataTableRowChanger';
import DownloadIcon from '../../assets/icons/download';
import CopyIcon from '../../assets/icons/copy';
import SettingsIcon from '../../assets/icons/settings';
import './resource-header.scss';

const ResourceHeader = ({
  setTablePadding,
  id,
  distribution,
  includeFiltered,
  includeDensity,
  includeDownload,
  resource,
  tablePadding,
  downloadUrl,
}) => {
  const md = useMediaQuery({ minWidth: 0, maxWidth: 768 });
  const { limit, offset, count, setLimit, setOffset } = resource;
  const intCount = count ? parseInt(count) : 0;
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <div className="dc-c-resource-header">
      <div className="ds-l-row">
        <div className="ds-l-col--12">
          {includeFiltered && (
            <Link className="ds-c-button ds-c-button--solid" to={`/dataset/${id}/data`}>
              View and filter data
            </Link>
          )}
        </div>
      </div>
      <div className="ds-l-row ds-u-align-items--center">
        <div className="ds-l-col--12 ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
          <div className="ds-u-font-weight--bold">
            <DataTablePageResults
              totalRows={parseInt(intCount)}
              limit={parseInt(limit)}
              offset={parseInt(offset)}
            />
          </div>
          <div className="dc-c-resource-header--buttons">
            {includeDownload && (
              <>
                <Button
                  size="small"
                  className="ds-u-text-align--left ds-u-font-weight--normal ds-u-font-size--base ds-u-margin-right--1"
                  href={downloadUrl}
                >
                  <DownloadIcon />
                  {!md && (
                    <span className="ds-u-font-weight--semibold ds-u-margin-left--1">
                      Download filtered data (CSV)
                    </span>
                  )}
                </Button>

                <Tooltip
                  onOpen={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="ds-c-button ds-c-button--small ds-u-text-align--left ds-u-margin-right--1 display-settings-font"
                  placement="bottom"
                  dialog
                  ariaLabel="Copy link to filtered data"
                  title="Link copied to clipboard"
                >
                  <CopyIcon />
                  {!md && (
                    <span className="ds-u-font-weight--semibold ds-u-margin-left--1">
                      Copy link to filtered data
                    </span>
                  )}
                </Tooltip>
              </>
            )}
            <Tooltip
              className="ds-c-button ds-c-button--small ds-u-text-align--left display-settings-font"
              placement="bottom"
              dialog
              ariaLabel="Display settings"
              title={
                <div className="dc-c-display-settings">
                  <DataTableRowChanger limit={limit} setLimit={setLimit} setOffset={setOffset} />
                  {includeDensity && (
                    <DataTableDensity
                      setTablePadding={setTablePadding}
                      tablePadding={tablePadding}
                    />
                  )}
                </div>
              }
            >
              <SettingsIcon />
              {!md && (
                <span className="ds-u-font-weight--semibold ds-u-margin-left--1">
                  Display settings
                </span>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceHeader;
