'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/next';
import { httpBatchLink } from '@trpc/client'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useState, useEffect } from 'react'
import { GooeyToaster } from 'goey-toast'
import { trpc, getTRPCUrl } from '@/utils/trpc'
import { SEOProvider } from './seo-provider'
import { LenisProvider } from './lenis-provider'

function DataIdInjector() {
  useEffect(() => {
    const generateUniqueHash = () => {
      return Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    }

    const addIdsToAllDivs = () => {
      const divs = document.querySelectorAll('div')
      divs.forEach((div) => {
        if (!div.hasAttribute('_next-div-id')) {
          div.setAttribute('_next-div-id', `_reflooow?v=${generateUniqueHash()}`)
        }
      })
    }

    // Initial run
    addIdsToAllDivs()

    // Watch for dynamically added divs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          addIdsToAllDivs()
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  return null
}

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
              <DataIdInjector />
              <NuqsAdapter>{children}</NuqsAdapter>
              <Analytics />
              <GooeyToaster position="bottom-right" />
            </QueryClientProvider>
          </trpc.Provider>
        </LenisProvider>
      </SEOProvider>
    </ThemeProvider>
  )
}