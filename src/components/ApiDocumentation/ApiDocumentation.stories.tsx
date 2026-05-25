import type { Meta, StoryObj } from '@storybook/react-vite';
import ApiDocumentation from './index';
import { createAPIPageHandlers } from '../../../.storybook/mswHandlers';
import { mockOpenAPISpec, mockOpenAPISpecWithAuth } from '../../../__mocks__/mockOpenAPISpec';

const meta: Meta<typeof ApiDocumentation> = {
  title: 'Components/ApiDocumentation',
  component: ApiDocumentation,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: createAPIPageHandlers(mockOpenAPISpec, mockOpenAPISpecWithAuth) },
    docs: {
      description: {
        component:
          'Renders Swagger UI from an OpenAPI spec endpoint with the project\'s custom plugins (version stamps, row-limit notice, doc links).',
      },
    },
  },
  argTypes: {
    endpoint: { control: 'text', description: 'OpenAPI spec URL.' },
    docsURL: { control: 'text', description: 'URL used by the "View documentation" links inside the spec.' },
    showRowLimitNotice: { control: 'boolean', description: 'Show the API row-limit notice above operations.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiDocumentation>;

export const Default: Story = {
  args: {
    endpoint: '/openapi.json',
    docsURL: '/api-docs',
    showRowLimitNotice: false,
  },
};

export const WithRowLimitNotice: Story = {
  args: {
    endpoint: '/openapi.json',
    docsURL: '/api-docs',
    showRowLimitNotice: true,
  },
};
