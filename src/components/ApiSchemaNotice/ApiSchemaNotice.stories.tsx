import type { Meta, StoryObj } from '@storybook/react';
import ApiSchemaNotice from './index';

const meta: Meta<typeof ApiSchemaNotice> = {
  title: 'Components/ApiSchemaNotice',
  component: ApiSchemaNotice,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ApiSchemaNotice component displays important information about the data.json endpoint moving to DCAT-US v3.0 and the location of the legacy DCAT-US 1.1 endpoint. It uses an accordion layout to present the notice in a collapsible format.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiSchemaNotice>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default ApiSchemaNotice component with the data.json endpoint change notice.',
      },
    },
  },
};
