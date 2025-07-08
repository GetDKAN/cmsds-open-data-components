import React from 'react';
import DatasetDateItem from '../DatasetDateItem';

type DateObject = {
  modified?: string;
  released?: string;
  refresh?: string;
};

type DatasetDateProps = {
  date: DateObject;
  updatedBoldLabel?: boolean;
  releasedBoldLabel?: boolean;
  refreshBoldLabel?: boolean;
  displayTooltips?: boolean;
};

const DatasetDate = (props: DatasetDateProps) => {
  const {
    date,
    updatedBoldLabel = false,
    releasedBoldLabel = false,
    refreshBoldLabel = false,
    displayTooltips = true
  } = props;

  const { modified, released, refresh } = date;

  // Create an array of date items to render
  const dateItems = [];
  
  if (modified) {
    dateItems.push(
      <DatasetDateItem 
        key="modified"
        displayTooltips={displayTooltips} 
        type='modified' 
        date={modified} 
        boldLabel={updatedBoldLabel} 
      />
    );
  }
  
  if (released) {
    dateItems.push(
      <DatasetDateItem 
        key="released"
        displayTooltips={displayTooltips} 
        type='released' 
        date={released} 
        boldLabel={releasedBoldLabel} 
      />
    );
  }
  
  if (refresh) {
    dateItems.push(
      <DatasetDateItem 
        key="refresh"
        displayTooltips={displayTooltips} 
        type='refresh' 
        date={refresh} 
        boldLabel={refreshBoldLabel} 
      />
    );
  }

  return (
    <div className='dataset-date'>
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