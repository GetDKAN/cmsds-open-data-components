import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const withQueryProvider = (WrappedComponent) => (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WrappedComponent { ...props }/>
    </QueryClientProvider>
  )
}

export default withQueryProvider;