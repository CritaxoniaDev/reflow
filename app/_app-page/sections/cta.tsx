'use client'

import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui'

export function CTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Enhanced layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-cyan-50/50 dark:from-blue-950/30 dark:via-transparent dark:to-cyan-950/30 pointer-events-none" />
      
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Multiple glow layers */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 blur-3xl opacity-60 dark:opacity-40 pointer-events-none" />

        {/* CTA Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/40 dark:border-blue-900/40 p-12 sm:p-16 lg:p-20 backdrop-blur-xl">
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-cyan-50/20 dark:from-slate-900/70 dark:via-blue-950/50 dark:to-cyan-950/30" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 dark:to-white/2" />
          
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-blue-200/50 via-transparent to-cyan-200/50 dark:from-blue-800/30 dark:to-cyan-800/30 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200/60 dark:border-blue-800/60 px-4 py-2.5 shadow-sm">
              <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/40">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Limited time offer
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Ready to create
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  amazing flowcharts?
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Start for free and collaborate with your team today. No credit card required.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:-translate-y-1 transition-all duration-300 dark:from-blue-600 dark:to-blue-700 font-semibold"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-200/80 dark:border-blue-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300/80 dark:hover:border-blue-600/80 hover:-translate-y-1 transition-all duration-300 text-zinc-900 dark:text-white font-semibold"
              >
                Schedule Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/20 dark:border-white/5">
              {/* Badge 1 */}
              <div className="group p-4 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Trusted by</p>
                <p className="font-bold text-lg bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 bg-clip-text text-transparent">
                  10,000+ teams
                </p>
              </div>

              {/* Badge 2 */}
              <div className="group p-4 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/40 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Free forever plan</p>
                <p className="font-bold text-lg bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 bg-clip-text text-transparent">
                  For individuals
                </p>
              </div>

              {/* Badge 3 */}
              <div className="group p-4 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/40 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Enterprise ready</p>
                <p className="font-bold text-lg bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 bg-clip-text text-transparent">
                  Full API access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}