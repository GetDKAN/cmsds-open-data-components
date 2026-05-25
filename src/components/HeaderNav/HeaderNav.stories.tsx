import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import HeaderContext from '../../templates/Header/HeaderContext';
import HeaderNav from './index';
import {
  mainNavLinks,
  navLinksWithSubmenus,
  topNavLinks,
} from '../../../.storybook/fixtures';

const HeaderContextDecorator =
  (overrides: Partial<React.ContextType<typeof HeaderContext>> = {}) =>
  (Story: React.FC) => {
    const menuRef = useRef(null);
    return (
      <MemoryRouter>
        <HeaderContext.Provider
          value={{
            mobileMenuOpen: false,
            setMobileMenuOpen: () => {},
            menuRef,
            isMobile: false,
            onDark: true,
            ...overrides,
          }}
        >
          <div style={{ background: '#112e51', padding: '1rem' }}>
            <Story />
          </div>
        </HeaderContext.Provider>
      </MemoryRouter>
    );
  };

const meta: Meta<typeof HeaderNav> = {
  title: 'Components/HeaderNav',
  component: HeaderNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Site-wide main navigation rendered inside the Header template. Reads mobile/desktop state from HeaderContext and renders submenus, optional top nav links, and an optional mobile search.',
      },
    },
  },
  argTypes: {
    links: { control: 'object', description: 'Primary nav links (may include submenus).' },
    topNavLinks: { control: 'object', description: 'Optional secondary top-nav links.' },
    searchInMobile: { control: 'boolean', description: 'Render a HeaderSearch in mobile mode.' },
    wrapperClasses: { control: 'text', description: 'Extra classes for the nav wrapper.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeaderNav>;

export const Default: Story = {
  args: { links: mainNavLinks },
  decorators: [HeaderContextDecorator()],
};

export const WithSubmenusAndTopNav: Story = {
  args: { links: navLinksWithSubmenus, topNavLinks },
  decorators: [HeaderContextDecorator()],
};

export const MobileOpen: Story = {
  args: { links: mainNavLinks, searchInMobile: true },
  decorators: [HeaderContextDecorator({ isMobile: true, mobileMenuOpen: true })],
  parameters: {
    docs: {
      description: {
        story:
          'Mobile state with the menu open. HeaderContext is overridden to simulate the responsive breakpoint without resizing the viewport.',
      },
    },
  },
};
