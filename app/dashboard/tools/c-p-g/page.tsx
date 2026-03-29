'use client'

import { useState, useEffect } from 'react'
import {
  Copy,
  RefreshCw,
  Download,
  Palette,
  ArrowLeft,
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
  Badge,
} from '@/components/ui'
import {
  generatePalette,
  getRandomColor,
  getColorFormats,
} from '../../_ts/tools/cpg'

const SCHEMES = [
  { id: 'complementary', label: 'Complementary', description: 'Opposite colors' },
  { id: 'analogous', label: 'Analogous', description: 'Adjacent colors' },
  { id: 'triadic', label: 'Triadic', description: '3 evenly spaced colors' },
  { id: 'tetradic', label: 'Tetradic', description: '4 evenly spaced colors' },
  { id: 'monochromatic', label: 'Monochromatic', description: 'Same hue, different lightness' },
  { id: 'shades', label: 'Shades', description: 'Darker versions' },
  { id: 'tints', label: 'Tints', description: 'Lighter versions' },
]

export default function ColorPaletteGenerator() {
  const router = useRouter()
  const [baseColor, setBaseColor] = useState('#3B82F6')
  const [scheme, setScheme] = useState('complementary')
  const [palette, setPalette] = useState<string[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex')

  useEffect(() => {
    const newPalette = generatePalette(baseColor, scheme)
    setPalette(newPalette)
  }, [baseColor, scheme])

  const handleRandomColor = () => {
    setBaseColor(getRandomColor())
  }

  const handleCopyColor = (color: string) => {
    const formats = getColorFormats(color)
    const textToCopy = formats[selectedFormat]

    navigator.clipboard.writeText(textToCopy)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handleExportJSON = () => {
    const exportData = {
      baseColor,
      scheme,
      palette,
      colors: palette.map((color) => ({
        color,
        ...getColorFormats(color),
      })),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `palette-${scheme}-${Date.now()}.json`
    link.click()
  }

  const handleExportCSS = () => {
    let cssContent = `:root {\n`

    palette.forEach((color, index) => {
      cssContent += `  --color-${index + 1}: ${color};\n`
    })

    cssContent += `}\n`

    const dataBlob = new Blob([cssContent], { type: 'text/css' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `palette-${scheme}-${Date.now()}.css`
    link.click()
  }

  const currentColor = getColorFormats(baseColor)

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="flex-1 space-y-8 p-6 md:p-8 mx-auto">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-950/30">
                <Palette className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                  Color Palette Generator
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Generate beautiful color schemes based on color theory
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-pink-200/50 dark:border-pink-900/30">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Customize your palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Color Picker */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Base Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="h-12 w-20 rounded-lg cursor-pointer border border-input"
                      />
                      <input
                        type="text"
                        value={baseColor}
                        onChange={(e) => {
                          const val = e.target.value
                          if (/^#[0-9A-F]{6}$/i.test(val)) {
                            setBaseColor(val)
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  {/* Color Formats */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Copy Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                        <Button
                          key={format}
                          variant={selectedFormat === format ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedFormat(format)}
                          className="text-xs"
                        >
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Color Info */}
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 text-sm font-mono border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">HEX:</span>
                      <span className="font-semibold">{currentColor.hex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">RGB:</span>
                      <span className="font-semibold">{currentColor.rgb}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">HSL:</span>
                      <span className="font-semibold">{currentColor.hsl}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button 
                      onClick={handleRandomColor} 
                      variant="outline" 
                      className="w-full border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30" 
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Random Color
                    </Button>
                    <Button 
                      onClick={handleExportJSON} 
                      variant="outline" 
                      className="w-full border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button 
                      onClick={handleExportCSS} 
                      variant="outline" 
                      className="w-full border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Palette Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scheme Selection */}
              <Card className="border-pink-200/50 dark:border-pink-900/30 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                  <CardDescription>Select a color harmony</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SCHEMES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setScheme(s.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          scheme === s.id
                            ? 'border-pink-600 bg-pink-50 dark:bg-pink-950'
                            : 'border-input hover:border-pink-300'
                        }`}
                      >
                        <div className="text-sm font-semibold">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Palette Preview */}
              <Card className="border-pink-200/50 dark:border-pink-900/30 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Generated Palette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Swatches */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {palette.map((color, index) => (
                      <div
                        key={index}
                        className="space-y-2 group"
                        onClick={() => handleCopyColor(color)}
                      >
                        <div
                          className="h-24 rounded-lg border-2 border-input cursor-pointer hover:border-pink-500 transition-all shadow-sm hover:shadow-md"
                          style={{ backgroundColor: color }}
                        />
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-semibold text-center truncate">{color}</div>
                          {copiedColor === color && (
                            <div className="text-xs text-center text-green-600 font-medium">
                              ✓ Copied!
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs h-7 border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyColor(color)
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedColor === color ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Color Details Table */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <h3 className="font-semibold text-sm">Color Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {palette.map((color, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 cursor-pointer hover:shadow-md transition-all border border-slate-200 dark:border-slate-700"
                          onClick={() => handleCopyColor(color)}
                        >
                          <div className="text-xs font-mono font-semibold mb-2 flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {getColorFormats(color)[selectedFormat]}
                          </div>
                        </div>
                      ))}
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