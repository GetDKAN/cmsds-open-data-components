/**
 * Base OpenAPI spec structure (shared between auth and no-auth versions).
 */
const baseSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Data API',
    description: 'API for accessing datasets',
    version: '1.0.0',
    contact: {
      name: 'Open Data Team',
      email: 'example@example.com',
    },
  },
  paths: {
    '/datastore/query/{resourceId}': {
      get: {
        summary: 'Query a datastore resource',
        description: 'Returns records from a datastore resource with optional filtering, sorting, and pagination.',
        operationId: 'queryDatastore',
        tags: ['Datastore'],
        parameters: [
          {
            name: 'resourceId',
            in: 'path',
            required: true,
            description: 'The unique identifier of the datastore resource',
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of records to return (default: 25, max: 500)',
            schema: { type: 'integer', default: 25, maximum: 500 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of records to skip',
            schema: { type: 'integer', default: 0 },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Column to sort by',
            schema: { type: 'string' },
          },
          {
            name: 'sort-order',
            in: 'query',
            description: 'Sort direction',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: {
                      type: 'array',
                      items: { type: 'object' },
                    },
                    count: { type: 'integer' },
                    schema: { type: 'object' },
                  },
                },
              },
            },
          },
          '404': { description: 'Resource not found' },
          '500': { description: 'Internal server error' },
        },
      },
    },
    '/metastore/schemas/dataset/items/{id}': {
      get: {
        summary: 'Get dataset metadata',
        description: 'Returns metadata for a specific dataset including title, description, and distributions.',
        operationId: 'getDatasetMetadata',
        tags: ['Metastore'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The dataset identifier',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Dataset metadata',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Dataset' },
              },
            },
          },
          '404': { description: 'Dataset not found' },
        },
      },
    },
    '/search': {
      get: {
        summary: 'Search datasets',
        description: 'Search for datasets using keywords, themes, or other filters.',
        operationId: 'searchDatasets',
        tags: ['Search'],
        parameters: [
          {
            name: 'fulltext',
            in: 'query',
            description: 'Full-text search query',
            schema: { type: 'string' },
          },
          {
            name: 'theme',
            in: 'query',
            description: 'Filter by theme',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'page-size',
            in: 'query',
            description: 'Results per page',
            schema: { type: 'integer', default: 10, maximum: 100 },
          },
        ],
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    results: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Dataset' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Dataset: {
        type: 'object',
        properties: {
          identifier: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          modified: { type: 'string', format: 'date' },
          publisher: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
          distribution: {
            type: 'array',
            items: { $ref: '#/components/schemas/Distribution' },
          },
          keyword: {
            type: 'array',
            items: { type: 'string' },
          },
          theme: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      Distribution: {
        type: 'object',
        properties: {
          identifier: { type: 'string' },
          downloadURL: { type: 'string', format: 'uri' },
          format: { type: 'string' },
          title: { type: 'string' },
          describedBy: { type: 'string', format: 'uri' },
        },
      },
    },
  },
};

/**
 * Mock OpenAPI spec without security/auth (default, hideAuth=true).
 */
export const mockOpenAPISpec = { ...baseSpec };

/**
 * Mock OpenAPI spec with security/auth visible (hideAuth=false).
 */
export const mockOpenAPISpecWithAuth = {
  ...baseSpec,
  components: {
    ...baseSpec.components,
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API key for authenticated requests',
      },
    },
  },
  security: [{ apiKey: [] }],
};
