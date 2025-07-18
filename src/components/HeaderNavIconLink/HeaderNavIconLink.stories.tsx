import React from 'react';
import HeaderNavIconLink, { HeaderNavIconLinkProps } from './index';

export default {
  title: 'Components/HeaderNavIconLink',
  component: HeaderNavIconLink,
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'Destination URL for the icon link.',
      defaultValue: 'https://www.cms.gov',
    },
    urlTitle: {
      control: 'text',
      description: 'Title attribute for the link.',
      defaultValue: 'CMS Home',
    },
    logoFilePath: {
      control: 'text',
      description: 'Image source for the icon.',
      defaultValue: 'https://via.placeholder.com/40x40?text=Logo',
    },
    logoAltText: {
      control: 'text',
      description: 'Alt text for the icon image.',
      defaultValue: 'CMS Logo',
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
    url: 'https://www.cms.gov',
    urlTitle: 'CMS Home',
    logoFilePath: 'https://via.placeholder.com/40x40?text=Logo',
    logoAltText: 'CMS Logo',
    backArrow: false,
  },
  render: (args: HeaderNavIconLinkProps) => <HeaderNavIconLink {...args} />,
};

export const WithBackArrow = {
  args: {
    url: 'https://www.cms.gov',
    urlTitle: 'Back to CMS',
    logoFilePath: 'https://via.placeholder.com/40x40?text=Logo',
    logoAltText: 'CMS Logo',
    backArrow: true,
  },
  render: (args: HeaderNavIconLinkProps) => <HeaderNavIconLink {...args} />,
};
