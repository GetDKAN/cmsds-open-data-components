import type { Meta, StoryObj } from '@storybook/react-vite';
import FAQAccordion from './index';
import { sampleFaqs } from '../../../.storybook/fixtures';

const meta: Meta<typeof FAQAccordion> = {
  title: 'Components/FAQAccordion',
  component: FAQAccordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays an accordion of FAQ items with expand/collapse all functionality.',
      },
    },
  },
  argTypes: {
    faqs: {
      control: 'object',
      description: 'Array of FAQ items to display.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAQAccordion>;

export const Default: Story = {
  args: { faqs: sampleFaqs },
};
