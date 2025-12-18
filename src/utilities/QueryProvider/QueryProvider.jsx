import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // disable refetch when user returns to tab
      refetchOnWindowFocus: false,

      // Keep unused cache for 10 minutes (default is 5)
      // Helps users navigating back/forward see cached data while refetch happens
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