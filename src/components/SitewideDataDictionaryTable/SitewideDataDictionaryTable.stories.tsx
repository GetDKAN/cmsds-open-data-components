import type { Meta, StoryObj } from '@storybook/react';
import SitewideDataDictionaryTable from './index';

const meta: Meta<typeof SitewideDataDictionaryTable> = {
  title: 'Components/SitewideDataDictionaryTable',
  component: SitewideDataDictionaryTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SitewideDataDictionaryTable component displays a table of dataset dictionary items with columns for name, title, type, and format. It uses DataDictionaryTable internally and supports pagination via the pageSize prop.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SitewideDataDictionaryTable>;

export const Default: Story = {
  args: {
    datasetDictionary: [
      { name: 'id', title: 'Identifier', type: 'string', format: 'uuid', description: 'Unique identifier for the record.' },
      { name: 'date', title: 'Date', type: 'string', format: 'date', description: 'Date of the record.' },
      { name: 'value', title: 'Value', type: 'number', format: 'float', description: 'Numeric value for the record.' },
    ],
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a table with sample dataset dictionary items.'
      }
    }
  }
};
