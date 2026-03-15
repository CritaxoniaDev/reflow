'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@trpc/router'

export const trpc = createTRPCReact<AppRouter>()

export function getTRPCUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    return `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/api/trpc`
}