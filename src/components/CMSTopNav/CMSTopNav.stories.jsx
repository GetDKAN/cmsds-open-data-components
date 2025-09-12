import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CMSTopNav from './index';

const meta = {
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

export const Default = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS.gov',
      logoAltText: 'CMS Logo',
      logoFilePath: '/path/to/logo.png',
      tagline: 'Centers for Medicare & Medicaid Services',
    },
    links: [
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About',
        url: '/about',
      },
      {
        id: '3',
        label: 'Contact',
        url: '/contact',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'The default CMSTopNav component with organization information and navigation links.',
      },
    },
  },
};

export const WithManyLinks = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS.gov',
      logoAltText: 'CMS Logo',
      logoFilePath: '/path/to/logo.png',
      tagline: 'Centers for Medicare & Medicaid Services',
    },
    links: [
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About',
        url: '/about',
      },
      {
        id: '3',
        label: 'Services',
        url: '/services',
      },
      {
        id: '4',
        label: 'Resources',
        url: '/resources',
      },
      {
        id: '5',
        label: 'News',
        url: '/news',
      },
      {
        id: '6',
        label: 'Contact',
        url: '/contact',
      },
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

export const MinimalOrg = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS',
      tagline: 'CMS',
    },
    links: [
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About',
        url: '/about',
      },
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

export const NoLinks = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS.gov',
      logoAltText: 'CMS Logo',
      logoFilePath: '/path/to/logo.png',
      tagline: 'Centers for Medicare & Medicaid Services',
    },
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

export const LongTagline = {
  args: {
    org: {
      url: '/',
      urlTitle: 'CMS.gov',
      logoAltText: 'CMS Logo',
      logoFilePath: '/path/to/logo.png',
      tagline: 'Centers for Medicare & Medicaid Services - A Federal Agency within the U.S. Department of Health and Human Services',
    },
    links: [
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About',
        url: '/about',
      },
      {
        id: '3',
        label: 'Contact',
        url: '/contact',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A CMSTopNav component with a longer tagline to test text wrapping and layout behavior.',
      },
    },
  },
};
