import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumb from './index';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Breadcrumb component provides navigation links showing the user's current location within the site hierarchy. It displays a series of links representing the path to the current page, with the current page shown as non-clickable text.
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
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    currentPage: 'Current Page',
    pageTrail: [
      { path: '/home', title: 'Home' },
      { path: '/section', title: 'Section' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'The default Breadcrumb component with a trail of navigation links leading to the current page.',
      },
    },
  },
};

export const NoTrail: Story = {
  args: {
    currentPage: 'Current Page',
    pageTrail: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'A Breadcrumb component with no navigation trail, showing only the current page.',
      },
    },
  },
};

export const LongTrail: Story = {
  args: {
    currentPage: 'Current Page',
    pageTrail: [
      { path: '/home', title: 'Home' },
      { path: '/section', title: 'Section' },
      { path: '/subsection', title: 'Subsection' },
      { path: '/details', title: 'Details' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A Breadcrumb component with a longer navigation trail showing multiple levels of hierarchy.',
      },
    },
  },
};
