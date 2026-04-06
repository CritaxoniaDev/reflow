'use client'

import { Header } from './sections/header'
import { Hero } from './sections/hero'
import { Features } from './sections/features'
import { CTA } from './sections/cta'
import { Footer } from './sections/footer'

export function MainContent() {
  return (
    <div className="bg-gradient-to-b from-background to-background">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}