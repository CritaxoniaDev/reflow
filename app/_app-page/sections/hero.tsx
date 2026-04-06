'use client'

import { ArrowRight, Sparkles, Play, TrendingUp, Zap, Shield, Cpu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { PointerHighlight } from '@/components/ui/pointer-highlight'
import { FlowDemo } from './flow-demo'

export function Hero() {
  const router = useRouter()

  const features = [
    { icon: Zap, label: 'Design Tools', desc: 'Colors, gradients, converters' },
    { icon: Cpu, label: 'Code Generation', desc: 'JSON, SQL, Regex, snippets' },
    { icon: TrendingUp, label: 'Utilities', desc: 'Formatters, converters, encoders' },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/50 dark:from-blue-950/40 dark:via-slate-950 dark:to-blue-950/30 pointer-events-none" />

      {/* Subtle animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-200/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating UI accent elements */}
      <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/5 rounded-lg backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/20 pointer-events-none animate-float" style={{ animation: 'float 6s ease-in-out infinite' }} />
      <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-blue-400/5 rounded-lg backdrop-blur-sm border border-cyan-200/30 dark:border-cyan-700/20 pointer-events-none animate-float" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/70 dark:to-cyan-950/50 border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-300 dark:to-cyan-400 bg-clip-text text-transparent">
                30+ Essential Tools
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-5">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <PointerHighlight pointerClassName="text-blue-500">
                  <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                    Developer
                  </span>
                </PointerHighlight>
                {' '}
                <span className='text-6xl font-light' style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                  Tools
                </span>
                {' '}
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  Library
                </span>
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed font-light">
                All-in-one toolkit for developers. Design tools, diagram creators, code generators, and more. Streamline your workflow with powerful utilities.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="group p-3 rounded-lg bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{feature.label}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/40 hover:shadow-blue-600/60 hover:-translate-y-1 transition-all duration-300 dark:from-blue-600 dark:to-blue-700 font-semibold"
              >
                Explore Tools
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/demo')}
                className="border-2 border-blue-200/80 dark:border-blue-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300/80 dark:hover:border-blue-600/80 hover:-translate-y-1 transition-all duration-300 text-zinc-900 dark:text-white font-semibold backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5" />
                Try Demo
              </Button>
            </div>

            {/* Trust badge */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2">
              ✨ No credit card required • 100% free • Get started in seconds
            </p>
          </div>

          {/* Right Side - Flow Demo */}
          <div className="relative lg:translate-y-8">
            {/* Layered glow effects */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 rounded-3xl blur-3xl opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-2xl blur-2xl opacity-40 dark:opacity-30 pointer-events-none" />

            {/* Demo container with enhanced styling */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/60 to-blue-50/40 dark:from-slate-900/60 dark:to-blue-950/40 backdrop-blur-xl border border-white/60 dark:border-blue-900/30 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 pointer-events-none" />
              <FlowDemo />
            </div>

            {/* Floating indicator */}
            <div className="absolute -top-4 right-8 inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Live Preview</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}