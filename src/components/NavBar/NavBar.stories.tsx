import type { Meta, StoryObj } from '@storybook/react';
import NavBar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof NavBar> = {
  title: 'Components/NavBar',
  component: NavBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The NavBar component displays a navigation menu with support for submenu items, custom classes, and accessibility features.
        `,
      },
    },
  },
  argTypes: {
    links: {
      control: 'object',
      description: 'Array of navigation links and submenu items.',
    },
    menuName: {
      control: 'text',
      description: 'Name of the menu for accessibility.',
    },
    menuId: {
      control: 'text',
      description: 'Unique ID for the menu.',
    },
    menuClasses: {
      control: 'text',
      description: 'CSS classes for the menu container.',
    },
    linkClasses: {
      control: 'text',
      description: 'CSS classes for the link items.',
    },
    subLinkClasses: {
      control: 'text',
      description: 'CSS classes for the submenu items.',
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
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    links: [
      { id: 'home', label: 'Home', url: '/' },
      { id: 'about', label: 'About', url: '/about' },
      {
        id: 'services',
        label: 'Services',
        submenu: [
          { id: 'consulting', label: 'Consulting', url: '/services/consulting' },
          { id: 'support', label: 'Support', url: '/services/support' },
        ],
      },
    ],
    menuName: 'Main Navigation',
    menuId: 'main',
    menuClasses: 'dkan-c-main-menu',
    linkClasses: 'dc-c-nav-link',
    subLinkClasses: 'dc-c-sub-nav-link',
    wrapLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the navigation bar with sample links and a submenu.'
      }
    }
  }
};
