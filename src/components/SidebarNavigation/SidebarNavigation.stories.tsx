import type { Meta, StoryObj } from '@storybook/react';
import SidebarNavigation from './index';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SidebarNavigation> = {
  title: 'Components/SidebarNavigation',
  component: SidebarNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SidebarNavigation component displays a sidebar menu with navigation links. It supports mobile and desktop layouts, highlights the active link, and toggles menu visibility on mobile.
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
type Story = StoryObj<typeof SidebarNavigation>;

export const Default: Story = {
  args: {
    title: 'Section Title',
   links: [
      { id: 'home', url: '/', label: 'Home', target: '_self' },
      { id: 'about', url: '/about', label: 'About', target: '_self' },
      { id: 'contact', url: '/contact', label: 'Contact', target: '_self' },
    ],
    mobileMax: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the sidebar navigation with three links in desktop mode.'
      }
    }
  }
};

export const Mobile: Story = {
  args: {
    title: 'Section Title',
    links: [
      { id: 'home', url: '/', label: 'Home', target: '_self' },
      { id: 'about', url: '/about', label: 'About', target: '_self' },
      { id: 'contact', url: '/contact', label: 'Contact', target: '_self' },
    ],
    mobileMax: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the sidebar navigation in mobile mode.'
      }
    }
  }
};
