import { useEffect } from 'react';
import DataTableContext from '../Dataset/DataTableContext';
import DataTableStateWrapper from '../../components/DatasetTableTab/DataTableStateWrapper';
import qs from 'qs';
import '../Dataset/dataset.scss';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import useDatastore from '../../services/useDatastore';
import { getFormatType } from '../../utilities/format';
import { ColumnType, DistributionType, ResourceType } from '../../types/dataset';

export default function StoredQueryPage({
  id,
  rootUrl,
  customColumns,
  query,
  distributionIndex = 0,
  defaultPageSize = 25,
  disableTableControls = false
}: {
  id: string;
  rootUrl: string;
  customColumns?: Array<ColumnType>;
  query?: string; 
  distributionIndex?: number;
  defaultPageSize?: number;
  disableTableControls?: boolean;
}) {
  // TODO parse from stored filter
  const options = { conditions: query ? JSON.parse(query) : [] };

  const { dataset, isPending } = useMetastoreDataset(id, rootUrl);

  let distribution = {} as DistributionType;
  let distributions = dataset.distribution ? dataset.distribution : [];
  if (distributions.length) {
    distribution = distributions[distributionIndex];
  }

  const resource = useDatastore('', rootUrl, {
    ...options,
    limit: defaultPageSize,
  }) as ResourceType;

    useEffect(() => {
      const localFileFormat = getFormatType(distribution);
      if (localFileFormat === 'csv') {
        resource.setResource(distribution.identifier);
      }
    }, [distribution]);

  return (
    <DataTableContext.Provider
      value={{
        id: id,
        resource: resource,
        distribution: distribution,
        rootUrl: rootUrl,
        customColumns: customColumns,
        datasetTableControls: !disableTableControls
      }}
    >
      <DataTableStateWrapper showQueryBuilder={false} />
    </DataTableContext.Provider>
  );
}
