import { createContext } from 'react';
import {DatasetDistributionType, ResourceType, ColumnType } from '../../types/dataset';

// create context
export type DataTableContextType = {
  id: string | null;
  resource?: ResourceType;
  distribution?:DatasetDistributionType;
  rootUrl?: string;
  customColumns?: Array<ColumnType>;
  dataDictionaryBanner?: boolean;
  datasetTableControls?: boolean;
  enableEmptyFilters?: boolean;
  relativeHomeUrlPrepend?: string;
}
const DataTableContext = createContext<DataTableContextType>({ id: null})

export default DataTableContext;
