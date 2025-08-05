import { createContext } from 'react';
import { DistributionType, ResourceType, ColumnType } from '../../types/dataset';

// create context
export type DataTableContextType = {
  id: string | null,
  resource?: ResourceType,
  distribution?: DistributionType,
  rootUrl?: string,
  customColumns?: Array<ColumnType>,
  dataDictionaryBanner?: boolean,
  datasetTableControls?: boolean
}
const DataTableContext = createContext<DataTableContextType>({ id: null})

export default DataTableContext;
