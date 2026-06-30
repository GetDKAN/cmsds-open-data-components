import type { Meta, StoryObj } from '@storybook/react-vite';
import ResourcePreview from './index';
import { mockResource } from '../../../__mocks__/mockResource';
import {
  withDataTableContextsFromArgs,
} from '../../../.storybook/decorators';
import type { DataTableContextType } from '../../templates/Dataset/DataTableContext';

const resourceId = '32da6993-e045-59e4-823e-a5c2c56c649c';

type StoryArgs = React.ComponentProps<typeof ResourcePreview> & {
  contextOverride?: Partial<DataTableContextType>;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/ResourcePreview',
  component: ResourcePreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Wraps Datatable with schema-aware column preparation. Reads resource + customColumns from DataTableContext and renders a spinner until the schema is available.',
      },
    },
  },
  decorators: [withDataTableContextsFromArgs],
  args: {
    id: resourceId,
    canResize: true,
    showDataTableToolbar: false,
    showInfoShareContainer: false,
    contextOverride: { id: resourceId },
  },
  argTypes: {
    id: { control: 'text', description: 'Resource id (matches a key in resource.schema).' },
    canResize: { control: 'boolean' },
    showDataTableToolbar: { control: 'boolean' },
    showInfoShareContainer: { control: 'boolean' },
    contextOverride: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    contextOverride: {
      id: resourceId,
      resource: { ...mockResource, loading: true, values: [], schema: {} },
    },
  },
  parameters: {
    docs: { description: { story: 'Schema not yet available — renders the spinner fallback.' } },
  },
};
