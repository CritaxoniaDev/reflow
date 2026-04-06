'use client'

import { format } from 'date-fns'
import { Badge, Separator, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Card, CardContent, CardDescription, CardHeader, CardTitle, ScrollArea } from '@/components/ui'
import { changelogData } from './data/data'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ChangelogPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-950">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                Changelog
              </span>
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Updates and improvements to Reflow
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {changelogData.map((release, releaseIdx) => (
              <div key={releaseIdx}>
                {/* Timeline Layout */}
                <div className="relative flex gap-8">
                  {/* Vertical timeline line - visible on md and up */}
                  <div className="hidden md:block absolute top-0 left-32 w-px h-full bg-zinc-200 dark:bg-zinc-800" />

                  {/* Vertical timeline dot */}
                  <div className="hidden md:block absolute top-8 left-[7.8rem] w-3 h-3 -translate-x-0.5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 dark:ring-slate-950 shadow-lg z-10" />

                  {/* Left Side - Timeline */}
                  <div className="hidden sm:flex flex-col items-center w-32 flex-shrink-0">
                    {/* Sticky content container */}
                    <div className="sticky top-30 flex flex-col items-center w-full">
                      {/* Date */}
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3 text-center">
                        {format(new Date(release.date), 'MMM dd')}
                      </div>

                      {/* Version Badge */}
                      <div className="flex flex-col items-center w-full relative z-10">
                        <div className="relative mb-4">
                          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-3 py-1 shadow-lg shadow-blue-600/30">
                            {release.version}
                          </Badge>
                        </div>

                        {/* Timeline dot */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-blue-600/50 dark:shadow-blue-400/30 mb-4" />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Content Card */}
                  <div className="flex-1 min-w-0">
                    {/* Release Header Card */}
                    <Card className="mb-8 border-zinc-200 dark:border-zinc-800">
                      <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl text-zinc-900 dark:text-white">
                          {release.title}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 pt-3">
                          {release.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {release.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Video Preview Placeholder */}
                    {release.videoPreview && (
                      <Card className="mb-8 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-600/20 dark:bg-blue-400/20 flex items-center justify-center mx-auto mb-2">
                              <span className="text-2xl">▶</span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Video Preview</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Collapsible Sections using Accordion */}
                    <Accordion defaultValue={release.sections.map((_, idx) => `section-${releaseIdx}-${idx}`)}>
                      {release.sections.map((section, sectionIdx) => {
                        const SectionIcon = section.icon
                        return (
                          <AccordionItem
                            key={sectionIdx}
                            value={`section-${releaseIdx}-${sectionIdx}`}
                            className="border-zinc-200 dark:border-zinc-800 mb-4"
                          >
                            <AccordionTrigger className="hover:bg-zinc-50 dark:hover:bg-slate-800 px-6 data-[state=open]:bg-zinc-50 dark:data-[state=open]:bg-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
                                  <SectionIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    {section.title}
                                  </h3>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-zinc-50 dark:bg-slate-950/50 border-t border-zinc-200 dark:border-zinc-800 px-0 pt-0">
                              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {section.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="px-6 py-5 first:pt-5 last:pb-5">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                      <h4 className="font-semibold text-zinc-900 dark:text-white">
                                        {item.title}
                                      </h4>
                                      {item.isPriority && (
                                        <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs shrink-0">
                                          Featured
                                        </Badge>
                                      )}
                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                      {item.description}
                                    </p>

                                    {/* Code Block Card */}
                                    {item.codeExample && (
                                      <Card className="mt-4 border-slate-700 dark:border-slate-700 bg-slate-900 dark:bg-slate-950 overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800">
                                          <span className="text-xs font-medium text-slate-400">Code</span>
                                          <button
                                            onClick={() => copyToClipboard(item.codeExample!, `code-${releaseIdx}-${sectionIdx}-${itemIdx}`)}
                                            className="p-1.5 rounded hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors"
                                            title="Copy code"
                                          >
                                            {copiedCode === `code-${releaseIdx}-${sectionIdx}-${itemIdx}` ? (
                                              <Check className="w-4 h-4 text-green-400" />
                                            ) : (
                                              <Copy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                                            )}
                                          </button>
                                        </div>
                                        <CardContent className="p-0">
                                          <ScrollArea className="w-full">
                                            <pre className="px-4 py-3">
                                              <code className="text-sm text-slate-300 font-mono leading-relaxed">
                                                {item.codeExample}
                                              </code>
                                            </pre>
                                          </ScrollArea>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </div>
                </div>

                {/* Separator between changelog entries */}
                {releaseIdx < changelogData.length - 1 && (
                  <Separator className="bg-zinc-200 dark:bg-zinc-800" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Section Card */}
          <Card className="mt-24 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="text-center">
              <CardTitle>More updates coming soon</CardTitle>
              <CardDescription className="text-base">
                Follow our progress and roadmap on GitHub
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 justify-center pb-6">
              <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all">
                Get Started
              </button>
              <button className="px-6 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-semibold transition-colors">
                View Roadmap
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}