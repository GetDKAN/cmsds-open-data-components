import React from 'react';
import LargeFileInfo from './index';
import { MemoryRouter } from 'react-router-dom';
import { StoryFn } from '@storybook/react';

const meta = {
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
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the large file info message with default styling.'
      }
    }
  }
};
