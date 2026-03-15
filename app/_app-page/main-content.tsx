'use client'

import { Header } from './sections/header'
import { Hero } from './sections/hero'
import { Features } from './sections/features'
import { CTA } from './sections/cta'
import { Footer } from './sections/footer'

export function MainContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}