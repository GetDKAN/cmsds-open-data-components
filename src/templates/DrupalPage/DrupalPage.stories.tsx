import type { Meta, StoryObj } from '@storybook/react';
import DrupalPage from './index';

const meta: Meta<typeof DrupalPage> = {
  title: 'Templates/DrupalPage',
  component: DrupalPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DrupalPage template fetches and displays content from a Drupal backend using the useDrupalEntity hook.
It renders a page with a title and body content from a Drupal entity.

**Note:** This component requires the \`@civicactions/data-catalog-services\` package, which is not currently in the project dependencies.
These stories use mocked data to demonstrate the component's functionality.
        `,
      },
    },
  },
  argTypes: {
    path: {
      control: 'text',
      description: 'The path to the Drupal page.',
    },
    rootUrl: {
      control: 'text',
      description: 'The root URL of the Drupal backend.',
    },
    uuid: {
      control: 'text',
      description: 'The UUID of the Drupal entity to fetch.',
    },
    entityType: {
      control: 'text',
      description: 'The type of Drupal entity (e.g., "node").',
    },
    bundle: {
      control: 'text',
      description: 'The bundle/content type of the entity (e.g., "page", "article").',
    },
    options: {
      control: 'object',
      description: 'Additional options for fetching the entity.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrupalPage>;

export const Default: Story = {
  args: {
    rootUrl: 'https://example.cms.gov',
    uuid: '12345678-1234-1234-1234-123456789abc',
    entityType: 'node',
    bundle: 'page',
    path: '/about',
    options: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard Drupal page with title and body content. The component fetches entity data from Drupal and renders it in a container with proper styling. This story uses mocked data since the required dependency is not installed.',
      },
    },
  },
};
