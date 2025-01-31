import React, { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { TextField, Dropdown, AccordionItem, Button, DropdownChangeObject } from '@cmsgov/design-system';
import { DatasetDictionaryItemType } from '../../types/dataset';
import DataDictionaryTable from '../DataDictionaryTable';
import { Tooltip, TooltipIcon } from '@cmsgov/design-system';
import "./dataDictionary.scss"
import ClearFiltersButton from '../QueryBuilder/ClearFiltersButton';

const DatasetDictionaryTable = ({ datasetDictionary, pageSize} : {datasetDictionary: DatasetDictionaryItemType[], pageSize: number}) => {
  const [titleFilter, setTitleFilter ] = useState("");
  const [typeFilter, setTypeFilter ] = useState("all");
  const columnFilters = useMemo(() => [
    {id: "titleResizable", value: titleFilter},
    {id: "type", value: typeFilter === "all" ? "" : typeFilter}
  ], [titleFilter, typeFilter])

  const tableData = datasetDictionary.map((item) => {
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
      minSize: 132,
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