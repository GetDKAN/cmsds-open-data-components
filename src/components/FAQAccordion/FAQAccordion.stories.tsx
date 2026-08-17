import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import FAQAccordion from './index';
import type { FAQItemType } from '../../types/misc';

const sampleFaqs: FAQItemType[] = [
  {
    id: 'faq1',
    title: 'What is Open Data?',
    body: 'Open data is data that can be freely used, re-used, and redistributed by anyone.',
    open: false,
  },
  {
    id: 'faq2',
    title: 'How do I access datasets?',
    body: 'You can access datasets via the search or browse features on our site.',
    open: false,
  },
  {
    id: 'faq3',
    title: 'Who maintains the data?',
    body: 'The Open Data team maintains and updates the datasets regularly.',
    open: false,
  },
];

const meta: Meta<typeof FAQAccordion> = {
  title: 'Components/FAQAccordion',
  component: FAQAccordion,
  tags: ['autodocs'],
  args: {
    faqs: sampleFaqs,
    onItemToggle: fn(),
    onToggleAll: fn(),
  },
  argTypes: {
    faqs: {
      control: 'object',
      description: 'Array of FAQ items to display.',
    },
    onItemToggle: {
      description:
        'Invoked whenever a single FAQ item is expanded or collapsed. Receives the item `id` and its new open state. Not invoked by the expand/collapse all button.',
      table: { category: 'Events' },
    },
    onToggleAll: {
      description:
        'Invoked when the "Expand/Collapse all FAQs" button is used. Receives the new open state applied to every item.',
      table: { category: 'Events' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Displays an accordion of FAQ items with expand/collapse all functionality. Toggle events are reported through `onItemToggle` and `onToggleAll` \u2014 open the Actions panel to watch them fire.'
      }
    }
  },
};

export default meta;
type Story = StoryObj<typeof FAQAccordion>;

export const Default: Story = {};

export const PreExpanded: Story = {
  args: {
    faqs: sampleFaqs.map((faq) => ({ ...faq, open: true })),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Items supplied with `open: true`. The toggle-all button still starts on "Expand all FAQs" because its label tracks internal state rather than the incoming items, so the first click reports `onToggleAll(true)` on already-open items.'
      }
    }
  },
};
