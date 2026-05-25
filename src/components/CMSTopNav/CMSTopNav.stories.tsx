import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import CMSTopNav from './index';
import logoImage from '../../assets/images/CMSGovLogo-O.png';

const meta: Meta<typeof CMSTopNav> = {
  title: 'Components/CMSTopNav',
  component: CMSTopNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The CMSTopNav component provides the top navigation bar for CMS websites. It displays the organization logo, tagline, and a horizontal navigation menu with links. The component is responsive and adapts to different screen sizes.
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
type Story = StoryObj<typeof CMSTopNav>;

const sampleOrg = {
  url: '/',
  urlTitle: 'CMSDS',
  logoAltText: 'CMSDS Logo',
  logoFilePath: logoImage,
  tagline: 'CMSDS Tagline',
};

const defaultLinks = [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'About', url: '/about' },
  { id: '3', label: 'Contact', url: '/contact' },
];

export const Default: Story = {
  args: {
    org: sampleOrg,
    links: defaultLinks,
  },
  parameters: {
    docs: {
      description: {
        story: 'The default CMSTopNav component with organization information and navigation links.',
      },
    },
  },
};

export const WithManyLinks: Story = {
  args: {
    org: sampleOrg,
    links: [
      { id: '1', label: 'Home', url: '/' },
      { id: '2', label: 'About', url: '/about' },
      { id: '3', label: 'Services', url: '/services' },
      { id: '4', label: 'Resources', url: '/resources' },
      { id: '5', label: 'News', url: '/news' },
      { id: '6', label: 'Contact', url: '/contact' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A CMSTopNav component with multiple navigation links to demonstrate horizontal scrolling behavior.',
      },
    },
  },
};

export const MinimalOrg: Story = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS',
      tagline: 'CMS',
    },
    links: [
      { id: '1', label: 'Home', url: '/' },
      { id: '2', label: 'About', url: '/about' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A CMSTopNav component with minimal organization information (no logo) and few navigation links.',
      },
    },
  },
};

export const NoLinks: Story = {
  args: {
    org: sampleOrg,
    links: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'A CMSTopNav component with no navigation links, showing only the organization branding.',
      },
    },
  },
};

export const LongTagline: Story = {
  args: {
    org: sampleOrg,
    links: defaultLinks,
  },
  parameters: {
    docs: {
      description: {
        story: 'A CMSTopNav component with a longer tagline to test text wrapping and layout behavior.',
      },
    },
  },
};
