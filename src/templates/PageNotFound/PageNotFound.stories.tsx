import type { Meta, StoryObj } from '@storybook/react';
import PageNotFound from './index';

const meta: Meta<typeof PageNotFound> = {
  title: 'Templates/PageNotFound',
  component: PageNotFound,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The PageNotFound template displays a 404 error page with a standard error message.
It accepts an optional \`content\` prop to override the default message with custom JSX.
        `,
      },
    },
  },
  argTypes: {
    siteUrl: {
      control: 'text',
      description: 'The site URL to display in the error message.',
    },
    content: {
      control: false,
      description: 'Optional custom JSX content to replace the default error message.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageNotFound>;

export const Default: Story = {
  args: {
    siteUrl: 'https://example.cms.gov',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard 404 error page with default messaging and the site URL displayed.'
      }
    }
  }
};

export const WithCustomContent: Story = {
  args: {
    siteUrl: 'https://example.cms.gov',
    content: (
      <>
        <h1 className="ds-text-heading--4xl">Custom Error Page</h1>
        <p>
          This is a custom error message that replaces the default content.
        </p>
        <p>
          You can provide any JSX content you want here, including links,
          formatted text, or other components.
        </p>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom content override. The `content` prop accepts any JSX to replace the default error message.'
      }
    }
  }
};
