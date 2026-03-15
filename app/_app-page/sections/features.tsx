'use client'

import { Zap, Users, Lock, ArrowRight } from 'lucide-react'
import { FeatureCard } from '@/components/common/feature-card'

const features = [
  {
    icon: Zap,
    title: 'Realtime Editing',
    description: 'Create and edit flowcharts in real-time without delays',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Work together with your team on the same diagram',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your diagrams are encrypted and stored securely',
  },
]

export function Features() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Header */}
        <div className="mb-20 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-4 py-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Why choose Reflow
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            Everything you need to create amazing flowcharts and diagrams with your team in real-time
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm p-8 transition-all hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-700"
              >
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-blue-100 p-3 dark:bg-blue-950/50">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}