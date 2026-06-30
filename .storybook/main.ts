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
      build: {
        ...config.build,
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...(Array.isArray(config.build?.rollupOptions?.output)
              ? {}
              : config.build?.rollupOptions?.output),
            manualChunks: (id: string) => {
              if (id.includes('node_modules/swagger-ui') || id.includes('node_modules/swagger-client') || id.includes('@civicactions/swagger-ui-layout')) {
                return 'swagger-ui';
              }
            },
          },
        },
      },
    };
  }
};
export default config;
