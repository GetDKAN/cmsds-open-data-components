import React from 'react';
import DatasetDictionaryPDF from './index';

const meta = {
  title: 'Components/DatasetDictionaryPDF',
  component: DatasetDictionaryPDF,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetDictionaryPDF component displays an iframe to load and display a pdf data dictionary file.\n        `,
      },
    },
  },
  argTypes: {
    datasetDictionaryEndpoing: { control: 'string', description: 'Location of the PDF file' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    datasetDictionaryEndpoint: "test"
  },
  parameters: {
    docs: {
      description: {
        story: 'Note that PDFs from CMS.gov domains will not display on local environments.',
      },
    },
  },
};
