import type { StorybookConfig } from '@storybook/react-vite';
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
    };
  }
};
export default config;
