import React, { useState, useMemo, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import axios from 'axios';
import { createColumnHelper } from '@tanstack/react-table';
import { TextField, Dropdown, AccordionItem, Button, DropdownChangeObject, Tooltip, TooltipIcon } from '@cmsgov/design-system';
import { DatasetDictionaryItemType } from '../../../types/dataset';
import DataDictionaryTable from '../DataDictionaryTable';
import "./dataDictionaryJSON.scss"
import ClearFiltersButton from '../../QueryBuilder/ClearFiltersButton';
import { acaToParams } from '../../../utilities/aca';
import { ACAContext } from '../../../utilities/ACAContext';

const DatasetDictionaryTable = ({ datasetDictionaryEndpoint, pageSize, showDownloadButton} : {datasetDictionaryEndpoint: string, pageSize: number, showDownloadButton: boolean}) => {
  const [titleFilter, setTitleFilter ] = useState("");
  const [typeFilter, setTypeFilter ] = useState("all");
  const columnFilters = useMemo(() => [
    {id: "titleResizable", value: titleFilter},
    {id: "type", value: typeFilter === "all" ? "" : typeFilter}
  ], [titleFilter, typeFilter])

  const {ACA} = useContext(ACAContext);

    const {data} = useQuery({
    queryKey: ["dictionary" + datasetDictionaryEndpoint],
    queryFn: () => {
      return axios.get(`${datasetDictionaryEndpoint}?${qs.stringify(acaToParams({}, ACA))}`)
        .then((res) => res.data)
        .catch((error) => console.error(error))
    },
    enabled: datasetDictionaryEndpoint !== undefined
  });

  const datasetDictionary = data && data.data && data.data.fields && data.data.fields.length ? data.data.fields : null;
  if(!datasetDictionary) return <></>;

  const tableData = datasetDictionary.map((item : {title: string, description: string, type: string}) => {
    return {
      titleResizable: item.title,
      description: item.description,
      type: item.type
    }
  })

  const columnHelper = createColumnHelper<DatasetDictionaryItemType>()
  const tableColumns = [
    columnHelper.accessor('titleResizable', {
      header: () => (
        <div className="dc-c-tooltip-width-override">
          Title
          <Tooltip
            title={"Title represents the column headers of the data file"}
            // @ts-ignore
            style={{ border: 'none', background: 'none' }}
            maxWidth="400px"
          >
            <TooltipIcon />
          </Tooltip>
        </div>
      ),
      size: 300,
      minSize: 132
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      minSize: 600,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      size: 150,
      enableResizing: false
    }),
  ];

  const typeOptions = [
    {value: 'all', label: 'All Types'},
    {value: 'string', label: 'String'},
    {value: 'date', label: 'Date'},
    {value: 'datetime', label: 'Datetime'},
    {value: 'year', label: 'Year'},
    {value: 'integer', label: 'Integer'},
    {value: 'number', label: 'Number'},
    {value: 'boolean', label: 'Boolean'}
  ];

  return ( 
    <>
      <div className="ds-u-margin-bottom--1 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end">
        <Button className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4" onClick={() => window.open(datasetDictionaryEndpoint)} type="button" >
          <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i> View Dictionary JSON
        </Button>
        {showDownloadButton && (
          <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-top--2 ds-u-sm-margin-top--0 ds-u-padding--0 ds-u-sm-padding-left--2">
            <a
              href={datasetDictionaryEndpoint + "/csv"}
              className="ds-c-button"
              style={{width: '100%'}}
            >
              <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i>
              Download Dictionary CSV
            </a>
          </div>
        )}
      </div>
      <div className="dc-query-builder ds-u-margin-bottom--3">
        <div className="ds-c-accordion ds-c-accordion--bordered">
          <AccordionItem
            heading={"Data Dictionary Filters"}
            defaultOpen={true}
          >
            <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
              <TextField
                className="ds-l-col--12 ds-l-sm-col--6"
                labelClassName="ds-u-margin-top--1 ds-u-sm-margin-top--0"
                label="Title"
                value={titleFilter}
                name="dc-data-dictionary-title"
                onChange={(e: Event) => setTitleFilter((e.target as HTMLInputElement).value)}
              />
              <div className="ds-l-col--12 ds-l-sm-col--6">
                <Dropdown
                  labelClassName="ds-u-margin-top--1 ds-u-sm-margin-top--0"
                  options={typeOptions}
                  label="Type"
                  value={typeFilter}
                  name="dc-data-dictionary-type"
                  onChange={(e: DropdownChangeObject) => setTypeFilter(e.target.value)}
                />
              </div>
              <div className="ds-u-float--right ds-u-padding-y--2 ds-l-col--12 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end">
                <div className="ds-u-display--flex ds-u-justify-content--end ds-l-col--12 ds-l-md-col--6 ds-u-padding-x--0">
                  <ClearFiltersButton
                    clearFiltersFn={() => {
                      setTitleFilter("");
                      setTypeFilter("all");
                    }} />
                </div>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
      <DataDictionaryTable tableColumns={tableColumns} tableData={tableData} pageSize={pageSize} columnFilters={columnFilters} />
    </>
  )
}

export default DatasetDictionaryTable;