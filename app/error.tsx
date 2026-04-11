'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/30">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again or contact support.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left">
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
              {error.message}
            </p>
          </div>
        )}

        <Button
          onClick={() => reset()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="w-full"
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}