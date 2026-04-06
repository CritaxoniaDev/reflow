'use client'

import { Zap, Users, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { FeatureCard } from '@/components/common/feature-card'
import { toolsData } from '@/app/dashboard/_ts/dashboard'

const features = [
  {
    icon: Zap,
    title: 'Realtime Editing',
    description: 'Create and edit flowcharts in real-time without delays',
    color: 'from-blue-600 to-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200/50 dark:border-blue-800/50',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Work together with your team on the same diagram',
    color: 'from-cyan-600 to-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    borderColor: 'border-cyan-200/50 dark:border-cyan-800/50',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your diagrams are encrypted and stored securely',
    color: 'from-purple-600 to-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200/50 dark:border-purple-800/50',
  },
]

// Get featured tools (first 6)
const featuredTools = toolsData.slice(0, 6)

export function Features() {
  return (
    <section className="relative overflow-hidden">
      {/* Enhanced layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/40 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent pointer-events-none" />
      
      {/* Background orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-200/10 dark:bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Main Features Header */}
        <div className="mb-20 space-y-6 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200/60 dark:border-blue-800/60 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-300 dark:to-cyan-400 bg-clip-text text-transparent">
              Why choose Reflow
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Everything you need to create amazing flowcharts and diagrams with your team in real-time
            </p>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative h-full rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 ${feature.bgColor} backdrop-blur-sm`} />
                <div className={`absolute inset-0 rounded-2xl border ${feature.borderColor} group-hover:border-opacity-100 transition-all duration-300`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${feature.color} transition-opacity duration-300 pointer-events-none`} />

                <div className="relative p-8 h-full flex flex-col z-10">
                  <div className={`absolute -top-5 -right-5 h-14 w-14 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {index + 1}
                  </div>

                  <div className={`mb-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                      {feature.description}
                    </p>
                  </div>

                  <a 
                    href="#" 
                    className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent hover:opacity-80 transition-all group/link`}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-2" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Featured Tools Section */}
        <div className="mt-32 pt-20 border-t border-blue-200/30 dark:border-blue-900/30">
          <div className="mb-16 space-y-4 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                Featured Tools
              </span>
            </h3>
            <p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-300">
              Access powerful utilities to enhance your flowcharts and diagrams
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <a
                  key={tool.id}
                  href={tool.route}
                  className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${tool.color}`} style={{ padding: '1px' }} />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center rounded-lg ${tool.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                      {tool.name}
                    </h4>
                    
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {tool.description}
                    </p>

                    <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 gap-1 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* View all tools link */}
          <div className="mt-12 text-center">
            <a href="/dashboard/tools" className="inline-flex items-center px-6 py-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
              View All Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Ready to get started with Reflow?
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300">
            Start for Free
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}