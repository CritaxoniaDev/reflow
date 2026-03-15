'use client'

import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { Button } from '@/components/ui'
import { FlowDemo } from './flow-demo'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pointer-events-none" />

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12 lg:items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Try it now, completely free
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Realtime <span className='text-6xl font-light' style={{ fontFamily: '"Aloja Extended", sans-serif' }}>Flowchart</span>
                </span>
                {' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Creator
                </span>
              </h1>
              <p className="text-lg sm:text-base text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                Create stunning flowcharts in seconds. Collaborate seamlessly with your team in real-time using the power of React Flow.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 dark:border-zinc-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">10K+</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Active Users</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">500K+</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Diagrams Created</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">99.9%</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Side - Flow Demo */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-3xl opacity-50 dark:opacity-100" />
            
            {/* Demo container */}
            <div className="relative">
              <FlowDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}