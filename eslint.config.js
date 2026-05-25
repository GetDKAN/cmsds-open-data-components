// Minimal flat config for ESLint v9+/v10.
// Scoped to Storybook story files via eslint-plugin-storybook's recommended preset.
// The legacy .eslintrc.js and package.json#eslintConfig are not read by ESLint v9+.
import storybook from 'eslint-plugin-storybook';
import tsParser from '@typescript-eslint/parser';

export default [
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
];
