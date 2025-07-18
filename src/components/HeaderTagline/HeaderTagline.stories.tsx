import React from 'react';
import HeaderTagline, { HeaderTaglineProps } from './index';

export default {
  title: 'Components/HeaderTagline',
  component: HeaderTagline,
  tags: ['autodocs'],
  argTypes: {
    tagline: {
      control: 'text',
      description: 'The tagline text to display.',
      defaultValue: 'Empowering Data Transparency',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Displays a tagline in the header, styled for top navigation.'
      }
    }
  }
};

export const Default = {
  args: {
    tagline: 'Empowering Data Transparency',
  },
  render: (args: HeaderTaglineProps) => <HeaderTagline {...args} />,
};
