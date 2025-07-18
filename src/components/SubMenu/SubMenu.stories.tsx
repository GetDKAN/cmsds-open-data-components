import type { Meta, StoryObj } from '@storybook/react';
import SubMenu from './index';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SubMenu> = {
  title: 'Components/SubMenu',
  component: SubMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SubMenu component displays a navigation menu item with an expandable submenu. It supports static submenu arrays and dynamic submenu lists, and is typically used for site navigation.
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
type Story = StoryObj<typeof SubMenu>;

export const StaticSubMenu: Story = {
  args: {
    link: {
      label: 'Menu',
      submenu: [
        { id: 1, label: 'Home', url: '/', external: false },
        { id: 2, label: 'Docs', url: 'https://docs.example.com', external: true },
        { id: 3, label: 'About', url: '/about', external: false },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a static submenu with three items.'
      }
    }
  }
};
