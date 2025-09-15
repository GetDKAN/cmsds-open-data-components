import React from 'react';
import DataTableHeader from './index';

const meta = {
  title: 'Components/DatatableHeader',
  component: DataTableHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatatableHeader component displays controls and information for a data table, including download and copy link buttons.\n        `,
      },
    },
  },
  argTypes: {
    resource: { control: 'object', description: 'Resource object for the table.' },
    downloadURL: { control: 'text', description: 'URL for filtered data download.' },
    unfilteredDownloadURL: { control: 'text', description: 'URL for full data download.' },
    setPage: { control: 'function', description: 'Callback to set page.' },
    showCopyLinkButton: { control: 'boolean', description: 'Show copy link button.' },
    showDownloadFilteredDataButton: { control: 'boolean', description: 'Show download filtered data button.' },
    showDownloadFullDataButton: { control: 'boolean', description: 'Show download full data button.' },
    showStoredQueryDownloadButton: { control: 'boolean', description: 'Show stored query download button.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    resource: {
      limit: 25,
      offset: 0,
      count: 100,
      conditions: [],
      setLimit: () => {},
      setOffset: () => {},
    },
    downloadURL: '/download',
    unfilteredDownloadURL: '/download-full',
    setPage: () => {},
    showCopyLinkButton: true,
    showDownloadFilteredDataButton: true,
    showDownloadFullDataButton: true,
    showStoredQueryDownloadButton: false,
  },
};
