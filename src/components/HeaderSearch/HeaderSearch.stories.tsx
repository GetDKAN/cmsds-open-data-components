import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HeaderSearch from './index';
import type { StoryFn, StoryContext } from '@storybook/react';
import type { HeaderSearchProps } from './index';

export default {
  title: 'Components/HeaderSearch',
  component: HeaderSearch,
  tags: ['autodocs'],
  argTypes: {
    headingText: {
      control: 'text',
      description: 'Heading text for the search modal dialog.',
      defaultValue: 'Dataset Search',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays a search button in the header that opens a modal for dataset search.'
      }
    }
  },
  decorators: [
    (Story: StoryFn, context: StoryContext) => <MemoryRouter>{Story(context.args, context)}</MemoryRouter>
  ],
};

export const Default = {
  args: {
    headingText: 'Dataset Search',
  },
  render: (args: HeaderSearchProps) => <HeaderSearch {...args} />,
};

export const CustomHeading = {
  args: {
    headingText: 'Find Your Data',
  },
  render: (args: HeaderSearchProps) => <HeaderSearch {...args} />,
};
