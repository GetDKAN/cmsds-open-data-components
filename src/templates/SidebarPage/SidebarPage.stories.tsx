import type { Meta, StoryObj } from '@storybook/react';
import SidebarPage from './index';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SidebarPage> = {
  title: 'Templates/SidebarPage',
  component: SidebarPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The SidebarPage template provides a two-column layout with a sidebar navigation menu and main content area.
It uses \`useMediaQuery\` to detect viewport size and adjusts the layout for mobile devices.
The sidebar automatically collapses on smaller screens based on the \`mobileMaxWidth\` prop.
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
      description: 'Array of navigation links with url, label, id, and target properties.',
    },
    menuTitle: {
      control: 'text',
      description: 'Title displayed at the top of the sidebar navigation.',
    },
    mobileMaxWidth: {
      control: 'number',
      description: 'Maximum width in pixels for mobile layout. Defaults to 768.',
    },
    children: {
      control: false,
      description: 'Content to display in the main area next to the sidebar.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidebarPage>;

export const Default: Story = {
  args: {
    menuTitle: 'Documentation',
    links: [
      { id: 'getting-started', url: '/getting-started', label: 'Getting Started', target: '_self' },
      { id: 'api-reference', url: '/api-reference', label: 'API Reference', target: '_self' },
      { id: 'examples', url: '/examples', label: 'Examples', target: '_self' },
      { id: 'faq', url: '/faq', label: 'FAQ', target: '_self' },
    ],
    children: (
      <div className="ds-u-padding--3">
        <h1 className="ds-text-heading--3xl">Main Content Area</h1>
        <p className="ds-u-measure--wide">
          This is the main content area of the page. The sidebar navigation appears on the left,
          and this content takes up the remaining space. On mobile devices (below 768px by default),
          the layout adjusts to a single column with a collapsible menu.
        </p>
        <h2 className="ds-text-heading--xl ds-u-margin-top--3">Section Heading</h2>
        <p className="ds-u-measure--wide">
          You can include any content here - text, images, forms, tables, or other components.
          The sidebar provides easy navigation between different sections of your site.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard sidebar page layout with navigation links and main content area. Desktop view shows sidebar and content side by side.'
      }
    }
  }
};
