import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from './index';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SearchInput component displays a search field with optional magnifying glass icon and search button. It supports custom placeholder text, dark mode, and event handlers for change, submit, and keydown.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Search the Data',
    showMagnifyingGlass: true,
    showSearchButton: true,
    onDark: false,
    defaultValue: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the default search input with magnifying glass and search button.'
      }
    }
  }
};

export const DarkMode: Story = {
  args: {
    placeholder: 'Search the Data',
    showMagnifyingGlass: true,
    showSearchButton: true,
    onDark: true,
    defaultValue: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search input in dark mode.'
      }
    }
  }
};

export const NoIcons: Story = {
  args: {
    placeholder: 'Type to search...',
    showMagnifyingGlass: false,
    showSearchButton: false,
    onDark: false,
    defaultValue: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search input without icons or button.'
      }
    }
  }
};
