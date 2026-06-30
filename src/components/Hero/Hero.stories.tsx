import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import Hero from './index';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Hero component displays a prominent header section with a title, description, and search form for datasets.
        `,
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Title for the hero section.' },
    description: { control: 'text', description: 'Description text for the hero section.' },
    searchUrl: { control: 'text', description: 'URL to navigate to on search.' },
    searchKey: { control: 'text', description: 'Query key for the search.' },
    textfieldLabel: { control: 'text', description: 'Label for the search text field.' },
    searchButtonText: { control: 'text', description: 'Text for the search button.' },
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
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: 'CMSDS',
    description: 'Search and explore datasets.',
    searchUrl: 'datasets',
    searchKey: 'fulltext',
    textfieldLabel: 'Search for a dataset',
    searchButtonText: 'Search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the hero section with a title, description, and search form.',
      },
    },
  },
};
