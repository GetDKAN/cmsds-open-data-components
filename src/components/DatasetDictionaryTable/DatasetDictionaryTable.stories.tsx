import React from 'react';
import DatasetDictionaryTable from './index';

const meta = {
  title: 'Components/DatasetDictionaryTable',
  component: DatasetDictionaryTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetDictionaryTable component displays a filterable and paginated table for dataset dictionary entries.\n        `,
      },
    },
  },
  argTypes: {
    datasetDictionary: { control: 'object', description: 'Array of dataset dictionary items.' },
    pageSize: { control: 'number', description: 'Number of rows per page.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    datasetDictionary: [
      { title: 'id', description: 'Unique identifier for the record.', type: 'integer' },
      { title: 'name', description: 'Name of the entity.', type: 'string' },
      { title: 'created_at', description: 'Creation date.', type: 'date' },
    ],
    pageSize: 2,
  },
};
