import React from 'react';
import LargeFileDialog from './index';

const meta = {
  title: 'Components/LargeFileDialog',
  component: LargeFileDialog,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The LargeFileDialog component displays a button and a dialog warning users about downloading very large files, with options to proceed or cancel.
        `,
      },
    },
  },
  argTypes: {
    downloadUrl: { control: 'text', description: 'URL for the file to download.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    downloadUrl: '/largefile.csv',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the large file download dialog with sample download URL.'
      }
    }
  }
};
