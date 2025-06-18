import React from 'react';
import DatasetDateItem from '../DatasetDateItem';

type DateObject = {
  modified?: string;
  released?: string;
  refresh?: string;
};

type DatasetDateProps = {
  /**
   * Released and modified date strings
   */
  date: DateObject;
  /**
   * Apply bold style to updated label
   */
  updatedBoldLabel?: boolean;
  /**
   * Apply bold style to released label
   */
  releasedBoldLabel?: boolean;
  /**
   * Apply bold style to refresh label
   */
  refreshBoldLabel?: boolean;
  /**
   * Display tooltips or not
   */
  displayTooltips?: boolean;
};

const DatasetDate: React.FC<DatasetDateProps> = (props) => {
  const {
    date,
    updatedBoldLabel = false,
    releasedBoldLabel = false,
    refreshBoldLabel = false,
    displayTooltips = true
  } = props;

  const { modified, released, refresh } = date;

  let count = 0;
  if (released) count++;
  if (modified) count++;
  if (refresh) count++;

  return (
    <div className='dataset-date'>
      {modified && (
        <DatasetDateItem 
          displayTooltips={displayTooltips} 
          type='modified' 
          date={modified} 
          boldLabel={updatedBoldLabel} 
        />
      )}
      {count > 1 && <span className='bullet-point'>&bull;</span>}
      {released && (
        <DatasetDateItem 
          displayTooltips={displayTooltips} 
          type='released' 
          date={released} 
          boldLabel={releasedBoldLabel} 
        />
      )}
      {count > 2 && <span className='bullet-point'>&bull;</span>}
      {refresh && (
        <DatasetDateItem 
          displayTooltips={displayTooltips} 
          type='refresh' 
          date={refresh} 
          boldLabel={refreshBoldLabel} 
        />
      )}
    </div>
  );
};

export default DatasetDate; 