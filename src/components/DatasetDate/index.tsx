import React from 'react';
import DatasetDateItem from '../DatasetDateItem';
import { JSX } from 'react/jsx-runtime';
import './dataset-date.scss'


type DateObject = {
  modified?: string;
  released?: string;
  refresh?: string;
};

type DatasetDateProps = {
  date: DateObject;
  modifiedBoldLabel?: boolean;
  releasedBoldLabel?: boolean;
  refreshBoldLabel?: boolean;
  displayTooltips?: boolean;
};

const DatasetDate = (props: DatasetDateProps) => {
  const {
    date,
    modifiedBoldLabel = false,
    releasedBoldLabel = false,
    refreshBoldLabel = false,
    displayTooltips = true
  } = props;

  // Create an array of date items to render
  const dateItems: JSX.Element[] = [];
  
  Object.entries(date).forEach(([key, value]) => {
    if (value) {
      const bold = (key === "modified" && modifiedBoldLabel) || (key === "released" && releasedBoldLabel) || (key === "refresh" && refreshBoldLabel);
      dateItems.push(
        <DatasetDateItem
          key={key}
          type={key as any}
          displayTooltips={displayTooltips}
          date={value}
          boldLabel={bold} 
        />
      )
    }
  })

  return (
    <div className='dataset-date ds-u-display--flex ds-u-flex-wrap--wrap ds-u-font-size--sm ds-u-align-items--start'>
      {dateItems.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < dateItems.length - 1 && (
            <span className='bullet-point'>&bull;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DatasetDate; 