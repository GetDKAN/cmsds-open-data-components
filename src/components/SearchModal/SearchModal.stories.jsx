
import React from 'react';
import SearchModal from './index';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/SearchModal',
  component: SearchModal,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SearchModal component displays a modal dialog for searching datasets. It includes a search button, input field, and handles navigation to the datasets page with the search term.
        `,
      },
    },
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

export const Default = {
  args: {
    headingText: 'Dataset Search',
    buttonSize: null,
    inversedSearchButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the default search modal.',
      },
    },
  },
};

export const CustomHeading = {
  args: {
    headingText: 'Custom Search Heading',
    buttonSize: 'medium',
    inversedSearchButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search modal with a custom heading and button size.',
      },
    },
  },
};
