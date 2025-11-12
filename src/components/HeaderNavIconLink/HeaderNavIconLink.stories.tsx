import React from 'react';
import HeaderNavIconLink, { HeaderNavIconLinkProps } from './index';
import logoImage from '../../assets/images/CMSGovLogo-O.png';

export default {
  title: 'Components/HeaderNavIconLink',
  component: HeaderNavIconLink,
  decorators: [
    (Story: React.ComponentType) => (
      <div>
        <style>{`
          .dkan-c-header-nav-icon-link img {
            max-width: 120px !important;
            width: 120px !important;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'Destination URL for the icon link.',
      defaultValue: '/',
    },
    urlTitle: {
      control: 'text',
      description: 'Title attribute for the link.',
      defaultValue: 'CMSDS Home',
    },
    logoFilePath: {
      control: 'text',
      description: 'Image source for the icon.',
      defaultValue: logoImage,
    },
    logoAltText: {
      control: 'text',
      description: 'Alt text for the icon image.',
      defaultValue: 'CMSDS Logo',
    },
    backArrow: {
      control: 'boolean',
      description: 'Show back arrow next to the icon.',
      defaultValue: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays a navigation icon link in the header, optionally with a back arrow.'
      }
    }
  },
};

export const Default = {
  args: {
    url: '/',
    urlTitle: 'CMSDS Home',
    logoFilePath: logoImage,
    logoAltText: 'CMSDS Logo',
    backArrow: false,
  },
  render: (args: HeaderNavIconLinkProps) => <HeaderNavIconLink {...args} />,
};

export const WithBackArrow = {
  args: {
    url: '/',
    urlTitle: 'Back to CMS',
    logoFilePath: logoImage,
    logoAltText: 'CMSDS Logo',
    backArrow: true,
  },
  render: (args: HeaderNavIconLinkProps) => <HeaderNavIconLink {...args} />,
};
