import React from 'react';
import type { StoryFn, StoryContext } from '@storybook/react';
import ErrorBoundary from './index';

const ProblemChild = () => {
  throw new Error('Test error!');
};

export default {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  argTypes: {
    component: {
      control: 'boolean',
      description: 'Use component mode for fallback rendering.',
      defaultValue: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Catches errors in child components and displays a fallback UI.'
      }
    }
  },
};

export const Default = {
  args: {
    component: false,
  },
  render: (args: { component?: boolean }) => (
    <ErrorBoundary {...args}>
      <ProblemChild />
    </ErrorBoundary>
  ),
};

export const ComponentMode = {
  args: {
    component: true,
  },
  render: (args: { component?: boolean }) => (
    <ErrorBoundary {...args}>
      <ProblemChild />
    </ErrorBoundary>
  ),
};
