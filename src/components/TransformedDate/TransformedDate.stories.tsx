import type { Meta, StoryObj } from '@storybook/react-vite';
import TransformedDate from './index';

const meta: Meta<typeof TransformedDate> = {
  title: 'Components/TransformedDate',
  component: TransformedDate,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The TransformedDate component displays a formatted date string using Intl.DateTimeFormat options.
        `,
      },
    },
  },
  argTypes: {
    date: { control: 'text', description: 'Date string or Date object to format.' },
    options: { control: 'object', description: 'Intl.DateTimeFormat options.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransformedDate>;

export const Default: Story = {
  args: {
    date: '2025-07-18T12:00:00Z',
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    },
  },
};

export const ShortFormat: Story = {
  args: {
    date: '2025-07-18T12:00:00Z',
    options: {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    },
  },
};
