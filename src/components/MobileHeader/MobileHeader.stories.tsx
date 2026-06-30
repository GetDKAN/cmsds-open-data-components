import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import { mainNavLinks, topNavLinks } from '../../../.storybook/fixtures';

const meta: Meta<typeof MobileHeader> = {
  title: 'Components/MobileHeader',
  component: MobileHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Mobile/tablet variant of the legacy site header. Manages its own menu-open state, focus trap, and keyboard handlers. Used by the responsive Header wrapper at mobile breakpoints.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 540 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    siteName: { control: 'text' },
    includeTopNav: { control: 'boolean' },
    includeSearch: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MobileHeader>;

export const Default: Story = {
  args: {
    siteName: 'CMS Open Data',
    includeTopNav: true,
    includeSearch: true,
    links: { topnav: topNavLinks, main: mainNavLinks },
  },
};
