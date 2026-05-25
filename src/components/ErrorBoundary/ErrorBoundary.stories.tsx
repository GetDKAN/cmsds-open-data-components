import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorBoundary from './index';

const ProblemChild = () => {
  throw new Error('Test error!');
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Catches errors in child components and displays a fallback UI.',
      },
    },
  },
  argTypes: {
    component: {
      control: 'boolean',
      description: 'Use component mode for fallback rendering.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: { component: false },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ProblemChild />
    </ErrorBoundary>
  ),
};

export const ComponentMode: Story = {
  args: { component: true },
  render: (args) => (
    <ErrorBoundary {...args}>
      <ProblemChild />
    </ErrorBoundary>
  ),
};
