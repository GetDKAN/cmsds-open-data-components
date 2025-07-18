import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HeaderNav, { HeaderNavProps } from './index';
import HeaderContext from '../../templates/Header/HeaderContext';
import type { StoryFn, StoryContext } from '@storybook/react';

const sampleLinks = [
  {
    id: 'home',
    label: 'Home',
    url: '/',
  },
  {
    id: 'about',
    label: 'About',
    url: '/about',
    submenu: [
      { id: 'team', label: 'Team', url: '/about/team' },
      { id: 'mission', label: 'Mission', url: '/about/mission' },
    ],
  },
];

const sampleTopNavLinks = [
  { id: 'contact', label: 'Contact', url: '/contact' },
  { id: 'help', label: 'Help', url: '/help' },
];

const mockHeaderContext = {
  mobileMenuOpen: true,
  setMobileMenuOpen: () => {},
  menuRef: { current: null },
  isMobile: false,
  onDark: true,
};

export default {
  title: 'Components/HeaderNav',
  component: HeaderNav,
  tags: ['autodocs'],
  argTypes: {
    links: {
      control: 'object',
      description: 'Main navigation links with optional submenus.',
      defaultValue: sampleLinks,
    },
    topNavLinks: {
      control: 'object',
      description: 'Top navigation links.',
      defaultValue: sampleTopNavLinks,
    },
    searchInMobile: {
      control: 'boolean',
      description: 'Show search in mobile view.',
      defaultValue: false,
    },
    wrapperClasses: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper.',
      defaultValue: '',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays the main header navigation with optional submenus and top navigation.'
      }
    }
  },
  decorators: [
    (Story: StoryFn, context: StoryContext) => (
      <MemoryRouter>
        <HeaderContext.Provider value={mockHeaderContext}>
          {Story(context.args, context)}
        </HeaderContext.Provider>
      </MemoryRouter>
    )
  ],
};

export const Default = {
  args: {
    links: sampleLinks,
    topNavLinks: sampleTopNavLinks,
    searchInMobile: false,
    wrapperClasses: '',
  },
  render: (args: HeaderNavProps) => <HeaderNav {...args} />,
};

export const WithSearchInMobile = {
  args: {
    links: sampleLinks,
    topNavLinks: sampleTopNavLinks,
    searchInMobile: true,
    wrapperClasses: '',
  },
  render: (args: HeaderNavProps) => <HeaderNav {...args} />,
};
