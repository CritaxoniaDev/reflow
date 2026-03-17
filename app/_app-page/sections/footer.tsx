'use client'

import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
    Company: [
      { label: 'About Us', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    Resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Community', href: '#community' },
      { label: 'Support', href: '#support' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Status Page', href: '#status' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  ]

  return (
    <footer className="relative border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

      <div className="relative">
        {/* Newsletter Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Stay updated with Reflow
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Get the latest updates on new features and releases
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                  Reflow
                </h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Create stunning flowcharts and collaborate in real-time
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Copyright */}
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                © {currentYear} Reflow Inc. All rights reserved.
              </p>

              {/* Additional Info */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>All systems operational</span>
                </div>
                <a href="#status" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  System Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}