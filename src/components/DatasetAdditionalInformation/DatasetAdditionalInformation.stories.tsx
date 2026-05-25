import type { Meta, StoryObj } from '@storybook/react-vite';
import DatasetAdditionalInformation from './index';

const meta: Meta<typeof DatasetAdditionalInformation> = {
  title: 'Components/DatasetAdditionalInformation',
  component: DatasetAdditionalInformation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetAdditionalInformation component displays a table of additional metadata fields for a dataset.
        `,
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
type Story = StoryObj<typeof DatasetAdditionalInformation>;

const sampleMetadataMapping = {
  publisher: (value: string) => [{ label: 'Publisher', value }],
  contact: (value: string) => [{ label: 'Contact', value }],
  releaseDate: (value: string) => [{ label: 'Release Date', value }],
};

export const Default: Story = {
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
