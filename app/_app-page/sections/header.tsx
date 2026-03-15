'use client'

import { NavLink } from '@/components/common/nav-link'
import { AnimatedThemeToggler } from '@/components/common/animated-theme-toggler'
import { Button } from '@/components/ui'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
              ReFLOW
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink label="Features" href="#features" />
            <NavLink label="Docs" href="#docs" />
            <NavLink label="Pricing" href="#pricing" />
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}