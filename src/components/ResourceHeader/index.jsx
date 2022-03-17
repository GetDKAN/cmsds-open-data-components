import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePopper } from 'react-popper';
import {
  HelpDrawerToggle,
  Button,
  Tooltip,
  Spinner,
  Accordion,
  AccordionItem,
} from '@cmsgov/design-system';
import { DataTablePageResults } from '@civicactions/data-catalog-components';
import DataTableDensity from '../../components/DataTableDensity';
import ManageColumns from '../../components/ManageColumns';
import DataTableRowChanger from '../../components/DataTableRowChanger';

const ResourceHeader = ({
  setTablePadding,
  id,
  distribution,
  includeFiltered,
  includeDensity,
  resource,
  tablePadding,
  downloadUrl,
}) => {
  const { limit, offset, count, setLimit, setOffset } = resource;
  const intCount = count ? parseInt(count) : 0;
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <div>
      <div className="ds-l-row">
        <div className="ds-l-col--12">
          {includeFiltered && (
            <Link className="ds-c-button ds-c-button--primary" to={`/dataset/${id}/data`}>
              View and filter data
            </Link>
          )}
        </div>
      </div>
      <div className="ds-l-row ds-u-align-items--center">
        <div className="ds-l-col--12 ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
          <DataTablePageResults totalRows={intCount} limit={limit} offset={offset} />
          <div>
            <Button
              size="small"
              className="ds-u-text-align--left ds-u-font-weight--normal"
              href={downloadUrl}
            >
              Download filtered data (CSV)
            </Button>
            <Tooltip
              onOpen={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="ds-c-button ds-c-button--small ds-u-text-align--left"
              placement="bottom"
              dialog
              title="Link copied to clipboard"
            >
              Copy link to filtered data
            </Tooltip>

            <Tooltip
              className="ds-c-button ds-c-button--small ds-u-text-align--left"
              placement="bottom"
              dialog
              title={
                <div>
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
              Display settings
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceHeader;
