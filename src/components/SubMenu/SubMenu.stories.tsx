import type { Meta, StoryObj } from '@storybook/react';
import SubMenu from './index';
import DatasetListSubmenu from '../DatasetListSubmenu';
import HeaderContext from '../../templates/Header/HeaderContext';
import { MemoryRouter } from 'react-router-dom';
import { createDatasetListHandlers } from '../../../.storybook/mswHandlers';
import { mockApiResponse } from '../../../__mocks__/mockDatasetSearchResults';

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
      id: 'resources',
      label: 'Resources',
      url: '/resources',
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
      id: 'explore',
      label: 'Explore',
      url: '/explore',
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
      id: 'external',
      label: 'External',
      url: '/external',
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
      id: 'menu',
      label: 'Menu',
      url: '/menu',
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

const MinimalSubmenu = ({ subLinkClasses }: { subLinkClasses?: string }) => (
  <ul style={{ listStyle: 'none', padding: '8px 0' }}>
    <li><a href="/item-1" className={subLinkClasses}>Custom item 1</a></li>
    <li><a href="/item-2" className={subLinkClasses}>Custom item 2</a></li>
  </ul>
);

export const WithDatasetListSubmenu: Story = {
  args: {
    link: {
      id: 'datasets',
      label: 'Datasets',
      url: '/datasets',
      submenu: <DatasetListSubmenu rootUrl="https://data.cms.gov" />,
    },
    linkClasses: '',
    subLinkClasses: '',
    wrapLabel: true,
  },
  parameters: {
    msw: {
      handlers: createDatasetListHandlers(mockApiResponse),
    },
    docs: {
      description: {
        story:
          'Demonstrates passing a `ReactElement` as `link.submenu`. SubMenu renders it via ' +
          '`React.cloneElement`, injecting `subLinkClasses`. `DatasetListSubmenu` is self-wrapped ' +
          'with `withQueryProvider` — no extra `QueryClientProvider` decorator is needed.',
      },
    },
  },
};

export const WithCustomElement: Story = {
  args: {
    link: {
      id: 'custom',
      label: 'Custom',
      url: '/custom',
      submenu: <MinimalSubmenu />,
    },
    linkClasses: '',
    subLinkClasses: 'dkan-c-site-menu--sub-link',
    wrapLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Any component accepting `subLinkClasses?: string` can be passed as `link.submenu`. ' +
          'SubMenu injects the prop via `cloneElement`. No data fetching or MSW required.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    link: {
      id: 'navigation',
      label: 'Navigation',
      url: '/navigation',
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
