import type { Meta, StoryObj } from '@storybook/react';
import SearchButton from './index';

const meta: Meta<typeof SearchButton> = {
  title: 'Components/SearchButton',
  component: SearchButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SearchButton component displays a search button with optional mobile styling and customizable text. It adapts its appearance based on screen size and the altMobileStyle prop.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchButton>;

export const Default: Story = {
  args: {
    text: 'Search',
    altMobileStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the default search button.'
      }
    }
  }
};

export const Mobile: Story = {
  args: {
    text: 'Search',
    altMobileStyle: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search button with mobile styling.'
      }
    }
  }
};

export const CustomText: Story = {
  args: {
    text: 'Find Data',
    altMobileStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the search button with custom text.'
      }
    }
  }
};
