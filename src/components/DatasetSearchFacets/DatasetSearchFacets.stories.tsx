import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchFacets from './index';

const meta: Meta<typeof SearchFacets> = {
  title: 'Components/DatasetSearchFacets',
  component: SearchFacets,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetSearchFacets component displays a list of filterable facets for dataset search results.
        `,
      },
    },
  },
  argTypes: {
    facets: { control: 'object', description: 'Array of facet objects.' },
    title: { control: 'text', description: 'Title for the facet group.' },
    onClickFunction: { control: false, description: 'Callback for facet selection.' },
    selectedFacets: { control: 'object', description: 'Array of selected facet names.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchFacets>;

export const Default: Story = {
  args: {
    facets: [
      { name: 'Theme A', total: '12', type: 'theme' },
      { name: 'Theme B', total: '5', type: 'theme' },
      { name: 'Theme C', total: '0', type: 'theme' },
    ],
    title: 'Themes',
    onClickFunction: () => {},
    selectedFacets: ['Theme B'],
  },
};
