import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [
        ...(config.plugins || []),
        react({
          jsxRuntime: 'automatic',
        }),
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@civicactions/data-catalog-services': path.resolve(__dirname, '../__mocks__/@civicactions/data-catalog-services.js')
        }
      }
    };
  }
};
export default config;
