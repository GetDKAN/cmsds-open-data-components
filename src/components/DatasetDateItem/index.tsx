import React from 'react';
import moment from 'moment';
import { Tooltip, TooltipIcon } from '@cmsgov/design-system';

type DateType = 'modified' | 'released' | 'refresh';

type DatasetDateItemProps = {
  /**
   * Date label type
   */
  type: DateType;
  /**
   * Date string
   */
  date: string;
  /**
   * Apply bold style to label
   */
  boldLabel?: boolean;
  /**
   * Display tooltips or not
   */
  displayTooltips?: boolean;
};

const DatasetDateItem: React.FC<DatasetDateItemProps> = (props) => {
  const { type, date, boldLabel = false, displayTooltips = true } = props;

  const dateText: Record<DateType, string> = {
    modified: 'Last Modified',
    released: 'Released',
    refresh: 'Planned Update'
  };

  const tooltipContent: Record<DateType, React.ReactNode> = {
    modified: (
      <>
        <strong>Last Modified: </strong> The date the<br/>dataset was last updated.
      </>
    ),
    released: (
      <>
        <strong>Released: </strong> The date the most<br/>recent dataset was made available<br/>to the public.
      </>
    ),
    refresh: (
      <>
        <strong>Planned Update:</strong> The date the<br/>dataset is scheduled to be updated.
      </>
    )
  };

  return (
    <div className={`dataset-date-item${boldLabel ? ' bold-label' : ''}`}>
      <span className='dataset-data-item-label'>
        <span>{dateText[type]}</span>: {moment(date).format('MMMM D, YYYY')}
      </span>
      {displayTooltips === true && (
        <Tooltip
          aria-label={dateText[type]}
          className="ds-c-tooltip__trigger-icon ds-u-display--inline ds-u-padding-left--0 ds-uw-padding-right--0"
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