import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableControls from './index';
import { withDataTableContexts } from '../../../.storybook/decorators';

const columnIds = ['npn', 'applicable_plan_year', 'individual_registration_completion_date'];

const makeMockColumns = (visibility: Record<string, boolean> = {}) =>
  columnIds.map((id) => ({
    id,
    getIsVisible: () => visibility[id] !== false,
  }));

const meta: Meta<typeof DataTableControls> = {
  title: 'Components/DataTableControls',
  component: DataTableControls,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bottom-of-table controls bar — surfaces a hidden-columns alert plus the ManageColumns and FullScreenDataTable buttons.',
      },
    },
  },
  decorators: [withDataTableContexts()],
  argTypes: {
    id: { control: 'text' },
    columns: { control: false },
    defaultColumnOrder: { control: 'object' },
    isModal: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableControls>;

export const Default: Story = {
  args: {
    id: 'wb6u-x2ny',
    columns: makeMockColumns() as never,
    defaultColumnOrder: columnIds,
    isModal: false,
  },
};

export const WithHiddenColumns: Story = {
  args: {
    id: 'wb6u-x2ny',
    columns: makeMockColumns({ applicable_plan_year: false }) as never,
    defaultColumnOrder: columnIds,
    isModal: false,
  },
  parameters: {
    docs: {
      description: { story: 'Shows the "1 Columns Hidden" warning alert when any column is not visible.' },
    },
  },
};
