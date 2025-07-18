import React from 'react';
import type { StoryFn, StoryContext } from '@storybook/react';
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
    body: 'The CMS Open Data team maintains and updates the datasets regularly.',
    open: false,
  },
];

export default {
  title: 'Components/FAQAccordion',
  component: FAQAccordion,
  tags: ['autodocs'],
  argTypes: {
    faqs: {
      control: 'object',
      description: 'Array of FAQ items to display.',
      defaultValue: sampleFaqs,
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays an accordion of FAQ items with expand/collapse all functionality.'
      }
    }
  },
};

export const Default = {
  args: {
    faqs: sampleFaqs,
  },
  render: (args: { faqs: FAQItemType[] }) => <FAQAccordion {...args} />,
};
