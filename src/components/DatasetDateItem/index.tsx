import React from 'react';
import { Tooltip, TooltipIcon } from '@cmsgov/design-system';
import TransformedDate from '../TransformedDate';
type DateType = 'modified' | 'released' | 'refresh';

type DatasetDateItemProps = {
  type: DateType;
  date: string;
  boldLabel?: boolean;
  displayTooltips?: boolean;
};

const DatasetDateItem = (props: DatasetDateItemProps) => {
  const { type, date, boldLabel = false, displayTooltips = true } = props;

  const dateText: Record<DateType, string> = {
    modified: 'Last Modified',
    released: 'Released',
    refresh: 'Planned Update'
  };

  const tooltipContent = {
    modified: (
      <>
        <strong>Last Modified: </strong> The date the <br/>dataset was last updated.
      </>
    ),
    released: (
      <>
        <strong>Released: </strong> The date the most <br/>recent dataset was made available<br/>to the public.
      </>
    ),
    refresh: (
      <>
        <strong>Planned Update:</strong> The date the <br/>dataset is scheduled to be updated.
      </>
    )
  };

  return (
    <div className='dataset-date-item ds-l-sm-col--auto ds-l-col--12 ds-u-padding--0'>
      <span className={`dataset-date-item-label ${boldLabel ? 'ds-u-font-weight--bold' : ''}`}>
        <span>{dateText[type]}</span>: <TransformedDate date={date} />
      </span>
      {displayTooltips === true && (
        <Tooltip
          aria-label={dateText[type]}
          className="ds-c-tooltip__trigger-icon ds-u-display--inline ds-u-padding-left--0 ds-uw-padding-right--0 ds-u-font-weight--normal"
          title={tooltipContent[type]}
          placement="top"
        >
          <TooltipIcon />
        </Tooltip>
      )}
    </div>
  );
};

export default DatasetDateItem; 