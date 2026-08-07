"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};
export default Provider;
