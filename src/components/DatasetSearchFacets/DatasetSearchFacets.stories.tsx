import React from 'react';
import SearchFacets from './index';

const meta = {
  title: 'Components/DatasetSearchFacets',
  component: SearchFacets,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetSearchFacets component displays a list of filterable facets for dataset search results.\n        `,
      },
    },
  },
  argTypes: {
    facets: { control: 'object', description: 'Array of facet objects.' },
    title: { control: 'text', description: 'Title for the facet group.' },
    onClickFunction: { control: 'function', description: 'Callback for facet selection.' },
    selectedFacets: { control: 'object', description: 'Array of selected facet names.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    facets: [
      { name: 'Theme A', total: 12, type: 'theme' },
      { name: 'Theme B', total: 5, type: 'theme' },
      { name: 'Theme C', total: 0, type: 'theme' },
    ],
    title: 'Themes',
    onClickFunction: (type: string, name: string) => {},
    selectedFacets: ['Theme B'],
  },
};
