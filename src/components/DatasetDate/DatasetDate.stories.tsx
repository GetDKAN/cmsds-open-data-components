import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import DatasetDate from ".";

const meta: Meta<typeof DatasetDate>  = {
  title: 'Components/DatasetDate',
  component: DatasetDate,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetDate component is a PDC specific implementation designed to support rendering multiple date values for a dataset.`,
      },
    },
  },
  argTypes: {
    date: {control: 'object', description: 'Date values'},
    modifiedBoldLabel: {control: 'boolean', description: 'Whether to bold the "modified" date'},
    releasedBoldLabel: {control: 'boolean', description: 'Whether to bold the "released" date'},
    refreshBoldLabel: {control: 'boolean', description: 'Whether to bold the "refresh" date'},
    displayTooltips: {control: 'boolean', description: 'Whether to display tooltips to the right of each date item which explain the different date types'}
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

type Story = StoryObj<typeof DatasetDate>;
export const Default: Story = {
  args: {
    date: {modified: "2025-06-04", released: "2025-06-04", refresh: "2025-12-20"},
    modifiedBoldLabel: true,
    displayTooltips: true
  }
};