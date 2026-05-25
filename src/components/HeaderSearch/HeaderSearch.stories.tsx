import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import HeaderSearch from './index';

const meta: Meta<typeof HeaderSearch> = {
  title: 'Components/HeaderSearch',
  component: HeaderSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays a search button in the header that opens a modal for dataset search.',
      },
    },
  },
  argTypes: {
    headingText: {
      control: 'text',
      description: 'Heading text for the search modal dialog.',
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
type Story = StoryObj<typeof HeaderSearch>;

export const Default: Story = {
  args: { headingText: 'Dataset Search' },
};

export const CustomHeading: Story = {
  args: { headingText: 'Find Your Data' },
};
