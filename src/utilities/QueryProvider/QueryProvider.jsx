import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent refetch when user returns to tab
      refetchOnWindowFocus: false,

      // Keep data fresh for 2 minutes before marking stale
      // Reduces unnecessary refetches, especially on slow connections
      staleTime: 1000 * 60 * 2,

      // Keep unused cache for 10 minutes (default is 5)
      // Helps users navigating back/forward
      gcTime: 1000 * 60 * 10,

      // Reduce retries for slow connections
      // Default is 3 with exponential backoff (can take 7+ seconds)
      retry: 1,

      // Fixed retry delay instead of exponential
      retryDelay: 1000,
    }
  }
});

const withQueryProvider = (WrappedComponent) => (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WrappedComponent { ...props }/>
    </QueryClientProvider>
  )
}

export default withQueryProvider;