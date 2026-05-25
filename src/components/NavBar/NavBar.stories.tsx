import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './index';
import { mainNavLinks, navLinksWithSubmenus } from '../../../.storybook/fixtures';

const meta: Meta<typeof NavBar> = {
  title: 'Components/NavBar',
  component: NavBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A generic horizontal navigation menu. Renders an accessible nav with optional dropdown submenus per link.',
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
  argTypes: {
    links: { control: 'object', description: 'Array of NavLinkArray items, with optional `submenu`.' },
    menuName: { control: 'text', description: 'Screen-reader label for the nav.' },
    menuId: { control: 'text', description: 'Used to build CSS class and aria-labelledby id.' },
    menuClasses: { control: 'text', description: 'Additional classes for the ul element.' },
    linkClasses: { control: 'text', description: 'Classes applied to each NavLink.' },
    subLinkClasses: { control: 'text', description: 'Classes applied to submenu links.' },
    wrapLabel: { control: 'boolean', description: 'When true, wraps long submenu labels.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    links: mainNavLinks,
    menuName: 'Main navigation',
    menuId: 'main-nav',
    linkClasses: 'ds-c-button ds-c-button--ghost',
  },
};

export const WithSubmenus: Story = {
  args: {
    links: navLinksWithSubmenus,
    menuName: 'Main navigation',
    menuId: 'main-nav',
    linkClasses: 'ds-c-button ds-c-button--ghost',
    subLinkClasses: 'ds-c-button ds-c-button--ghost ds-u-font-weight--normal',
  },
};
