import type { Meta, StoryObj } from '@storybook/react-vite';
import DatasetDictionaryPDF from './index';

const meta: Meta<typeof DatasetDictionaryPDF> = {
  title: 'Components/DatasetDictionaryPDF',
  component: DatasetDictionaryPDF,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetDictionaryPDF component displays an iframe to load and display a pdf data dictionary file.
        `,
      },
    },
  },
  argTypes: {
    datasetDictionaryEndpoint: { control: 'text', description: 'Location of the PDF file' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetDictionaryPDF>;

export const Default: Story = {
  args: {
    datasetDictionaryEndpoint: 'test',
  },
  parameters: {
    docs: {
      description: {
        story: 'Note that PDFs from CMS.gov domains will not display on local environments.',
      },
    },
  },
};
