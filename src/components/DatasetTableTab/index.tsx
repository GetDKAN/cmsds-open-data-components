import React, { useState, useContext } from 'react';
import qs from 'qs';
import DataTable from '../Datatable/Datatable';         //dkan datatable
// import DataTable from '../dataset/DataTable/DataTable';       // pdc datatable
import { transformTableSortToQuerySort } from '../../services/useDatastore/transformSorts';
import { buildCustomColHeaders } from '../../templates/FilteredResource/functions';
import { Pagination, Spinner, Alert } from '@cmsgov/design-system';
// import DataTableHeader from '../DatatableHeader';
// import QueryBuilder from '../QueryBuilder';
import DataTableToolbar from '../dataset/DataTableToolbar/DataTableToolbar';
import { DistributionType, ColumnType, ResourceType } from '../../types/dataset';
import DataTableContext from '../../templates/Dataset/DataTableContext';
import ManageColumnsContext from '../ManageColumns/ManageColumnsContext';
import FilteredDatasetResource from '../dataset/DatasetResource/FilteredDatasetResource';
import { filteredDatasetResource } from '../../utilities/data-mocks/data-filteredDatasetResource'
// import { DatasetContext } from '../../context/DatasetContext';
import mockDatasetResponse from '../../utilities/data-mocks/api-response-dataset.json'




export function prepareColumns(columns: any, schema: any) {
  return columns.map((column: any) => ({
    header:
      schema && schema.fields[column].description ? schema.fields[column].description : column,
    accessor: column,
  }));
}

type DatasetTableTabProps = {
  id: string;
  distribution: DistributionType;
  resource: ResourceType;
  rootUrl: string;
  customColumns: Array<ColumnType>;
  dataDictionaryBanner: boolean;
  datasetTableControls: boolean;
};

const datasetContextProviderValue = {
  data: mockDatasetResponse,
  error: null,
  isLoading: true,
  setDatasetState: () => {},
  resetDatasetState: () => {},
}


const componentArgs = {
  fullscreen: false,
  datasetTitle: 'Supplier Directory Data',
  datasetDescription: 'A list of Suppliers that indicates the supplies carried at that location and the supplier\'s Medicare participation status.',
  datasetModified: '2020-05-10',
  datasetReleased: '2020-05-10',
  instanceId: 1
}

const DatasetTable = ({
  isModal = false,
  closeFullScreenModal,
  showQueryBuilder = true,
  showCopyLinkButton = true,
  showDownloadFilteredDataButton = true,
  showDownloadFullDataButton = true,
  showStoredQueryDownloadButton = false,
}: {
  isModal?: boolean;
  closeFullScreenModal?: Function;
  showQueryBuilder?: boolean;
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
  const { page, setPage } = useContext(ManageColumnsContext) as { page: number; setPage: Function };

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
        {/* <DatasetContext.Provider value={datasetContextProviderValue}> */}
          <FilteredDatasetResource resource={filteredDatasetResource} rootUrl={rootUrl}> 
            <DataTableToolbar {...componentArgs} />
            {/* <DataTable /> */}
          </FilteredDatasetResource>
        {/* // </DatasetContext.Provider> */}

        {/* <DataTableToolbar 
        datasetTitle="Test title"
        datasetDescription="A dataset showing all Medicare plan information from CMS."
        datasetModified="2021-11-29"
        datasetReleased="2021-11-29"
        datasetRefresh="2021-11-29"
        instanceId={1}
        /> */}
        {/* <QueryBuilder resource={resource} id={distribution.identifier} customColumns={customColumnHeaders} isModal={isModal} setPage={setPage} setOffset={setOffset} /> */}
        {/* {showQueryBuilder && (
          <QueryBuilder
            resource={resource}
            id={distribution.identifier}
            customColumns={customColumnHeaders}
            isModal={isModal}
            setPage={setPage}
            setOffset={setOffset}
          />
        )} */}
        {dataDictionaryBanner && !isModal && (
          <div>
            <Alert>Click on the "Data Dictionary" tab above for full column definitions</Alert>
          </div>
        )}
        {/* new code that was added */}
        {/* {
          <DataTableHeader
            resource={resource}
            downloadURL={downloadURL}
            unfilteredDownloadURL={distribution.data.downloadURL}
            setPage={setPage}
          
            showCopyLinkButton={showCopyLinkButton}
            showDownloadFilteredDataButton={showDownloadFilteredDataButton}
            showDownloadFullDataButton={showDownloadFullDataButton}
            showStoredQueryDownloadButton={showStoredQueryDownloadButton}
        /> } */}
        <div
          className={`ds-u-border-x--1 ds-u-border-bottom--1 ${
            isModal && 'dkan-datatable-fullscreen-mode'
          }`}
        >
          <DataTable
            canResize={true}
            columns={columns}
            sortTransform={transformTableSortToQuerySort}
            tablePadding={'ds-u-padding-y--2'}
            loading={resource.loading}
            isModal={isModal}
            closeFullScreenModal={closeFullScreenModal}
          />

          


        </div>
        {/* {!resource.loading && resource.count !== null && (
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
        )} */}
      </>
    );
  } else
    return <Spinner aria-valuetext="Dataset loading" role="status" className="ds-u-margin--3" />;
};

export default DatasetTable;
