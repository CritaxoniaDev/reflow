'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'
import { trpc, getTRPCUrl } from '@/utils/trpc'
import { SEOProvider } from './seo-provider'
import { LenisProvider } from './lenis-provider'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getTRPCUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            })
          },
        }),
      ],
    })
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SEOProvider>
        <LenisProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </QueryClientProvider>
          </trpc.Provider>
        </LenisProvider>
      </SEOProvider>
    </ThemeProvider>
  )
}