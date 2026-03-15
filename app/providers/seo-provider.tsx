'use client'

import { ReactNode, useEffect } from 'react'

export interface SEOData {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function SEOProvider({ children, seo }: { children: ReactNode; seo?: SEOData }) {
  const defaultSEO = {
    title: 'Reflow - Realtime Flowchart Creator',
    description: 'Reflow: a realtime flowchart creator with collaboration using React Flow. Create, design, and collaborate on flowcharts in real-time.',
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://reflow.app',
  }

  const meta = { ...defaultSEO, ...seo }

  useEffect(() => {
    // Update document title
    document.title = meta.title

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const updateOGMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    updateMeta('description', meta.description)
    updateMeta('viewport', 'width=device-width, initial-scale=1')
    updateMeta('theme-color', '#000000')

    updateOGMeta('og:title', meta.title)
    updateOGMeta('og:description', meta.description)
    updateOGMeta('og:image', meta.image)
    updateOGMeta('og:url', meta.url)
    updateOGMeta('og:type', 'website')

    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', meta.title)
    updateMeta('twitter:description', meta.description)
    updateMeta('twitter:image', meta.image)
  }, [meta])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Reflow',
            description: meta.description,
            url: meta.url,
            image: meta.image,
            applicationCategory: 'Productivity',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      {children}
    </>
  )
}