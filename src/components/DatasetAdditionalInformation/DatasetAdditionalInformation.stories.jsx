import React from 'react';
import DatasetAdditionalInformation from './index';

const meta = {
  title: 'Components/DatasetAdditionalInformation',
  component: DatasetAdditionalInformation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetAdditionalInformation component displays a table of additional metadata fields for a dataset.\n        `,
      },
    },
  },
  argTypes: {
    datasetInfo: { control: 'object', description: 'Dataset metadata object.' },
    id: { control: 'text', description: 'Unique dataset id.' },
    metadataMapping: { control: 'object', description: 'Mapping of metadata fields to render functions.' },
  },
  tags: ['autodocs'],
};

export default meta;

const sampleMetadataMapping = {
  publisher: (value) => [{ label: 'Publisher', value }],
  contact: (value) => [{ label: 'Contact', value }],
  releaseDate: (value) => [{ label: 'Release Date', value }],
};

export const Default = {
  args: {
    datasetInfo: {
      publisher: 'CMS',
      contact: 'cms@example.com',
      releaseDate: '2025-07-18',
    },
    id: 'demo-dataset',
    metadataMapping: sampleMetadataMapping,
  },
};
