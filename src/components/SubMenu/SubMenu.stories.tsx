import type { Meta, StoryObj } from '@storybook/react';
import SubMenu from './index';
import HeaderContext from '../../templates/Header/HeaderContext';
import { MemoryRouter } from 'react-router-dom';

const mockHeaderContext = {
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  menuRef: null,
  isMobile: false,
  onDark: false,
};

const SimpleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const meta: Meta<typeof SubMenu> = {
  title: 'Components/SubMenu',
  component: SubMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SubMenu component renders a navigation item with an expandable dropdown menu. It supports static submenu lists (array of link objects) and closes on outside click or focus loss.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <HeaderContext.Provider value={mockHeaderContext}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Story />
            </ul>
          </nav>
        </HeaderContext.Provider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    link: {
      control: 'object',
      description: 'Object containing label and submenu configuration.',
    },
    linkClasses: {
      control: 'text',
      description: 'CSS classes for the main menu button.',
    },
    subLinkClasses: {
      control: 'text',
      description: 'CSS classes for submenu links.',
    },
    wrapLabel: {
      control: 'boolean',
      description: 'Whether to wrap the button label in a span.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SubMenu>;

export const Default: Story = {
  args: {
    link: {
      label: 'Resources',
      submenu: [
        { id: 'datasets', label: 'Datasets', url: '/datasets' },
        { id: 'api', label: 'API', url: '/api' },
        { id: 'about', label: 'About', url: '/about' },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A submenu with a static list of internal links.',
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    link: {
      label: 'Explore',
      submenu: [
        { id: 'datasets', label: 'Datasets', url: '/datasets', icon: <SimpleIcon /> },
        { id: 'topics', label: 'Topics', url: '/topics', icon: <SimpleIcon /> },
        { id: 'publishers', label: 'Publishers', url: '/publishers', icon: <SimpleIcon /> },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A submenu with icons alongside each link. Uses inline SVG icons as replacements for Font Awesome Pro icons.',
      },
    },
  },
};

export const WithExternalLinks: Story = {
  args: {
    link: {
      label: 'External',
      submenu: [
        { id: 'docs', label: 'Documentation', url: 'https://example.com/docs', external: true },
        { id: 'support', label: 'Support', url: 'https://example.com/support', external: true },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A submenu with external links rendered as standard anchor tags.',
      },
    },
  },
};

export const UnwrappedLabel: Story = {
  args: {
    link: {
      label: 'Menu',
      submenu: [
        { id: 'item1', label: 'Item One', url: '/one' },
        { id: 'item2', label: 'Item Two', url: '/two' },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A submenu with wrapLabel set to false, rendering the button label as plain text.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    link: {
      label: 'Navigation',
      submenu: [
        { id: 'home', label: 'Home', url: '/' },
        { id: 'data', label: 'Data', url: '/data' },
      ],
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  decorators: [
    (Story) => (
      <HeaderContext.Provider value={{ ...mockHeaderContext, onDark: true }}>
        <nav style={{ backgroundColor: '#1a1a1a', padding: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <Story />
          </ul>
        </nav>
      </HeaderContext.Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'A submenu rendered on a dark background using the onDark header context.',
      },
    },
  },
};
