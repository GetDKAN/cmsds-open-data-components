import type { Meta, StoryObj } from '@storybook/react-vite';
import DisplaySettings from './index';
import { withDataTableContexts } from '../../../.storybook/decorators';

const meta: Meta<typeof DisplaySettings> = {
  title: 'Components/DisplaySettings',
  component: DisplaySettings,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toolbar popover that toggles row-height density (expanded / normal / compact) and rows-per-page. Reads/writes the DataTableActionsContext.',
      },
    },
  },
  decorators: [withDataTableContexts()],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DisplaySettings>;

export const Default: Story = {};
