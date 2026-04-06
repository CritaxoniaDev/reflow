'use client'

import { useState } from 'react'
import {
  Copy,
  Download,
  ArrowLeft,
  Code,
} from 'lucide-react'
import {
  SidebarInset,
} from '@/packages/shadcn-v1/sidebar'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import Editor from '@monaco-editor/react'
import {
  convertFrameworkToCss,
  generateCssFile,
  exportAsScss,
  formatCssOutput,
  frameworkDocs,
} from '../../_ts/tools/cfc'

const FRAMEWORKS = [
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'bootstrap', label: 'Bootstrap' },
  { id: 'bulma', label: 'Bulma' },
  { id: 'materialize', label: 'Materialize' },
]

export default function CssFrameworkConverter() {
  const router = useRouter()
  const [framework, setFramework] = useState<'tailwind' | 'bootstrap' | 'bulma' | 'materialize'>('tailwind')
  const [input, setInput] = useState('flex flex-col md:flex-row gap-4 p-6 md:p-8 lg:p-12 rounded-lg shadow-md')
  const [selector, setSelector] = useState('.my-component')
  const [copied, setCopied] = useState(false)

  const cssOutput = convertFrameworkToCss(input, framework)
  const formattedOutput = formatCssOutput(selector, cssOutput)

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCss = () => {
    const blob = new Blob([formattedOutput], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `styles-${Date.now()}.css`
    link.click()
  }

  const handleDownloadScss = () => {
    const blob = new Blob([formattedOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `styles-${Date.now()}.scss`
    link.click()
  }

  const doc = frameworkDocs[framework]

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="flex-1 space-y-8 p-6 md:p-8 mx-auto">
          {/* Header */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                  CSS Framework Converter
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Convert framework classes to raw CSS
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Framework Selection */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>Select Framework</CardTitle>
                  <CardDescription>Choose a CSS framework</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {FRAMEWORKS.map((f) => (
                    <Button
                      key={f.id}
                      variant={framework === f.id ? 'default' : 'outline'}
                      onClick={() => setFramework(f.id as any)}
                      className={`w-full justify-start ${
                        framework === f.id ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      {f.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* CSS Selector */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>CSS Selector</CardTitle>
                  <CardDescription>Set the selector for output</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="text"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder=".my-component"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: .my-class, #my-id, div.my-class
                  </p>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={handleDownloadCss}
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSS File
                  </Button>
                  <Button
                    onClick={handleDownloadScss}
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    SCSS File
                  </Button>
                </CardContent>
              </Card>

              {/* Framework Documentation */}
              <Card className="border-blue-200/50 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">{doc?.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc?.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => window.open(doc?.docs, '_blank')}
                    >
                      View Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Converter */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>{frameworkDocs[framework].name} Classes</CardTitle>
                  <CardDescription>Enter framework utility classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter framework classes here..."
                    className="w-full h-32 px-3 py-2 rounded-lg border border-input bg-background font-mono text-sm resize-none"
                  />
                </CardContent>
              </Card>

              {/* Output */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Generated CSS</CardTitle>
                    <CardDescription>Formatted CSS output with media queries</CardDescription>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Monaco Editor */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <Editor
                        height="300px"
                        defaultLanguage="css"
                        value={formattedOutput}
                        theme="light"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 13,
                          fontFamily: "'Fira Code', monospace",
                          formatOnPaste: false,
                          formatOnType: false,
                          wordWrap: 'on',
                          padding: { top: 16, bottom: 16 },
                        }}
                      />
                    </div>

                    {/* Rules Summary */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Conversion Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <p className="text-xs text-slate-600 dark:text-slate-400">Input Classes</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{input.split(' ').length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <p className="text-xs text-slate-600 dark:text-slate-400">CSS Rules</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{cssOutput.split(';').filter(r => r.trim() && !r.includes('@media')).length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <p className="text-xs text-slate-600 dark:text-slate-400">Media Queries</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{(cssOutput.match(/@media/g) || []).length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-blue-200/50 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle>Tips & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• Enter space-separated utility classes</li>
                    <li>• <strong>Responsive classes:</strong> Use breakpoint prefixes (sm:, md:, lg:, xl:, 2xl:)</li>
                    <li>• Example: <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">md:flex lg:p-4 xl:gap-6</code></li>
                    <li>• Output automatically formats with media queries</li>
                    <li>• Customize CSS selector for your use case</li>
                    <li>• Export as CSS or SCSS file with preserved formatting</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}