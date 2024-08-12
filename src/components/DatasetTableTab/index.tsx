import React, { useState, useContext } from 'react';
import qs from 'qs';
import DataTable from '../Datatable/Datatable';
import { transformTableSortToQuerySort } from '../../services/useDatastore/transformSorts';
import { buildCustomColHeaders } from '../../templates/FilteredResource/functions';
import { Pagination, Spinner, Alert } from '@cmsgov/design-system';
import DataTableHeader from '../DatatableHeader';
import QueryBuilder from '../QueryBuilder';
import { DistributionType, ColumnType, ResourceType } from '../../types/dataset';
import { DataTableContext } from '../../templates/Dataset';

export function prepareColumns(columns : any, schema : any) {
  return columns.map((column : any) => ({
    header:
      schema && schema.fields[column].description ? schema.fields[column].description : column,
    accessor: column,
  }));
}

type DatasetTableTabProps = {
  id: string,
  distribution: DistributionType,
  resource: ResourceType,
  rootUrl: string,
  customColumns: Array<ColumnType>,
  dataDictionaryBanner: boolean,
  manageColumnsEnabled: boolean,
}

const DatasetTable = ({isModal = false}) => {
  const {id, distribution, resource, rootUrl, customColumns = [], dataDictionaryBanner } = useContext(DataTableContext) as DatasetTableTabProps

  const defaultPage = 1;
  const defaultPageSize = 10;
  const [page, setPage] = useState(defaultPage);

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
        <QueryBuilder resource={resource} id={distribution.identifier} customColumns={customColumnHeaders} />
        {(dataDictionaryBanner && !isModal) && (
          <div>
            <Alert>Click on the "Data Dictionary" tab above for full column definitions</Alert>
          </div>
        )}
        {
          <DataTableHeader
            resource={resource}
            downloadURL={downloadURL}
            unfilteredDownloadURL={distribution.data.downloadURL}
            setPage={setPage}
          /> }
        <div className="ds-u-border-x--1 ds-u-border-bottom--1">
          <DataTable
            canResize={true}
            columns={columns}
            setSort={resource.setSort}
            sortTransform={transformTableSortToQuerySort}
            tablePadding={'ds-u-padding-y--2'}
            loading={resource.loading}
            isModal={isModal}
          />
        </div>
        {!resource.loading && (
          <div className="ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end ds-u-md-justify-content--between ds-u-margin-top--2 ds-u-align-items--center">
            <Pagination
              totalPages={Math.ceil(resource.count ? resource.count / pageSize : 1)}
              currentPage={page}
              onPageChange={(evt, page) => {
                evt.preventDefault();
                setOffset((page - 1) * limit);
                setPage(page);
              }}
              renderHref={(page) => {
                return '';
              }}
              className="ds-l-col--12 ds-u-padding-x--0"
            />
          </div>
        )}
    </>
  ) 
  } else return <Spinner aria-valuetext="Dataset loading" role="status" className="ds-u-margin--3" />;
};

export default DatasetTable;