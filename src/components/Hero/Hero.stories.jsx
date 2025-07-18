import React from 'react';
import Hero from './index';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe Hero component displays a prominent header section with a title, description, and search form for datasets.\n        `,
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
        {Story()}
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Welcome to CMS Open Data',
    description: 'Search and explore datasets from the Centers for Medicare & Medicaid Services.',
    searchUrl: 'datasets',
    searchKey: 'fulltext',
    textfieldLabel: 'Search for a dataset',
    searchButtonText: 'Search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the hero section with a title, description, and search form.'
      }
    }
  }
};
