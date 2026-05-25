import type { Meta, StoryObj } from '@storybook/react-vite';
import HeaderTagline from './index';

const meta: Meta<typeof HeaderTagline> = {
  title: 'Components/HeaderTagline',
  component: HeaderTagline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays a tagline in the header, styled for top navigation.',
      },
    },
  },
  argTypes: {
    tagline: { control: 'text', description: 'The tagline text to display.' },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderTagline>;

export const Default: Story = {
  args: { tagline: 'Empowering Data Transparency' },
};
