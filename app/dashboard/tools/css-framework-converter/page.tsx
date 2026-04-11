'use client'

import { useState } from 'react'
import {
  Copy,
  Download,
  ArrowLeft,
  Code,
  GitBranch,
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
  Textarea,
  Skeleton,
} from '@/components/ui'
import Editor from '@monaco-editor/react'
import {
  convertFrameworkToCss,
  generateHierarchicalCss,
  extractHierarchy,
  visualizeHierarchy,
  formatCssOutput,
  frameworkDocs,
  HierarchyNode,
  renderFullHtmlStructure,
  isValidHtml5Tag,
  HTML5_TAGS,
} from '../../_ts/tools/css-framework-converter'

const FRAMEWORKS = [
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'bootstrap', label: 'Bootstrap' },
  { id: 'bulma', label: 'Bulma' },
  { id: 'materialize', label: 'Materialize' },
]

type InputMode = 'classes' | 'hierarchy'

// Helper functions for hierarchy visualization
const countTotalNodes = (node: HierarchyNode | null): number => {
  if (!node) return 0;
  return 1 + node.children.reduce((sum, child) => sum + countTotalNodes(child), 0);
};

const getMaxDepth = (node: HierarchyNode | null, depth = 0): number => {
  if (!node) return depth;
  return Math.max(depth, ...node.children.map(child => getMaxDepth(child, depth + 1)));
};

