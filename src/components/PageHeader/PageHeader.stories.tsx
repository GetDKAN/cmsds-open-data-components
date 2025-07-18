import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './index';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The PageHeader component displays a page header with customizable text in a styled container.
        `,
      },
    },
  },
  argTypes: {
    headerText: {
      control: 'text',
      description: 'Text to display as the page header.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    headerText: 'Sample Page Header',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the page header with sample text.'
      }
    }
  }
};
