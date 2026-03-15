'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

export function CTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl opacity-50 dark:opacity-75" />

        {/* CTA Card */}
        <div className="relative rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-12 sm:p-16 lg:p-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                Ready to create
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                amazing flowcharts?
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-300">
              Start for free and collaborate with your team today. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 dark:border-zinc-700"
              >
                Schedule Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Trusted by</p>
                <p className="font-semibold text-zinc-900 dark:text-white">10,000+ teams</p>
              </div>
              <div className="hidden sm:block w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Free forever plan</p>
                <p className="font-semibold text-zinc-900 dark:text-white">For individuals</p>
              </div>
              <div className="hidden sm:block w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Enterprise ready</p>
                <p className="font-semibold text-zinc-900 dark:text-white">Full API access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}