// Hierarchy Visualizer Component
const HierarchyVisualizer = ({ hierarchy }: { hierarchy: HierarchyNode | null }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!hierarchy) return <p className="text-slate-500">No elements to display</p>;

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNode = (node: HierarchyNode, path: string = '0', depth: number = 0) => {
    const key = path;
    const isExpanded = expanded[key] !== false && node.children.length > 0;
    const hasChildren = node.children.length > 0;

    const getTagColor = (tag: string) => {
      const lower = tag.toLowerCase();
      if (['div', 'section', 'article', 'main'].includes(lower)) return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
      if (['header', 'footer', 'nav'].includes(lower)) return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800';
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(lower)) return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
      if (['p', 'span', 'a', 'button'].includes(lower)) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700';
    };

    return (
      <div key={key} style={{ marginLeft: `${depth * 1.5}rem` }} className="mb-2">
        <div className={`rounded-lg border p-3 transition-colors ${getTagColor(node.tagName)}`}>
          <div className="flex items-start gap-2">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(key)}
                className="mt-0.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {!hasChildren && <span className="mt-0.5 w-4" />}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  &lt;{node.tagName}&gt;
                </code>

                {node.id && (
                  <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-mono border border-red-200 dark:border-red-800">
                    #{node.id}
                  </span>
                )}

                {node.classes.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono border border-blue-200 dark:border-blue-800">
                    .{node.classes.join('.')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-slate-300 dark:border-slate-600 my-1 ml-4">
            {node.children.map((child, idx) =>
              renderNode(child, `${key}-${idx}`, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderNode(hierarchy)}
    </div>
  );
};

export default function CssFrameworkConverter() {
  const router = useRouter()
  const [mode, setMode] = useState<InputMode>('classes')
  const [framework, setFramework] = useState<'tailwind' | 'bootstrap' | 'bulma' | 'materialize'>('tailwind')
  const [input, setInput] = useState('flex flex-col md:flex-row gap-4 p-6 md:p-8 lg:p-12 rounded-lg shadow-md')
  const [selector, setSelector] = useState('.my-component')
  const [copied, setCopied] = useState(false)

  const htmlInput = mode === 'hierarchy' ? input : '';
  const classesInput = mode === 'classes' ? input : '';

  // Generate output based on mode
  let cssOutput = '';
  let htmlStructure = '';
  let hierarchyTree = '';
  let hierarchy: HierarchyNode | null = null;

  if (mode === 'hierarchy') {
    hierarchy = extractHierarchy(htmlInput);
    if (hierarchy) {
      htmlStructure = renderFullHtmlStructure(hierarchy);
      hierarchyTree = visualizeHierarchy(hierarchy);
      cssOutput = generateHierarchicalCss(hierarchy, framework) || '/* No CSS rules generated from classes */';
    } else {
      cssOutput = '/* Unable to parse HTML structure */';
    }
  } else {
    cssOutput = convertFrameworkToCss(classesInput, framework);
    cssOutput = formatCssOutput(selector, cssOutput);
  }

  const formattedOutput = mode === 'hierarchy'
    ? `<!-- Generated CSS for Classes -->\n\n${cssOutput}`
    : cssOutput;

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
                <h1 className="text-3xl font-bold tracking-tight font-mono uppercase">
                  CSS Framework Converter
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {mode === 'hierarchy'
                    ? 'Convert HTML/JSX with framework classes to nested CSS'
                    : 'Convert framework classes to raw CSS'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mode Toggle */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>Input Mode</CardTitle>
                  <CardDescription>Choose conversion type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={mode === 'classes' ? 'default' : 'outline'}
                    onClick={() => {
                      setMode('classes')
                      setInput('flex flex-col md:flex-row gap-4 p-6 md:p-8 lg:p-12 rounded-lg shadow-md')
                      setSelector('.my-component')
                    }}
                    className={`w-full justify-start ${mode === 'classes' ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Utility Classes
                  </Button>
                  <Button
                    variant={mode === 'hierarchy' ? 'default' : 'outline'}
                    onClick={() => {
                      setMode('hierarchy')
                      setInput(`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Tailwind Sample</title>
                            <script src="https://cdn.tailwindcss.com"><\/script>
                        </head>
                        <body class="bg-gray-50 text-gray-800">
                            <nav class="bg-white shadow-md fixed w-full z-50">
                                <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                                    <h1 class="text-xl font-bold text-indigo-600">MyWebsite</h1>
                                    <div class="space-x-6 hidden md:block">
                                        <a href="#" class="hover:text-indigo-600">Home</a>
                                        <a href="#" class="hover:text-indigo-600">Features</a>
                                    </div>
                                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Get Started</button>
                                </div>
                            </nav>
                            <section class="pt-32 pb-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <div class="max-w-7xl mx-auto px-6 text-center">
                                    <h2 class="text-4xl md:text-5xl font-bold mb-6">Build Modern Websites Faster</h2>
                                    <p class="text-lg mb-8">Create beautiful responsive websites using Tailwind CSS</p>
                                    <button class="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">Get Started</button>
                                </div>
                            </section>
                            <section class="py-20">
                                <div class="max-w-7xl mx-auto px-6">
                                    <h3 class="text-3xl font-bold text-center mb-12">Features</h3>
                                    <div class="grid md:grid-cols-3 gap-8">
                                        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                            <h4 class="text-xl font-semibold mb-4">Fast</h4>
                                            <p class="text-gray-600">Build websites quickly with utility-first CSS classes.</p>
                                        </div>
                                        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                            <h4 class="text-xl font-semibold mb-4">Responsive</h4>
                                            <p class="text-gray-600">Mobile-first design for all screen sizes.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <footer class="bg-gray-900 text-white py-8">
                                <div class="max-w-7xl mx-auto px-6 text-center">
                                    <p>© 2026 MyWebsite. All rights reserved.</p>
                                </div>
                            </footer>
                        </body>
                        </html>`)
                      setSelector('')
                    }}
                    className={`w-full justify-start ${mode === 'hierarchy' ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    HTML/JSX Hierarchy
                  </Button>
                </CardContent>
              </Card>

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
                      className={`w-full justify-start ${framework === f.id ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                        }`}
                    >
                      {f.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {mode === 'classes' && (
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
              )}

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
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
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
                  <CardTitle>
                    {mode === 'hierarchy' ? 'HTML/JSX Input' : `${frameworkDocs[framework].name} Classes`}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'hierarchy'
                      ? 'Paste HTML or JSX with framework classes'
                      : 'Enter framework utility classes'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <Editor
                      height="300px"
                      language={mode === 'hierarchy' ? 'html' : 'plaintext'}
                      value={input}
                      onChange={(value) => setInput(value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        fontFamily: "'Fira Code', monospace",
                        formatOnPaste: mode === 'hierarchy',
                        formatOnType: mode === 'hierarchy',
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        lineNumbers: 'on',
                        quickSuggestions: mode === 'hierarchy',
                        autoClosingBrackets: mode === 'hierarchy' ? 'always' : 'never',
                        autoClosingQuotes: mode === 'hierarchy' ? 'always' : 'never',
                        suggestOnTriggerCharacters: mode === 'hierarchy',
                        acceptSuggestionOnCommitCharacter: mode === 'hierarchy',
                        tabSize: 2,
                        insertSpaces: true,
                      }}
                      onMount={(editor) => {
                        editor.focus()
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy Visualization (only in hierarchy mode) */}
              {mode === 'hierarchy' && hierarchyTree && (
                <Card className="border-blue-200/50 dark:border-blue-900/30">
                  <CardHeader>
                    <CardTitle>Element Hierarchy</CardTitle>
                    <CardDescription>Complete HTML structure with tags, IDs, and classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Visual Tree with Complete Tags */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                        <HierarchyVisualizer hierarchy={extractHierarchy(htmlInput)} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                          <p className="text-blue-900 dark:text-blue-300 font-bold text-lg">
                            {extractHierarchy(htmlInput)?.children.length || 0}
                          </p>
                          <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">Root Children</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
                          <p className="text-purple-900 dark:text-purple-300 font-bold text-lg">
                            {countTotalNodes(extractHierarchy(htmlInput))}
                          </p>
                          <p className="text-purple-700 dark:text-purple-400 text-xs mt-1">Total Elements</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                          <p className="text-green-900 dark:text-green-300 font-bold text-lg">
                            {getMaxDepth(extractHierarchy(htmlInput))}
                          </p>
                          <p className="text-green-700 dark:text-green-400 text-xs mt-1">Max Depth</p>
                        </div>
                      </div>

                      {/* Framework Conversion Stats */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                          <p className="text-orange-900 dark:text-orange-300 font-bold text-base">
                            {framework.charAt(0).toUpperCase() + framework.slice(1)}
                          </p>
                          <p className="text-orange-700 dark:text-orange-400 text-xs mt-1">Active Framework</p>
                        </div>
                        <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                          <p className="text-pink-900 dark:text-pink-300 font-bold text-base">
                            {mode === 'hierarchy' ? cssOutput.split('\n').length : formattedOutput.split('\n').length}
                          </p>
                          <p className="text-pink-700 dark:text-pink-400 text-xs mt-1">CSS Lines</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Output */}
              <Card className="border-blue-200/50 dark:border-blue-900/30">
                <CardHeader>
                  <CardTitle>Generated CSS</CardTitle>
                  <CardDescription>
                    {mode === 'hierarchy'
                      ? 'Nested CSS with proper selectors'
                      : 'Formatted CSS output with media queries'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Monaco Editor */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <Editor
                        height="400px"
                        defaultLanguage="css"
                        value={formattedOutput}
                        theme="vs-dark"
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}