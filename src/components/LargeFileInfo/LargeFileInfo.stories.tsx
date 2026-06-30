import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import LargeFileInfo from './index';

const meta: Meta<typeof LargeFileInfo> = {
  title: 'Components/LargeFileInfo',
  component: LargeFileInfo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The LargeFileInfo component displays information and recommendations for handling very large dataset files, including download and software advice.
        `,
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'CSS class for the container.' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LargeFileInfo>;

export const Default: Story = {
  args: { className: '' },
  parameters: {
    docs: {
      description: {
        story: 'Displays the large file info message with default styling.',
      },
    },
  },
};
