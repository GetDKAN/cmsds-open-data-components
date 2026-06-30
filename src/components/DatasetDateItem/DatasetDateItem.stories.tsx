import type { Meta, StoryObj } from '@storybook/react-vite';
import DatasetDateItem from './index';

const meta: Meta<typeof DatasetDateItem> = {
  title: 'Components/DatasetDateItem',
  component: DatasetDateItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Renders a single labeled dataset date (Last Modified, Released, or Planned Update) with an optional explanatory tooltip.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['modified', 'released', 'refresh'],
      description: 'Which date label to display.',
    },
    date: { control: 'text', description: 'Date string (parsable by Date).' },
    boldLabel: { control: 'boolean', description: 'Render the label in bold.' },
    displayTooltips: { control: 'boolean', description: 'Show the explanatory tooltip icon.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetDateItem>;

export const Default: Story = {
  args: {
    type: 'modified',
    date: '2025-07-18T12:00:00Z',
    boldLabel: false,
    displayTooltips: true,
  },
};

export const WithoutTooltip: Story = {
  args: {
    type: 'released',
    date: '2024-01-15T00:00:00Z',
    boldLabel: true,
    displayTooltips: false,
  },
};
