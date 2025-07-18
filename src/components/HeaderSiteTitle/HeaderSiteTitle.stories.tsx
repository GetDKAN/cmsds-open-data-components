import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HeaderSiteTitle, { HeaderSiteTitleProps } from './index';
import { OrgType } from '../../types/misc';
import type { StoryFn, StoryContext } from '@storybook/react';

const sampleOrg: OrgType = {
  url: '/',
  tagline: 'Empowering Data Transparency',
  urlTitle: 'CMS Open Data',
  logoAltText: 'CMS Logo',
  logoFilePath: undefined,
};

const sampleOrgWithLogo: OrgType = {
  ...sampleOrg,
  logoFilePath: 'https://via.placeholder.com/150x40?text=Logo',
};

export default {
  title: 'Components/HeaderSiteTitle',
  component: HeaderSiteTitle,
  tags: ['autodocs'],
  argTypes: {
    inverse: {
      control: 'boolean',
      description: 'Use inverse color scheme for the site title link.',
      defaultValue: false,
    },
    org: {
      control: 'object',
      description: 'Organization info including logo, alt text, and title.',
      defaultValue: sampleOrg,
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays the site title in the header, optionally with a logo and inverse styling.'
      }
    }
  },
  decorators: [
    (Story: StoryFn, context: StoryContext) => <MemoryRouter>{Story(context.args, context)}</MemoryRouter>
  ],
};

export const Default = {
  args: {
    inverse: false,
    org: sampleOrg,
  },
  render: (args: HeaderSiteTitleProps) => <HeaderSiteTitle {...args} />,
};

export const WithLogo = {
  args: {
    inverse: false,
    org: sampleOrgWithLogo,
  },
  render: (args: HeaderSiteTitleProps) => <HeaderSiteTitle {...args} />,
};

export const Inverse = {
  args: {
    inverse: true,
    org: sampleOrg,
  },
  render: (args: HeaderSiteTitleProps) => <HeaderSiteTitle {...args} />,
};
