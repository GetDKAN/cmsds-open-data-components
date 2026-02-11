import type { Meta, StoryObj } from '@storybook/react';
import APIPage from './index';
import { MemoryRouter } from 'react-router-dom';
import { ACAContext } from '../../utilities/ACAContext';
import { createAPIPageHandlers } from '../../../.storybook/mswHandlers';
import { mockOpenAPISpec, mockOpenAPISpecWithAuth } from '../../../__mocks__/mockOpenAPISpec';

const meta: Meta<typeof APIPage> = {
  title: 'Templates/APIPage',
  component: APIPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: createAPIPageHandlers(mockOpenAPISpec, mockOpenAPISpecWithAuth),
    },
    docs: {
      description: {
        component: `
The APIPage template renders interactive API documentation using Swagger UI.
It displays an OpenAPI/Swagger specification with expandable endpoints, request/response schemas, and optional authentication controls.

**Note:** These stories use MSW (Mock Service Worker) to intercept API calls and return a mock OpenAPI specification from \`__mocks__/mockOpenAPISpec.ts\`.

Key features:
- Interactive Swagger UI with collapsible endpoint sections
- Optional row limit notice accordion for API usage guidance
- Configurable authentication visibility
- Custom styling overrides for Design System consistency
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ACAContext.Provider value={{ ACA: undefined }}>
          <Story />
        </ACAContext.Provider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    rootUrl: {
      control: 'text',
      description: 'The URL to the OpenAPI/Swagger JSON specification.',
    },
    hideAuth: {
      control: 'boolean',
      description: 'Hide authentication controls in the Swagger UI. Defaults to true.',
    },
    showRowLimitNotice: {
      control: 'boolean',
      description: 'Show the row limit notice accordion above the API documentation. Defaults to false.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof APIPage>;

export const Default: Story = {
  args: {
    rootUrl: 'http://localhost:3000/openapi.json',
    hideAuth: true,
    showRowLimitNotice: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard API documentation view with authentication hidden and no row limit notice. Displays the Data API specification with Datastore, Metastore, and Search endpoints.',
      },
    },
  },
};

export const WithRowLimitNotice: Story = {
  args: {
    rootUrl: 'http://localhost:3000/openapi.json',
    hideAuth: true,
    showRowLimitNotice: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'API documentation with the row limit notice accordion displayed. The accordion provides guidance on API connection limits and query constraints.',
      },
    },
  },
};

export const WithAuthVisible: Story = {
  args: {
    rootUrl: 'http://localhost:3000/openapi.json',
    hideAuth: false,
    showRowLimitNotice: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'API documentation with authentication controls visible. The Swagger UI will display the Authorize button and authentication-related UI elements.',
      },
    },
  },
};
