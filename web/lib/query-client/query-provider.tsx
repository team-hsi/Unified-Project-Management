"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
