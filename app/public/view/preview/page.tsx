'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CloudLightning, Phone, PaintBucket } from 'lucide-react'
import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import {
    generatePalette,
    applyChelorSchemesToTemplate,
    getContrastColor,
} from '@dashboard/ts/tools/color-studio'

const HeroSection = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    return (
        <section style={{ backgroundColor: colorMap.hero }} className="py-24 px-6 rounded-2xl">
            <div className="max-w-3xl mx-auto text-center">
                <h1 style={{ color: colorMap.text }} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Welcome to Your Website
                </h1>
                <p style={{ color: colorMap.text }} className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed">
                    Experience the beauty of a carefully crafted color palette applied seamlessly across your entire site
                </p>
                <button
                    style={{ backgroundColor: colorMap.accent, color: getContrastColor(colorMap.accent) }}
                    className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity hover:shadow-lg text-lg"
                >
                    Get Started Now
                </button>
            </div>
        </section>
    )
}

const FeaturesSection = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    const features = [
        {
            title: 'Lightning Fast',
            desc: 'Optimized performance for the fastest load times',
            icon: <CloudLightning className="h-10 w-10" />
        },
        {
            title: 'Highly Customizable',
            desc: 'Adapt every color to match your brand identity',
            icon: <PaintBucket className="h-10 w-10" />
        },
        {
            title: 'Fully Responsive',
            desc: 'Perfect on desktop, tablet, and mobile devices',
            icon: <Phone className="h-10 w-10" />
        },
    ]

    return (
        <section className="py-24 px-6 rounded-2xl" style={{ backgroundColor: `${colorMap.lightBg}25` }}>
            <div className="max-w-5xl mx-auto">
                <h2 style={{ color: colorMap.hero }} className="text-4xl md:text-5xl font-bold text-center mb-16">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-xl border-2 transition-all hover:shadow-xl hover:scale-105"
                            style={{
                                borderColor: colors[i % colors.length],
                                backgroundColor: `${colors[i % colors.length]}15`
                            }}
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 style={{ color: colorMap.hero }} className="font-bold text-xl mb-3">
                                {feature.title}
                            </h3>
                            <p style={{ color: colorMap.text }} className="text-base opacity-75">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const PricingSection = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    const plans = [
        { name: 'Starter', price: 29, features: ['5 Projects', 'Basic Support', 'Limited Colors'] },
        { name: 'Pro', price: 59, features: ['Unlimited Projects', 'Priority Support', 'Advanced Tools'], popular: true },
        { name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Dedicated Support', 'Custom Integrations'] },
    ]

    return (
        <section className="py-24 px-6 rounded-2xl" style={{ backgroundColor: colorMap.darker, opacity: 0.97 }}>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{ color: colorMap.text }}>
                    Simple, Transparent Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`p-8 rounded-xl border-2 transition-all ${plan.popular ? 'md:scale-105 shadow-2xl' : ''}`}
                            style={{
                                borderColor: colors[i % colors.length],
                                backgroundColor: plan.popular ? colors[i % colors.length] : `${colors[i % colors.length]}20`
                            }}
                        >
                            {plan.popular && (
                                <div className="mb-4 inline-block px-3 py-1 rounded-full text-sm font-semibold"
                                    style={{ backgroundColor: getContrastColor(colors[i % colors.length]), color: colors[i % colors.length] }}>
                                    Most Popular
                                </div>
                            )}
                            <h3
                                className="text-2xl font-bold mb-4"
                                style={{ color: plan.popular ? getContrastColor(colors[i % colors.length]) : colorMap.text }}
                            >
                                {plan.name}
                            </h3>
                            <p
                                className="text-4xl font-bold mb-8"
                                style={{ color: plan.popular ? getContrastColor(colors[i % colors.length]) : colors[i % colors.length] }}
                            >
                                ${plan.price}<span className="text-lg opacity-75">/mo</span>
                            </p>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li
                                        key={j}
                                        className="text-sm"
                                        style={{ color: plan.popular ? getContrastColor(colors[i % colors.length]) : colorMap.text }}
                                    >
                                        ✓ {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                style={{ backgroundColor: colors[i % colors.length], color: getContrastColor(colors[i % colors.length]) }}
                                className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const GallerySection = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    const projects = [
        'Project Alpha',
        'Project Beta',
        'Project Gamma',
        'Project Delta',
        'Project Epsilon',
        'Project Zeta',
    ]

    return (
        <section className="py-24 px-6 rounded-2xl">
            <div className="max-w-5xl mx-auto">
                <h2 style={{ color: colorMap.hero }} className="text-4xl md:text-5xl font-bold text-center mb-16">
                    Our Work
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, i) => (
                        <div
                            key={i}
                            className="aspect-video rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center font-bold text-xl text-white"
                            style={{ backgroundColor: colors[i % colors.length] }}
                        >
                            {project}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const CTASection = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    return (
        <section
            className="py-24 px-6 rounded-2xl text-center"
            style={{ backgroundColor: colorMap.hero }}
        >
            <div className="max-w-2xl mx-auto">
                <h2 style={{ color: colorMap.text }} className="text-5xl md:text-6xl font-bold mb-6">
                    Ready to Get Started?
                </h2>
                <p style={{ color: colorMap.text }} className="text-lg md:text-xl mb-10 opacity-90">
                    Join thousands of designers and developers who use our color studio to create beautiful palettes
                </p>
                <button
                    style={{ backgroundColor: colorMap.accent, color: getContrastColor(colorMap.accent) }}
                    className="px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity hover:shadow-lg text-lg"
                >
                    Start Free Trial
                </button>
            </div>
        </section>
    )
}

const Newsletter = ({ colors }: { colors: string[] }) => {
    const colorMap = applyChelorSchemesToTemplate(colors)
    return (
        <section className="py-16 px-6 rounded-2xl" style={{ backgroundColor: `${colorMap.lightBg}30` }}>
            <div className="max-w-2xl mx-auto text-center">
                <h3 style={{ color: colorMap.hero }} className="text-2xl font-bold mb-4">
                    Stay Updated
                </h3>
                <p style={{ color: colorMap.text }} className="mb-6 opacity-75">
                    Get the latest color trends and design tips delivered to your inbox
                </p>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': colorMap.accent } as React.CSSProperties}
                    />
                    <button
                        style={{ backgroundColor: colorMap.accent, color: getContrastColor(colorMap.accent) }}
                        className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    )
}

// Separate component for content that uses useSearchParams
function PreviewContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [palette, setPalette] = useState<string[]>([])
    const [isInIframe, setIsInIframe] = useState(false)

    const baseColor = searchParams.get('baseColor') || '#3B82F6'
    const scheme = searchParams.get('scheme') || 'complementary'

    useEffect(() => {
        const newPalette = generatePalette(baseColor, scheme)
        setPalette(newPalette)

        // Check if page is in iframe
        setIsInIframe(window.self !== window.top)
    }, [baseColor, scheme])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">

            {/* Header */}
            {!isInIframe && (
                <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Website Preview
                            </h1>
                            <p className="text-xs text-gray-500">
                                {scheme.charAt(0).toUpperCase() + scheme.slice(1)} scheme • {palette.length} colors
                            </p>
                        </div>

                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex items-center gap-2 shadow-sm hover:shadow-md transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Studio
                        </Button>

                    </div>
                </div>
            )}

            {/* Content */}
            <div
                className={`
        max-w-7xl mx-auto px-6 
        ${isInIframe ? 'py-6 space-y-8' : 'py-12 space-y-16'}
      `}
            >
                <HeroSection colors={palette.length > 0 ? palette : [baseColor]} />
                <FeaturesSection colors={palette.length > 0 ? palette : [baseColor]} />
                <PricingSection colors={palette.length > 0 ? palette : [baseColor]} />
                <GallerySection colors={palette.length > 0 ? palette : [baseColor]} />
                <Newsletter colors={palette.length > 0 ? palette : [baseColor]} />
                <CTASection colors={palette.length > 0 ? palette : [baseColor]} />

                {!isInIframe && (
                    <footer className="border-t border-gray-200 dark:border-gray-800 pt-12 pb-8 text-center text-sm text-gray-500">
                        © 2026 Color Studio. All rights reserved.
                    </footer>
                )}
            </div>
        </div>
    )
}

// Main page component with Suspense
export default function PreviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4">Loading preview...</div>
                </div>
            </div>
        }>
            <PreviewContent />
        </Suspense>
    )
}