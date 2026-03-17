'use client'

import { Header } from './sections/header'
import { Hero } from './sections/hero'
import { Features } from './sections/features'
import { CTA } from './sections/cta'
import { Footer } from './sections/footer'

export function MainContent() {
  return (
    <div className="bg-gradient-to-b from-background to-background">
      {/* Visual texture - dot pattern on dark sections */}
      <style>{`
        .dot-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.03;
        }
      `}</style>
      
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}