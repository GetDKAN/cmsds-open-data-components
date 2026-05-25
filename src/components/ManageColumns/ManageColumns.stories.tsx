import type { Meta, StoryObj } from '@storybook/react-vite';
import ManageColumns from './ManageColumns';
import { withDataTableContexts } from '../../../.storybook/decorators';

const columnIds = ['npn', 'applicable_plan_year', 'individual_registration_completion_date', 'shop_end_date'];

const makeMockColumns = (visibility: Record<string, boolean> = {}) =>
  columnIds.map((id) => ({
    id,
    getIsVisible: () => visibility[id] !== false,
  }));

const meta: Meta<typeof ManageColumns> = {
  title: 'Components/ManageColumns',
  component: ManageColumns,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toolbar button that opens a dialog for reordering and toggling visibility of data table columns. Reads/writes the DataTableActionsContext and persists per-dataset state to localStorage.',
      },
    },
  },
  decorators: [withDataTableContexts({}, { columnOrder: columnIds })],
  argTypes: {
    id: { control: 'text', description: 'Dataset id (used as the localStorage key).' },
    columns: { control: false },
    defaultColumnOrder: { control: 'object' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ManageColumns>;

export const Default: Story = {
  args: {
    id: 'wb6u-x2ny',
    columns: makeMockColumns() as never,
    defaultColumnOrder: columnIds,
  },
};
