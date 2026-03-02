import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FilterChip from './index';
import { getOperatorLabel } from '../../templates/FilteredResource/functions';
import { ConditionType } from '../../types/dataset';

import './FilterChip.scss';

const meta: Meta<typeof FilterChip> = {
  title: 'Components/FilterChip',
  component: FilterChip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'FilterChip displays an active filter condition or state as a removable chip. Used in the DataTableToolbar to show applied filters and hidden columns.',
      },
    },
  },
  argTypes: {
    iconClass: {
      control: 'text',
      description: 'CSS classes for the leading icon.',
    },
    text: {
      control: 'text',
      description: 'Display text for the chip.',
    },
    onClick: {
      action: 'clicked',
      description: 'Called when the chip (remove button) is clicked.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

/** Formats a condition the same way DataTableToolbar does. */
const formatConditionText = (condition: ConditionType): string =>
  `"${condition.property}" ${getOperatorLabel(condition.operator).toLowerCase()}${condition.value === '' || condition.operator === 'is_empty' || condition.operator === 'not_empty' ? '' : ` ${condition.value}`}`;

export const Default: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'state', operator: '=', value: 'CA' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A filter chip showing an "Is" condition.',
      },
    },
  },
};

export const IsNot: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'state', operator: '<>', value: 'NY' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A filter chip showing an "Is Not" condition.',
      },
    },
  },
};

export const Contains: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'name', operator: 'contains', value: 'Health' }),
  },
};

export const StartsWith: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'name', operator: 'starts with', value: 'National' }),
  },
};

export const GreaterThan: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'amount', operator: '>', value: '1000' }),
  },
};

export const LessThan: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'amount', operator: '<', value: '500' }),
  },
};

export const Or: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'state', operator: 'in', value: 'CA, NY, TX' }),
  },
};

export const Like: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'name', operator: 'like', value: '%Medical%' }),
  },
};

export const IsEmpty: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'effective_date', operator: 'is_empty', value: '' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A filter chip for the "Is Empty" operator. No value is displayed since empty filters have no user-entered value.',
      },
    },
  },
};

export const NotEmpty: Story = {
  args: {
    iconClass: 'far fa-filter',
    text: formatConditionText({ property: 'effective_date', operator: 'not_empty', value: '' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A filter chip for the "Not Empty" operator. No value is displayed since empty filters have no user-entered value.',
      },
    },
  },
};

export const HiddenColumns: Story = {
  args: {
    iconClass: 'fa fa-columns',
    text: '2 Columns Hidden',
  },
  parameters: {
    docs: {
      description: {
        story: 'A chip indicating hidden columns, using a different icon class.',
      },
    },
  },
};

export const MultipleChips: Story = {
  render: (args) => (
    <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
      <FilterChip
        iconClass="far fa-filter"
        text={formatConditionText({ property: 'state', operator: '=', value: 'CA' })}
        onClick={args.onClick}
      />
      <FilterChip
        iconClass="far fa-filter"
        text={formatConditionText({ property: 'amount', operator: '>', value: '1000' })}
        onClick={args.onClick}
      />
      <FilterChip
        iconClass="far fa-filter"
        text={formatConditionText({ property: 'effective_date', operator: 'is_empty', value: '' })}
        onClick={args.onClick}
      />
      <FilterChip
        iconClass="far fa-filter"
        text={formatConditionText({ property: 'name', operator: 'not_empty', value: '' })}
        onClick={args.onClick}
      />
      <FilterChip
        iconClass="fa fa-columns"
        text="1 Column Hidden"
        onClick={args.onClick}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple chips displayed together, including Is Empty and Not Empty filters alongside standard filters and a hidden columns chip.',
      },
    },
  },
};
