import type { Meta, StoryObj } from '@storybook/react';
import MobileMenuButton from './index';
import React from 'react';

// Mock HeaderContext provider
const mockHeaderContext = {
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  onDark: false,
};
const MockHeaderContext = React.createContext(mockHeaderContext);

const meta: Meta<typeof MobileMenuButton> = {
  title: 'Components/MobileMenuButton',
  component: MobileMenuButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The MobileMenuButton component displays a button for toggling the mobile menu, using context for open/close state and styling.
        `,
      },
    },
  },
  argTypes: {
    wrapperClasses: {
      control: 'text',
      description: 'CSS classes for the button wrapper.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MobileMenuButton>;

export const Default: Story = {
  args: {
    wrapperClasses: '',
  },
  render: (args) => (
    <MockHeaderContext.Provider value={mockHeaderContext}>
      <MobileMenuButton {...args} />
    </MockHeaderContext.Provider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays the mobile menu button with default styling.'
      }
    }
  }
};
