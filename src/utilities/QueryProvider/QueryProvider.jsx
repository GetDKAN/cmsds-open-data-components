import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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