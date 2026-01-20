import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableRow, TableCell, Tooltip, TooltipIcon } from '@cmsgov/design-system';
import { buildRows } from '../DatasetAdditionalInformation';
import Resource from '../Resource';
import { DatasetOverviewPropsType } from '../../types/dataset';

const DatasetOverview = ({ dataset, resource, distributions, metadataMapping, rootUrl, showTags } : DatasetOverviewPropsType) => {
  const md = useMediaQuery({ minWidth: 0, maxWidth: 768 });
  const rows = buildRows(metadataMapping, dataset);

  const tooltips = [
    {
      label: "modified",
      title: "The date the dataset was last updated."
    },
    {
      label: "released",
      title: "The date the most recent dataset was made available to the public."
    },
    {
      label: "issued",
      title: "The date the dataset was first published and made available to the public."
    },
    {
      label: "publisher",
      title: "The entity responsible for publishing the dataset."
    }
  ]

  return (
    <>
      <Resource
        distributions={distributions}
        resource={resource}
        title={dataset.title}
        rootUrl={rootUrl}
      />
      {showTags ? (
        <div className="ds-u-margin-top--3">
          <h2 className="ds-text-heading--2xl">Tags</h2>
          <div className="ds-u-display--flex ds-u-flex-direction--row ds-u-justify-content--start ds-u-flex-wrap--wrap">
          {dataset.keyword?.map(tag => (
            <div key={tag.identifier} className="ds-c-tag ds-u-fill--gray-lighter ds-u-display--inline-block ds-u-padding--1 ds-u-radius ds-u-margin-right--2 ds-u-margin-bottom--2">
              <Link to={`/search?keyword=${tag.data}`} aria-label={`${tag.data} tag - Opens a new search with this filter`} className="ds-u-color--base"> {tag.data} </Link>
            </div>
          ))}
          </div>
        </div>
      ) : ''}
      <div className="dc-c-additional-info-table ds-u-margin-bottom--6 ds-u-margin-top--3 ds-u-padding-left--0 ds-l-lg-col--7 ds-l-md-col--9 ds-l-col--12">
        <h2 className="ds-text-heading--2xl">Additional Information</h2>
        <Table compact stackable stackableBreakpoint="md" warningDisabled>
          <TableBody>
            {rows.map((r) => {
              const tooltip = tooltips.find((item) => item.label === r.label.toLowerCase())
              return (
                <TableRow key={`${r.label}_${dataset.identifier}`}>
                  {md ? (
                    ''
                  ) : (
                    <TableCell component="th" className="ds-u-font-weight--bold">
                      {r.label}
                      {tooltip && <span className="ds-u-font-weight--normal">
                        <Tooltip
                          title={tooltip.title}
                          ariaLabel={r.label}
                          // @ts-ignore
                          style={{ border: 'none', background: 'none' }}
                          maxWidth="400px"
                          placement="auto"
                        >
                        <TooltipIcon />
                        </Tooltip>
                      </span>}
                    </TableCell>
                  )}
                  <TableCell stackedTitle={r.label}>{r.value}</TableCell>
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DatasetOverview;