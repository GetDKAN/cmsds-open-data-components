import type { Meta, StoryObj } from '@storybook/react-vite';
import DatasetDescription from './index';

const meta: Meta<typeof DatasetDescription> = {
  title: 'Components/DatasetDescription',
  component: DatasetDescription,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetDescription component displays a sanitized HTML description for a dataset or distribution.
        `,
      },
    },
  },
  argTypes: {
    distribution: { control: 'object', description: 'Distribution object.' },
    dataset: { control: 'object', description: 'Dataset object.' },
    resource: { control: 'object', description: 'Resource object.' },
    customDescription: { control: false, description: 'Custom description function.' },
    updateAriaLive: { control: false, description: 'Aria live update function.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetDescription>;

export const Default: Story = {
  args: {
    distribution: {
      data: {
        description: '<strong>Distribution description</strong> with <em>HTML</em>.',
      },
    } as never,
    dataset: {
      identifier: 'ds-001',
      description: 'Fallback dataset description.',
    } as never,
    resource: {} as never,
    customDescription: undefined,
    updateAriaLive: undefined,
  },
};
