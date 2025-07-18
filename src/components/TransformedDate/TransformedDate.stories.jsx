import React from 'react';
import TransformedDate from './index';

const meta = {
  title: 'Components/TransformedDate',
  component: TransformedDate,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe TransformedDate component displays a formatted date string using Intl.DateTimeFormat options.\n        `,
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

export const Default = {
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

export const ShortFormat = {
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
