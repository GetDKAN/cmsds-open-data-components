import React from 'react';
import DatasetDescription from './index';

const meta = {
  title: 'Components/DatasetDescription',
  component: DatasetDescription,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetDescription component displays a sanitized HTML description for a dataset or distribution.\n        `,
      },
    },
  },
  argTypes: {
    distribution: { control: 'object', description: 'Distribution object.' },
    dataset: { control: 'object', description: 'Dataset object.' },
    resource: { control: 'object', description: 'Resource object.' },
    customDescription: { control: 'function', description: 'Custom description function.' },
    updateAriaLive: { control: 'function', description: 'Aria live update function.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    distribution: {
      data: {
        description: '<strong>Distribution description</strong> with <em>HTML</em>.'
      }
    },
    dataset: {
      identifier: 'ds-001',
      description: 'Fallback dataset description.'
    },
    resource: {},
    customDescription: null,
    updateAriaLive: null,
  },
};
