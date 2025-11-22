import type { Meta, StoryObj } from '@storybook/react';
import Header from './index';
import { MemoryRouter } from 'react-router-dom';
import CMSTopNav from '../../components/CMSTopNav';
import HeaderSiteTitle from '../../components/HeaderSiteTitle';
import HeaderNav from '../../components/HeaderNav';
import HeaderSearch from '../../components/HeaderSearch';
import MobileMenuButton from '../../components/MobileMenuButton';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png';
import type { NavLinkArray } from './index';
import type { OrgType } from '../../types/misc';

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

// Mock data
const sampleOrg: OrgType = {
  url: 'https://www.cms.gov',
  tagline: 'The Centers for Medicare & Medicaid Services',
  urlTitle: 'CMS Open Data',
  logoAltText: 'CMS Logo',
};

const sampleOrgWithLogo: OrgType = {
  ...sampleOrg,
  logoFilePath: cmsLogo,
};

const mainNavLinks: NavLinkArray[] = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'datasets', label: 'Datasets', url: '/datasets' },
  { id: 'api', label: 'API Documentation', url: '/api-docs' },
  { id: 'about', label: 'About', url: '/about' },
];

const navLinksWithSubmenus: NavLinkArray[] = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'datasets', label: 'Datasets', url: '/datasets' },
  {
    id: 'resources',
    label: 'Resources',
    url: '/resources',
    submenu: [
      { id: 'api', label: 'API Documentation', url: '/api-docs' },
      { id: 'dictionary', label: 'Data Dictionary', url: '/data-dictionary' },
      { id: 'guides', label: 'User Guides', url: '/guides' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    url: '/about',
    submenu: [
      { id: 'mission', label: 'Our Mission', url: '/about/mission' },
      { id: 'team', label: 'Team', url: '/about/team' },
      { id: 'contact', label: 'Contact Us', url: '/about/contact' },
    ],
  },
];

const topNavLinks: NavLinkArray[] = [
  { id: 'cms-main', label: 'CMS.gov', url: 'https://www.cms.gov', target: '_blank' },
  { id: 'medicare', label: 'Medicare.gov', url: 'https://www.medicare.gov', target: '_blank' },
  { id: 'medicaid', label: 'Medicaid.gov', url: 'https://www.medicaid.gov', target: '_blank' },
];

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

