import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import FilteredResource from './index';
import { createDatasetPageHandlers } from '../../../.storybook/mswHandlers';

const meta: Meta<typeof FilteredResource> = {
  title: 'Templates/FilteredResource',
  component: FilteredResource,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: createDatasetPageHandlers() },
    docs: {
      description: {
        component: `
The FilteredResource template renders a single dataset distribution with the full filter / sort / pagination UI.
It loads the dataset metadata via \`useMetastoreDataset\` and picks a distribution by index (\`dist_id\`). When the
identifier or dist_id is invalid, it falls back to the \`PageNotFound\` template inline.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    id: { control: 'text', description: 'Dataset identifier passed to useMetastoreDataset.' },
    dist_id: { control: 'text', description: 'Distribution index (number) or the literal "data".' },
    rootUrl: { control: 'text', description: 'Base URL for metastore and datastore requests.' },
    location: { control: false, description: 'Router location — supplies query params for the datastore call.' },
    customColumns: { control: 'object', description: 'Optional column overrides ({header, accessor}).' },
    customTitle: { control: 'text', description: 'Optional title to display above the distribution.' },
    customDescription: { control: false, description: 'Optional render function for the description block.' },
    setDatasetTitle: { control: false, description: 'Callback invoked with the dataset title.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilteredResource>;

const defaultArgs = {
  id: 'wb6u-x2ny',
  dist_id: 0 as unknown as string,
  rootUrl: '/api/1',
  location: { search: '' } as Location,
};

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story: 'First distribution of the mock dataset rendered with filter/sort/download chrome.',
      },
    },
  },
};

export const InvalidDistribution: Story = {
  args: { ...defaultArgs, dist_id: 99 as unknown as string },
  parameters: {
    docs: {
      description: {
        story: 'Invalid `dist_id` — falls back to the inline "Dataset not found" message.',
      },
    },
  },
};
