import type { Meta, StoryObj } from '@storybook/react';
import Footer from './index';
import { MemoryRouter } from 'react-router-dom';
import cmsLogo from '../../assets/images/CMSGovLogo-O.png';
import hhsLogo from '../../assets/images/CMSgov@2x-white-O.png';

const meta: Meta<typeof Footer> = {
  title: 'Templates/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Footer template provides a comprehensive site footer with email signup section, navigation links organized in columns,
social media icons, logos, and utility links. All sections are highly configurable through props.
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
    links: {
      control: 'object',
      description: 'Object containing footerOpenDataToolLinks, footerAdditionalResourcesLinks, and footerUtilityLinks arrays.',
    },
    showEmail: {
      control: 'boolean',
      description: 'Whether to show the email signup section. Defaults to true.',
    },
    emailTitle: {
      control: 'text',
      description: 'Title for the email signup section.',
    },
    emailBody: {
      control: 'text',
      description: 'Body text for the email signup section.',
    },
    emailLink: {
      control: 'text',
      description: 'URL for the email signup button.',
    },
    emailButton: {
      control: 'text',
      description: 'Text for the email signup button.',
    },
    socialMediaLinks: {
      control: 'object',
      description: 'Object with facebook, twitter, linkedin, and youtube properties, each with url and optional title.',
    },
    hhsLogo: {
      control: 'text',
      description: 'URL or import path for HHS logo image.',
    },
    cmsLogo: {
      control: 'text',
      description: 'URL or import path for CMS logo image.',
    },
    trademarkContent: {
      control: false,
      description: 'JSX content for trademark/address information section.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

const defaultLinks = {
  footerOpenDataToolLinks: [
    { id: 'datasets', label: 'Datasets', url: '/datasets', target: '_self' },
    { id: 'api-docs', label: 'API Documentation', url: '/api-docs', target: '_self' },
    { id: 'data-dictionary', label: 'Data Dictionary', url: '/data-dictionary', target: '_self' },
  ],
  footerAdditionalResourcesLinks: [
    { id: 'about', label: 'About', url: '/about', target: '_self' },
    { id: 'contact', label: 'Contact Us', url: '/contact', target: '_self' },
    { id: 'faq', label: 'FAQ', url: '/faq', target: '_self' },
    { id: 'cms-main', label: 'CMS.gov', url: 'https://www.cms.gov/', target: '_blank' },
  ],
  footerUtilityLinks: [
    { id: 'privacy', label: 'Privacy Policy', url: '/privacy', target: '_self' },
    { id: 'accessibility', label: 'Accessibility', url: '/accessibility', target: '_self' },
    { id: 'foia', label: 'FOIA', url: '/foia', target: '_self' },
    { id: 'disclaimer', label: 'Disclaimer', url: '/disclaimer', target: '_self' },
  ],
};

export const Default: Story = {
  args: {
    links: defaultLinks,
    showEmail: true,
    emailTitle: 'Get Email Updates',
    emailBody: 'Sign up to get the latest information from CMS by choosing the topics and frequency of emails that are best for you.',
    emailLink: 'https://public.govdelivery.com/accounts/USCMS/subscriber/new',
    emailButton: 'Sign up for email updates',
    cmsLogo: cmsLogo,
    hhsLogo: hhsLogo,
    socialMediaLinks: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default footer with email signup section, navigation links organized in columns, logos, and utility links. No social media links included.'
      }
    }
  }
};

export const WithSocialMedia: Story = {
  args: {
    links: defaultLinks,
    showEmail: true,
    emailTitle: 'Stay Connected',
    emailBody: 'Subscribe to receive updates about new datasets and API improvements.',
    emailLink: 'https://public.govdelivery.com/accounts/USCMS/subscriber/new',
    emailButton: 'Subscribe',
    cmsLogo: cmsLogo,
    hhsLogo: hhsLogo,
    socialMediaLinks: {
      facebook: {
        url: 'https://www.facebook.com/medicare',
        title: 'CMS Facebook',
      },
      twitter: {
        url: 'https://twitter.com/cmsgov',
        title: 'CMS Twitter',
      },
      linkedin: {
        url: 'https://www.linkedin.com/company/centers-for-medicare-medicaid-services',
        title: 'CMS LinkedIn',
      },
      youtube: {
        url: 'https://www.youtube.com/user/CMSHHSgov',
        title: 'CMS YouTube',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with social media icons for Facebook, Twitter, LinkedIn, and YouTube.'
      }
    }
  }
};

export const WithoutEmailSection: Story = {
  args: {
    links: defaultLinks,
    showEmail: false,
    cmsLogo: cmsLogo,
    hhsLogo: hhsLogo,
    socialMediaLinks: {
      facebook: {
        url: 'https://www.facebook.com/medicare',
      },
      twitter: {
        url: 'https://twitter.com/cmsgov',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer without the email signup section. Set showEmail to false to hide it.'
      }
    }
  }
};
