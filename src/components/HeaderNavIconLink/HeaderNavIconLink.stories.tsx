import type { Meta, StoryObj } from '@storybook/react-vite';
import HeaderNavIconLink from './index';
import logoImage from '../../assets/images/CMSGovLogo-O.png';

const meta: Meta<typeof HeaderNavIconLink> = {
  title: 'Components/HeaderNavIconLink',
  component: HeaderNavIconLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays a navigation icon link in the header, optionally with a back arrow.',
      },
    },
  },
  argTypes: {
    url: { control: 'text', description: 'Destination URL for the icon link.' },
    urlTitle: { control: 'text', description: 'Title attribute for the link.' },
    logoFilePath: { control: 'text', description: 'Image source for the icon.' },
    logoAltText: { control: 'text', description: 'Alt text for the icon image.' },
    backArrow: { control: 'boolean', description: 'Show back arrow next to the icon.' },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderNavIconLink>;

export const Default: Story = {
  args: {
    url: '/',
    urlTitle: 'CMSDS Home',
    logoFilePath: logoImage,
    logoAltText: 'CMSDS Logo',
    backArrow: false,
  },
};

export const WithBackArrow: Story = {
  args: {
    url: '/',
    urlTitle: 'Back to CMS',
    logoFilePath: logoImage,
    logoAltText: 'CMSDS Logo',
    backArrow: true,
  },
};
