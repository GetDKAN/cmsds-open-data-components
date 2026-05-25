import type { Meta, StoryObj } from '@storybook/react-vite';
import FullScreenDataTable from './index';
import { withDataTableContexts } from '../../../.storybook/decorators';

const meta: Meta<typeof FullScreenDataTable> = {
  title: 'Components/FullScreenDataTable',
  component: FullScreenDataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toolbar button that opens a full-screen Dialog containing a DatasetTable. Returns null when `isModal` is true to prevent recursive embedding.',
      },
    },
  },
  decorators: [withDataTableContexts()],
  argTypes: {
    isModal: { control: 'boolean', description: 'When true the component renders nothing (prevents nested fullscreen).' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FullScreenDataTable>;

export const Default: Story = {
  args: { isModal: false },
};
