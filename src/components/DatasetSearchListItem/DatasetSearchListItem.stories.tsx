import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DatasetSearchListItem from './index';

const meta: Meta<typeof DatasetSearchListItem> = {
  title: 'Components/DatasetSearchListItem',
  component: DatasetSearchListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A search-result list entry. Renders title, modified date, description, download button (with optional large-file dialog), and quick links to Data Table, Overview, Data Dictionary, and API.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Story />
        </ul>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    modified: { control: 'text' },
    description: { control: 'text' },
    downloadUrl: { control: 'text' },
    identifier: { control: 'text' },
    largeFile: { control: 'boolean' },
    paginationEnabled: { control: 'boolean' },
    dataDictionaryLinks: { control: 'boolean' },
    showTopics: { control: 'boolean' },
    showDateDetails: { control: 'boolean' },
    updateDateMonthYearOnly: { control: 'boolean' },
    distribution: { control: 'object' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetSearchListItem>;

const csvDistribution = {
  identifier: 'dist-1',
  data: {
    title: 'CSV Download',
    format: 'csv',
    downloadURL: '/files/dataset-1.csv',
    describedBy: '/dictionaries/dataset-1.json',
    describedByType: 'application/vnd.tableschema+json',
  },
};

export const Default: Story = {
  args: {
    title: 'Medicare Provider Utilization and Payment Data',
    modified: '2025-03-15T14:30:00Z',
    description:
      'Provider-level data on services and procedures provided to Medicare beneficiaries, aggregated by Healthcare Common Procedure Coding System (HCPCS) code.',
    downloadUrl: '/files/medicare-provider.csv',
    identifier: 'medicare-provider-utilization',
    largeFile: false,
    paginationEnabled: true,
    dataDictionaryLinks: true,
    distribution: csvDistribution,
  },
};

export const LongDescription: Story = {
  args: {
    ...(Default.args as object),
    description:
      'This dataset contains an extensive description that exceeds the 240-character threshold for truncation. It includes detailed information about the contents, methodology, collection process, update cadence, and intended use cases — all of which would clutter a search result page if shown in full, so the component truncates and shows a See more link to the detail page for users who want the rest.',
  } as Story['args'],
  parameters: {
    docs: { description: { story: 'Description longer than 240 chars triggers truncation with a "See more" link.' } },
  },
};

export const LargeFileWithDialog: Story = {
  args: {
    ...(Default.args as object),
    largeFile: true,
  } as Story['args'],
  parameters: {
    docs: { description: { story: 'When `largeFile` is true the Download button is replaced with a LargeFileDialog warning.' } },
  },
};

export const NonCSVDistribution: Story = {
  args: {
    ...(Default.args as object),
    distribution: {
      identifier: 'dist-2',
      data: { title: 'JSON Download', format: 'json', downloadURL: '/files/dataset.json' },
    },
    dataDictionaryLinks: false,
  } as Story['args'],
  parameters: {
    docs: {
      description: {
        story: 'Non-CSV distribution — the Data Table link becomes a disabled tooltip explaining only CSVs render a table.',
      },
    },
  },
};
