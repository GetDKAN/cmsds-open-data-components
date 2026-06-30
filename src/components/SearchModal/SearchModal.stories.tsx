import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import SearchModal from './index';

const meta: Meta<typeof SearchModal> = {
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
type Story = StoryObj<typeof SearchModal>;

export const Default: Story = {
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

export const CustomHeading: Story = {
  args: {
    headingText: 'Custom Search Heading',
    inversedSearchButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search modal with a custom heading on a non-inverse button.',
      },
    },
  },
};
