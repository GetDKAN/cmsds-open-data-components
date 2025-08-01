import React, { useContext } from 'react';
import qs from 'qs';
import DataTable from '../Datatable/Datatable';
import { transformTableSortToQuerySort } from '../../services/useDatastore/transformSorts';
import { buildCustomColHeaders } from '../../templates/FilteredResource/functions';
import { Pagination, Spinner, Alert } from '@cmsgov/design-system';
import QueryBuilder from '../QueryBuilder';
import { DistributionType, ColumnType, ResourceType } from '../../types/dataset';
import DataTableContext from '../../templates/Dataset/DataTableContext';
import { DataTableActionsContext } from './DataTableActionsContext';

export function prepareColumns(columns: any, schema: any) {
  return columns.map((column: any) => ({
    header:
      schema && schema.fields[column].description ? schema.fields[column].description : column,
    accessor: column,
  }));
}

export type DatasetTableTabProps = {
  id: string;
  distribution: DistributionType;
  resource: ResourceType;
  rootUrl: string;
  customColumns: Array<ColumnType>;
  dataDictionaryBanner: boolean;
  datasetTableControls: boolean;
};

const DatasetTable = ({
  isModal = false,
  closeFullScreenModal,
  showCopyLinkButton = true,
  showDownloadFilteredDataButton = true,
  showDownloadFullDataButton = true,
  showStoredQueryDownloadButton = false,
}: {
  isModal?: boolean;
  closeFullScreenModal?: Function;
  showCopyLinkButton?: boolean;
  showDownloadFilteredDataButton?: boolean;
  showDownloadFullDataButton?: boolean;
  showStoredQueryDownloadButton?: boolean;
}) => {
  const {
    id,
    distribution,
    resource,
    rootUrl,
    customColumns = [],
    dataDictionaryBanner,
  } = useContext(DataTableContext) as DatasetTableTabProps;
  const { page, setPage } = useContext(DataTableActionsContext);

  const defaultPageSize = 10;

  const customColumnHeaders = buildCustomColHeaders(
    customColumns,
    resource.columns,
    resource.schema[distribution.identifier]
  );

  const columns = customColumnHeaders
    ? customColumnHeaders
    : prepareColumns(resource.columns, resource.schema[id]);

  const { limit, setOffset } = resource;
  const pageSize = limit ? limit : defaultPageSize;

  const downloadURL = `${rootUrl}/datastore/query/${id}/0/download?${qs.stringify(
    { conditions: resource.conditions },
    { encode: true }
  )}&format=csv`;

  if (
    Object.keys(resource).length &&
    columns.length &&
    resource.schema &&
    Object.keys(distribution).length
  ) {
    return (
      <>
        <div
          className={isModal ? 'dkan-datatable-fullscreen-mode' : ''}
        >
          <DataTable
            canResize={true}
            columns={columns}
            sortTransform={transformTableSortToQuerySort}
            tablePadding={'ds-u-padding-y--2'}
            loading={resource.loading}
            isModal={isModal}
            closeFullScreenModal={closeFullScreenModal}
            downloadURL={downloadURL}
            unfilteredDownloadURL={distribution.data.downloadURL}
            setPage={setPage}
            showCopyLinkButton={showCopyLinkButton}
            showDownloadFilteredDataButton={showDownloadFilteredDataButton}
            showDownloadFullDataButton={showDownloadFullDataButton}
            showStoredQueryDownloadButton={showStoredQueryDownloadButton}
          />
        </div>
        {!resource.loading && resource.count !== null && (
          <div className="ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end ds-u-md-justify-content--between ds-u-margin-top--2 ds-u-align-items--center">
            <Pagination
              totalPages={Math.ceil(resource.count ? resource.count / pageSize : 1)}
              currentPage={Number(page)}
              onPageChange={(evt, page) => {
                evt.preventDefault();
                setOffset((page - 1) * limit);
                setPage(page);
              }}
              renderHref={(p) => `?page=${p}`}
              className="ds-l-col--12 ds-u-padding-x--0"
            />
          </div>
        )}
      </>
    );
  } else
    return <Spinner aria-valuetext="Dataset loading" role="status" className="ds-u-margin--3" />;
};

export default DatasetTable;
