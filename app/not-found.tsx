import { Button } from '@/components/ui'
import { ArrowRight, Home, Compass, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-100/50 dark:bg-red-950/30 backdrop-blur-sm border border-red-200/50 dark:border-red-900/50">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-7xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
              404
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed">
            The page you are looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 h-11">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-medium mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/changelogs">
              <button className="w-full px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                Changelogs
              </button>
            </Link>
            <Link href="/#features">
              <button className="w-full px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Error Code: 404 — Not Found</p>
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  )
}