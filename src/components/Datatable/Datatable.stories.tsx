import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTable from './index';
import { mockResource } from '../../../__mocks__/mockResource';
import {
  withDataTableContextsFromArgs,
  defaultDataTableContext,
} from '../../../.storybook/decorators';
import type { DataTableContextType } from '../../templates/Dataset/DataTableContext';

const sampleColumns = [
  { header: 'NPN', accessor: 'npn' },
  { header: 'Plan Year', accessor: 'applicable_plan_year' },
  { header: 'Ind. Registration', accessor: 'individual_registration_completion_date' },
  { header: 'Shop Registration', accessor: 'shop_registration_completion_date' },
];

type StoryArgs = React.ComponentProps<typeof DataTable> & {
  contextOverride?: Partial<DataTableContextType>;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Datatable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Datatable component renders the data grid used inside the Dataset Data Table tab. It expects a parent
\`DataTableContext\` to supply the resource (rows, schema, pagination state) and a \`DataTableActionsContext\`
for column order/visibility and density. Most consumers use \`DatasetTableTab\` instead of this component directly;
these stories cover the table render in isolation.
        `,
      },
    },
  },
  decorators: [withDataTableContextsFromArgs],
  args: {
    columns: sampleColumns,
    canResize: true,
    loading: false,
    isModal: false,
    showDataTableToolbar: false,
  },
  argTypes: {
    columns: { control: 'object', description: 'Column defs ({header, accessor}).' },
    canResize: { control: 'boolean', description: 'Enable column resizing.' },
    loading: { control: 'boolean', description: 'Render the loading spinner.' },
    showDataTableToolbar: { control: 'boolean', description: 'Render the full toolbar above the table.' },
    contextOverride: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    contextOverride: { resource: { ...defaultDataTableContext.resource!, loading: true } },
  },
  parameters: {
    docs: { description: { story: 'Resource is loading — the table renders a spinner overlay.' } },
  },
};

export const Empty: Story = {
  args: {
    contextOverride: {
      resource: { ...mockResource, values: [], count: 0, totalRows: 0 },
    },
  },
  parameters: {
    docs: { description: { story: 'Resource returned zero rows.' } },
  },
};
