import type { Meta, StoryObj } from '@storybook/react';
import ApiRowLimitNotice from './index';

const meta: Meta<typeof ApiRowLimitNotice> = {
  title: 'Components/ApiRowLimitNotice',
  component: ApiRowLimitNotice,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ApiRowLimitNotice component displays important information about API row limits and how to handle 500 responses due to memory exhaustion. It uses an accordion layout to present the warning information in a collapsible format.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiRowLimitNotice>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default ApiRowLimitNotice component with standard styling and content.',
      },
    },
  },
};
