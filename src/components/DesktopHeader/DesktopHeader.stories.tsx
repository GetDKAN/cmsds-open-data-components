import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DesktopHeader from './DesktopHeader';
import { mainNavLinks, topNavLinks } from '../../../.storybook/fixtures';

const meta: Meta<typeof DesktopHeader> = {
  title: 'Components/DesktopHeader',
  component: DesktopHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Desktop variant of the legacy site header. Renders an optional CMS top-nav bar and the main site nav. Used by the responsive Header wrapper at desktop breakpoints.',
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
    siteName: { control: 'text' },
    includeTopNav: { control: 'boolean' },
    customSearch: { control: false },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DesktopHeader>;

export const Default: Story = {
  args: {
    siteName: 'CMS Open Data',
    includeTopNav: true,
    links: { topnav: topNavLinks, main: mainNavLinks },
  },
};

export const WithoutTopNav: Story = {
  args: {
    siteName: 'CMS Open Data',
    includeTopNav: false,
    links: { topnav: topNavLinks, main: mainNavLinks },
  },
};
