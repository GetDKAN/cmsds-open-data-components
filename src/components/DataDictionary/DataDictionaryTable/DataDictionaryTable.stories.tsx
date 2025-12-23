import React from 'react';
import DataDictionaryTable from './index';

const meta = {
  title: 'Components/DataDictionaryTable',
  component: DataDictionaryTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DataDictionaryTable component displays a paginated, sortable, and filterable table for data dictionary entries.\n        `,
      },
    },
  },
  argTypes: {
    tableColumns: { control: 'object', description: 'Array of column definitions.' },
    tableData: { control: 'object', description: 'Array of row data.' },
    pageSize: { control: 'number', description: 'Number of rows per page.' },
    columnFilters: { control: 'object', description: 'Column filter state.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    tableColumns: [
      { accessorKey: 'field', header: 'Field' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'description', header: 'Description' },
    ],
    tableData: [
      { field: 'id', type: 'integer', description: 'Unique identifier for the record.' },
      { field: 'name', type: 'string', description: 'Name of the entity.' },
      { field: 'created_at', type: 'date', description: 'Creation date.' },
    ],
    pageSize: 2,
    columnFilters: [],
  },
};
