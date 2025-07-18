import type { Meta, StoryObj } from '@storybook/react';
import NavLink from './index';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof NavLink> = {
  title: 'Components/NavLink',
  component: NavLink,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The NavLink component displays a navigation link using react-router-dom, with customizable label, URL, and styling.
        `,
      },
    },
  },
  argTypes: {
    link: {
      control: 'object',
      description: 'Object containing label and url for the link.',
    },
    className: {
      control: 'text',
      description: 'CSS class for the link.',
    },
    wrapLabel: {
      control: 'boolean',
      description: 'Whether to wrap the label in a span.',
    },
    clickHandler: { table: { disable: true } },
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
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  args: {
    link: { label: 'Home', url: '/' },
    className: 'dc-c-nav-link',
    wrapLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a navigation link to the home page.'
      }
    }
  }
};

export const WrappedLabel: Story = {
  args: {
    link: { label: 'About', url: '/about' },
    className: 'dc-c-nav-link',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a navigation link with the label wrapped in a span.'
      }
    }
  }
};
