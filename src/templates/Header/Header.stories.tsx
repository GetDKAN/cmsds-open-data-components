import type { Meta, StoryObj } from '@storybook/react-vite';
import Header from './index';
import { MemoryRouter } from 'react-router-dom';
import CMSTopNav from '../../components/CMSTopNav';
import HeaderSiteTitle from '../../components/HeaderSiteTitle';
import HeaderNav from '../../components/HeaderNav';
import HeaderSearch from '../../components/HeaderSearch';
import MobileMenuButton from '../../components/MobileMenuButton';
import {
  cmsOrg as sampleOrg,
  cmsOrgWithLogo as sampleOrgWithLogo,
  mainNavLinks,
  navLinksWithSubmenus,
  topNavLinks,
} from '../../../.storybook/fixtures';

const meta: Meta<typeof Header> = {
  title: 'Templates/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Header template provides a flexible, compositional approach to building site headers with responsive behavior.
It manages HeaderContext for mobile menu state and accepts children components for full customization.

Key features:
- Responsive mobile/desktop detection with configurable breakpoint
- Mobile menu state management with accessibility features (focus trap, keyboard navigation)
- Optional top navigation bar (CMSTopNav)
- Composition pattern allows flexible arrangement of HeaderSiteTitle, HeaderNav, HeaderSearch, and MobileMenuButton
- Dark theme support via onDark prop
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
  argTypes: {
    topNav: {
      control: false,
      description: 'Optional CMSTopNav component for organization branding and top-level links.',
    },
    children: {
      control: false,
      description: 'Child components (HeaderSiteTitle, HeaderNav, HeaderSearch, MobileMenuButton) arranged as desired.',
    },
    mobileMaxWidth: {
      control: 'number',
      description: 'Breakpoint in pixels for mobile/desktop detection. Defaults to 768.',
    },
    onDark: {
      control: 'boolean',
      description: 'Enable dark theme styling. Defaults to false.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    mobileMaxWidth: 768,
    onDark: false,
  },
  render: (args) => (
    <Header {...args}>
      <HeaderSiteTitle org={sampleOrg} />
    </Header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal header with just the site title. Demonstrates the basic composition pattern with HeaderSiteTitle as the only child component.',
      },
    },
  },
};

export const WithNavigation: Story = {
  args: {
    mobileMaxWidth: 768,
    onDark: false,
  },
  render: (args) => (
    <Header {...args}>
      <HeaderSiteTitle org={sampleOrg} />
      <HeaderNav links={mainNavLinks} />
      <MobileMenuButton />
    </Header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header with site title and main navigation links. Includes MobileMenuButton for responsive mobile menu toggle. This is a common basic header configuration.',
      },
    },
  },
};

export const WithLogo: Story = {
  args: {
    mobileMaxWidth: 768,
    onDark: false,
  },
  render: (args) => (
    <Header {...args}>
      <HeaderSiteTitle org={sampleOrgWithLogo} />
      <HeaderNav links={mainNavLinks} />
      <MobileMenuButton />
    </Header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header with logo image instead of text title. The HeaderSiteTitle component automatically renders a logo when logoFilePath is provided in the org prop.',
      },
    },
  },
};

export const WithSubmenus: Story = {
  args: {
    mobileMaxWidth: 768,
    onDark: false,
  },
  render: (args) => (
    <Header {...args}>
      <HeaderSiteTitle org={sampleOrg} />
      <HeaderNav links={navLinksWithSubmenus} />
      <MobileMenuButton />
    </Header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header with dropdown submenus in the navigation. Navigation links can include a submenu array to create nested navigation structures.',
      },
    },
  },
};

export const FullFeatured: Story = {
  args: {
    mobileMaxWidth: 768,
    onDark: false,
    topNav: <CMSTopNav org={sampleOrgWithLogo} links={topNavLinks} />,
  },
  render: (args) => (
    <Header {...args}>
      <HeaderSiteTitle org={sampleOrgWithLogo} />
      <HeaderNav links={navLinksWithSubmenus} />
      <HeaderSearch headingText="Search Datasets" />
      <MobileMenuButton />
    </Header>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete header with all features: CMSTopNav, logo, navigation with submenus, search functionality, and mobile menu button. This demonstrates the full capabilities of the Header template.',
      },
    },
  },
};

