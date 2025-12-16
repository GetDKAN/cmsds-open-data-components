import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a QueryClient configured for Storybook stories.
 * Disables retries and sets infinite stale time for consistent story behavior.
 */
export const createStorybookQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});
