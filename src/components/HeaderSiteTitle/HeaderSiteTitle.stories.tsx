import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import HeaderSiteTitle from './index';
import { OrgType } from '../../types/misc';

const sampleOrg: OrgType = {
  url: '/',
  tagline: 'Empowering Data Transparency',
  urlTitle: 'Open Data',
  logoAltText: 'CMSDS Logo',
  logoFilePath: undefined,
};

const sampleOrgWithLogo: OrgType = {
  ...sampleOrg,
  logoFilePath: 'https://via.placeholder.com/150x40?text=Logo',
};

const meta: Meta<typeof HeaderSiteTitle> = {
  title: 'Components/HeaderSiteTitle',
  component: HeaderSiteTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays the site title in the header, optionally with a logo and inverse styling.',
      },
    },
  },
  argTypes: {
    inverse: {
      control: 'boolean',
      description: 'Use inverse color scheme for the site title link.',
    },
    org: {
      control: 'object',
      description: 'Organization info including logo, alt text, and title.',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderSiteTitle>;

export const Default: Story = {
  args: { inverse: false, org: sampleOrg },
};

export const WithLogo: Story = {
  args: { inverse: false, org: sampleOrgWithLogo },
};

export const Inverse: Story = {
  args: { inverse: true, org: sampleOrg },
};
