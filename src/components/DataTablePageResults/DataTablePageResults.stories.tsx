import React from 'react';
import DataTablePageResults from './DataTablePageResults';

const meta = {
  title: 'Components/DataTablePageResults',
  component: DataTablePageResults,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DataTablePageResults component displays the current range of visible rows and the total number of results in a data table.\n        `,
      },
    },
  },
  argTypes: {
    totalRows: { control: 'number', description: 'Total number of rows.' },
    limit: { control: 'number', description: 'Rows per page.' },
    offset: { control: 'number', description: 'Offset for current page.' },
    className: { control: 'text', description: 'Custom class name.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    totalRows: 100,
    limit: 25,
    offset: 0,
    className: 'data-table-results',
  },
};

export const MiddlePage = {
  args: {
    totalRows: 100,
    limit: 25,
    offset: 25,
    className: 'data-table-results',
  },
};

export const LastPage = {
  args: {
    totalRows: 100,
    limit: 25,
    offset: 75,
    className: 'data-table-results',
  },
};

export const NoResults = {
  args: {
    totalRows: 0,
    limit: 25,
    offset: 0,
    className: 'data-table-results',
  },
};
