
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce background refetch frequency
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Query keys factory for consistency
export const queryKeys = {
  auth: ['auth'] as const,
  subscription: (userId: string) => ['subscription', userId] as const,
  wordBalance: (userId: string) => ['wordBalance', userId] as const,
  wordUsage: (userId: string) => ['wordUsage', userId] as const,
  userStats: (userId: string) => ['userStats', userId] as const,
  dictionary: ['dictionary'] as const,
  wordPlans: ['wordPlans'] as const,
} as const;
