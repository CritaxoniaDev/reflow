'use client'

import { useRouter } from 'next/navigation'
import {
  Palette,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Copy,
  ArrowLeft,
  Check,
  Sparkles,
  Eye,
} from 'lucide-react'
import {
  SidebarInset,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Skeleton,
} from '@/components/ui'
import { useState, useEffect } from 'react'
import {
  generatePalette,
  getColorFormats,
  getRandomColor,
  getContrastColor,
  Gradient,
  updateColorStop,
  addColorStop,
  removeColorStop,
  getGradientCSS,
  getGradientStyle,
  exportAsScss,
  presetGradients,
} from '../../_ts/tools/color-studio'

const SCHEMES = [
  { id: 'complementary', label: 'Complementary', description: 'Opposite colors' },
  { id: 'analogous', label: 'Analogous', description: 'Adjacent colors' },
  { id: 'triadic', label: 'Triadic', description: '3 evenly spaced colors' },
  { id: 'tetradic', label: 'Tetradic', description: '4 evenly spaced colors' },
  { id: 'monochromatic', label: 'Monochromatic', description: 'Same hue, different lightness' },
  { id: 'shades', label: 'Shades', description: 'Darker versions' },
  { id: 'tints', label: 'Tints', description: 'Lighter versions' },
]

const INITIAL_RANDOM_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

// Skeleton Components
const ColorExplorerSkeleton = () => (
  <Card className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-lg p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-12 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-5 gap-3 h-96">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="rounded-lg" />
      ))}
    </div>
  </Card>
)

const SettingsPanelSkeleton = () => (
  <Card className="border-pink-200/50 dark:border-pink-900/30">
    <CardHeader className="pb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48 mt-2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-3">
          <Skeleton className="h-14 w-16 rounded-lg" />
          <Skeleton className="h-14 flex-1 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
)

const PalettePreviewSkeleton = () => (
  <Card className="border-pink-200/50 dark:border-pink-900/30">
    <CardHeader className="pb-4">
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </CardContent>
  </Card>
)

const SchemeSelectionSkeleton = () => (
  <Card className="border-pink-200/50 dark:border-pink-900/30">
    <CardHeader className="pb-4">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </CardContent>
  </Card>
)

export default function ColorStudio() {
  const router = useRouter()

  // Loading State
  const [isLoading, setIsLoading] = useState(true)

  // Palette Generator State
  const [baseColor, setBaseColor] = useState('#3B82F6')
  const [scheme, setScheme] = useState('complementary')
  const [palette, setPalette] = useState<string[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex')
  const [randomColors, setRandomColors] = useState<string[]>(INITIAL_RANDOM_COLORS)
  const [randomCount, setRandomCount] = useState(5)
  const [copiedRandomColor, setCopiedRandomColor] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Gradient Generator State
  const [gradient, setGradient] = useState<Gradient>({
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#6366F1', position: 0 },
      { color: '#EC4899', position: 100 },
    ],
    size: 'farthest-corner',
  })
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Watch baseColor and scheme changes
  useEffect(() => {
    const newPalette = generatePalette(baseColor, scheme)
    setPalette(newPalette)
  }, [baseColor, scheme])

  // Initialize on client mount
  useEffect(() => {
    setIsClient(true)
    setRandomColors(Array.from({ length: randomCount }, () => getRandomColor()))

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Space bar listener for random colors
  useEffect(() => {
    if (!isClient) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleRegenerateRandomColors()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [randomCount, isClient])

  // Palette Handlers
  const handleRandomColor = () => {
    const newColor = getRandomColor()
    setBaseColor(newColor)
    setRandomColors(Array.from({ length: randomCount }, () => getRandomColor()))
  }

  const handleRegenerateRandomColors = () => {
    const newColors = Array.from({ length: randomCount }, () => getRandomColor())
    setRandomColors(newColors)
    setBaseColor(newColors[0])
  }

  const handleIncreaseRandomColors = () => {
    if (randomCount < 7) {
      const newCount = randomCount + 1
      setRandomCount(newCount)
      const newColors = Array.from({ length: newCount }, () => getRandomColor())
      setRandomColors(newColors)
      setBaseColor(newColors[0])
    }
  }

  const handleDecreaseRandomColors = () => {
    if (randomCount > 2) {
      const newCount = randomCount - 1
      setRandomCount(newCount)
      const newColors = randomColors.slice(0, newCount)
      setRandomColors(newColors)
      setBaseColor(newColors[0])
    }
  }

  const handleSelectRandomColor = (color: string) => {
    setBaseColor(color)
    const formats = getColorFormats(color)
    const textToCopy = formats[selectedFormat]
    navigator.clipboard.writeText(textToCopy)
    setCopiedRandomColor(color)
    setTimeout(() => setCopiedRandomColor(null), 2000)
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

  // Gradient Handlers
  const handleTypeChange = (type: 'linear' | 'radial' | 'conic') => {
    setGradient({ ...gradient, type })
  }

  const handleAngleChange = (angle: number) => {
    setGradient({ ...gradient, angle })
  }

  const handleSizeChange = (size: 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner') => {
    setGradient({ ...gradient, size })
  }

  const handleColorChange = (index: number, color: string) => {
    setGradient({
      ...gradient,
      stops: updateColorStop(gradient.stops, index, color),
    })
  }

  const handlePositionChange = (index: number, position: number) => {
    setGradient({
      ...gradient,
      stops: updateColorStop(gradient.stops, index, undefined, position),
    })
  }

  const handleAddStop = () => {
    const lastStop = gradient.stops[gradient.stops.length - 1]
    const newPosition = Math.min(lastStop.position + 20, 100)
    setGradient({
      ...gradient,
      stops: addColorStop(gradient.stops, '#000000', newPosition),
    })
  }

  const handleRemoveStop = (index: number) => {
    if (gradient.stops.length > 2) {
      setGradient({
        ...gradient,
        stops: removeColorStop(gradient.stops, index),
      })
    }
  }

  const handleApplyPreset = (presetName: string) => {
    setGradient(presetGradients[presetName])
  }

  const handleCopyCSS = () => {
    const css = getGradientCSS(gradient)
    navigator.clipboard.writeText(css.css)
    setCopiedCode('css')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleCopyBackgroundImage = () => {
    const css = getGradientCSS(gradient)
    navigator.clipboard.writeText(css.backgroundImage)
    setCopiedCode('backgroundImage')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleExportGradientCSS = () => {
    const css = getGradientCSS(gradient)
    const dataStr = `/* Gradient CSS */\n.gradient {\n  ${css.css}\n}`
    const dataBlob = new Blob([dataStr], { type: 'text/css' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gradient-${Date.now()}.css`
    link.click()
  }

  const handleExportGradientSCSS = () => {
    const scss = exportAsScss(gradient, 'gradient-color')
    const dataBlob = new Blob([scss], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gradient-${Date.now()}.scss`
    link.click()
  }

  const handlePreviewWebsite = () => {
    router.push(`/public/view/preview?baseColor=${encodeURIComponent(baseColor)}&scheme=${encodeURIComponent(scheme)}`)
  }

  const gradientCSS = getGradientCSS(gradient)
  const gradientStyle = getGradientStyle(gradient)

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
                <Palette className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight font-mono uppercase">
                  Color Studio
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Create palettes and gradients with ease
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="palette" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="palette">Palette Generator</TabsTrigger>
              <TabsTrigger value="gradient">Gradient Generator</TabsTrigger>
            </TabsList>

            {/* Palette Tab */}
            <TabsContent value="palette" className="space-y-6">
              {/* Random Color Explorer - With Skeleton */}
              {isLoading ? (
                <ColorExplorerSkeleton />
              ) : (
                <Card className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Quick Color Explorer</h2>
                      <p className="text-sm text-muted-foreground">Click any color to set as base. Press SPACE to regenerate. Count: {randomCount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDecreaseRandomColors}
                        disabled={randomCount <= 2}
                        variant="outline"
                        size="sm"
                        className="border-pink-200 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 text-sm font-semibold">{randomCount}</span>
                      <Button
                        onClick={handleIncreaseRandomColors}
                        disabled={randomCount >= 7}
                        variant="outline"
                        size="sm"
                        className="border-pink-200 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={`grid h-96 ${randomCount === 2 ? 'grid-cols-2' :
                    randomCount === 3 ? 'grid-cols-3' :
                      randomCount === 4 ? 'grid-cols-4' :
                        randomCount === 5 ? 'grid-cols-5' :
                          randomCount === 6 ? 'grid-cols-6' :
                            'grid-cols-7'
                    }`}>
                    {randomColors.map((color, index) => (
                      <div
                        key={index}
                        className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl ${baseColor === color ? 'ring-4 ring-pink-500' : ''}`}
                        onClick={() => handleSelectRandomColor(color)}
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                          <div className="text-lg font-mono font-semibold text-white mb-2">{color}</div>
                          {copiedRandomColor === color ? (
                            <div className="text-xs font-medium text-green-300 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Set & Copied!
                            </div>
                          ) : (
                            <div className="text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to set base
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Preview Button */}
              <Button
                onClick={handlePreviewWebsite}
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg border border-pink-200 dark:border-pink-700/30 bg-white dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-pink-600 dark:text-pink-400 font-semibold text-sm flex items-center justify-center gap-2 h-10 disabled:opacity-50"
                variant="outline"
              >
                <Eye className="h-4 w-4" />
                Preview Website
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel - With Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                  {isLoading ? (
                    <SettingsPanelSkeleton />
                  ) : (
                    <Card className="border-pink-200/50 dark:border-pink-900/30 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5 text-pink-600" />
                          Settings
                        </CardTitle>
                        <CardDescription>Customize your palette</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Color Picker */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span>Base Color</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 font-medium">
                              Primary
                            </span>
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="color"
                              value={baseColor}
                              onChange={(e) => setBaseColor(e.target.value)}
                              className="h-14 w-16 rounded-lg cursor-pointer border-2 border-pink-200 dark:border-pink-700/50 hover:border-pink-400 dark:hover:border-pink-600 transition-colors shadow-md"
                            />
                            <input
                              type="text"
                              value={baseColor}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase()
                                if (/^#[0-9A-F]{6}$/i.test(val)) setBaseColor(val)
                              }}
                              className="flex-1 px-4 py-3 rounded-lg border border-pink-200/50 dark:border-pink-700/30 bg-white dark:bg-slate-900 text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/50 hover:border-pink-300 dark:hover:border-pink-600/50 transition-colors"
                              placeholder="#000000"
                            />
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-pink-200/50 to-transparent dark:via-pink-900/30" />

                        {/* Color Format Selector */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-zinc-900 dark:text-white">Copy Format</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                              <Button
                                key={format}
                                variant={selectedFormat === format ? 'default' : 'outline'}
                                onClick={() => setSelectedFormat(format)}
                                className={`text-sm ${selectedFormat === format ? 'bg-pink-600' : 'border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30'}`}
                                size="sm"
                              >
                                {format.toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Color Info */}
                        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-pink-50/70 to-rose-50/40 dark:from-pink-950/30 dark:to-pink-900/20 border border-pink-200/60 dark:border-pink-800/40">
                          <div className="space-y-2.5">
                            {[
                              { label: 'HEX', value: currentColor.hex },
                              { label: 'RGB', value: currentColor.rgb },
                              { label: 'HSL', value: currentColor.hsl },
                            ].map(({ label, value }) => (
                              <div key={label} className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-zinc-900 dark:text-white">{label}:</span>
                                <span className="font-mono text-pink-700 dark:text-pink-400">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Current Scheme Info */}
                        <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Current Scheme:</p>
                          <p className="text-sm font-mono text-blue-700 dark:text-blue-400">
                            {SCHEMES.find(s => s.id === scheme)?.label}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2.5 pt-2 border-t border-pink-200/50 dark:border-pink-800/30">
                          <Button
                            onClick={handleRandomColor}
                            variant="secondary"
                            className="w-full border-pink-200/50 hover:bg-pink-100/60 dark:hover:bg-pink-950/40 transition-all h-10 font-semibold"
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Random Base Color
                          </Button>
                          <Button
                            onClick={handleExportJSON}
                            variant="outline"
                            className="w-full border-pink-200/50 hover:bg-pink-50 dark:hover:bg-pink-950/30 h-10 font-semibold"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export JSON
                          </Button>
                          <Button
                            onClick={handleExportCSS}
                            variant="outline"
                            className="w-full border-pink-200/50 hover:bg-pink-50 dark:hover:bg-pink-950/30 h-10 font-semibold"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSS
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Palette Display - With Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Scheme Selection */}
                  {isLoading ? (
                    <SchemeSelectionSkeleton />
                  ) : (
                    <Card className="border-pink-200/50 dark:border-pink-900/30 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-pink-600" />
                          Color Scheme
                        </CardTitle>
                        <CardDescription>Select a color harmony</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {SCHEMES.map((s) => (
                            <Button
                              key={s.id}
                              variant={scheme === s.id ? 'default' : 'outline'}
                              onClick={() => setScheme(s.id)}
                              className={`flex flex-col h-auto py-3 ${scheme === s.id ? 'bg-pink-600' : 'border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30'}`}
                              size="sm"
                            >
                              <span className="text-xs font-semibold">{s.label}</span>
                              <span className="text-xs opacity-70">{s.description}</span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Palette Preview */}
                  {isLoading ? (
                    <PalettePreviewSkeleton />
                  ) : (
                    <Card className="border-pink-200/50 dark:border-pink-900/30 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                          Generated Palette
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {palette.length} colors
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Color Swatches */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {palette.map((color, index) => (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-pink-500 transition-all cursor-pointer h-24"
                              onClick={() => handleCopyColor(color)}
                              style={{ backgroundColor: color }}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                {copiedColor === color ? (
                                  <div className="flex items-center gap-1 text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded">
                                    <Check className="h-3 w-3" />
                                    Copied
                                  </div>
                                ) : (
                                  <Copy className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-mono">
                                {color}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Color Details */}
                        {palette.length > 0 && (
                          <div className="space-y-3 pt-4 border-t border-pink-200/50 dark:border-pink-800/30">
                            <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                              Color Details
                            </div>
                            <div className="space-y-2">
                              {palette.map((color, index) => {
                                const formats = getColorFormats(color)
                                return (
                                  <div key={index} className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-6 h-6 rounded border border-slate-300" style={{ backgroundColor: color }} />
                                      <span className="font-mono font-semibold">{color}</span>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400 font-mono">
                                      RGB: {formats.rgb} | HSL: {formats.hsl}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Gradient Tab */}
            <TabsContent value="gradient" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Gradient Type */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30">
                    <CardHeader>
                      <CardTitle>Gradient Type</CardTitle>
                      <CardDescription>Choose gradient style</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(['linear', 'radial', 'conic'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={gradient.type === type ? 'default' : 'outline'}
                          onClick={() => handleTypeChange(type)}
                          className={`w-full justify-start ${gradient.type === type ? 'bg-purple-600' : 'border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30'}`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Angle/Size Control */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30">
                    <CardHeader>
                      <CardTitle>{gradient.type === 'linear' || gradient.type === 'conic' ? 'Angle' : 'Size'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {gradient.type === 'linear' || gradient.type === 'conic' ? (
                        <>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradient.angle}
                            onChange={(e) => handleAngleChange(Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-sm font-semibold text-center">{gradient.angle}°</div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {(['closest-side', 'closest-corner', 'farthest-side', 'farthest-corner'] as const).map((size) => (
                            <Button
                              key={size}
                              variant={gradient.size === size ? 'default' : 'outline'}
                              onClick={() => handleSizeChange(size)}
                              className="text-xs"
                              size="sm"
                            >
                              {size.split('-')[0]}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Presets */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30">
                    <CardHeader>
                      <CardTitle>Presets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.keys(presetGradients).map((preset) => (
                        <Button
                          key={preset}
                          variant="outline"
                          onClick={() => handleApplyPreset(preset)}
                          className="w-full justify-start text-sm border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                        >
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Export Options */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30">
                    <CardHeader>
                      <CardTitle>Export</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        onClick={handleExportGradientCSS}
                        variant="outline"
                        className="w-full border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSS File
                      </Button>
                      <Button
                        onClick={handleExportGradientSCSS}
                        variant="outline"
                        className="w-full border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        SCSS File
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Gradient Display */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Preview */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30 hover:shadow-md transition-shadow overflow-hidden">
                    <div
                      className="h-64 w-full border-b border-purple-200 dark:border-purple-900/30"
                      style={gradientStyle}
                    />
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">CSS</label>
                          <div className="flex gap-2">
                            <code className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono break-all">
                              {gradientCSS.css}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCopyCSS}
                              className={copiedCode === 'css' ? 'bg-green-50 dark:bg-green-950/30' : ''}
                            >
                              {copiedCode === 'css' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Background Image</label>
                          <div className="flex gap-2">
                            <code className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono break-all">
                              {gradientCSS.backgroundImage}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCopyBackgroundImage}
                              className={copiedCode === 'backgroundImage' ? 'bg-green-50 dark:bg-green-950/30' : ''}
                            >
                              {copiedCode === 'backgroundImage' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Color Stops */}
                  <Card className="border-purple-200/50 dark:border-purple-900/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Color Stops</CardTitle>
                        <CardDescription>Edit gradient colors</CardDescription>
                      </div>
                      <Button
                        onClick={handleAddStop}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {gradient.stops.map((stop, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        >
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="h-10 w-12 rounded cursor-pointer border border-input"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) => handlePositionChange(index, Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm font-mono font-semibold w-12 text-right">{stop.position}%</span>
                          <Button
                            onClick={() => handleRemoveStop(index)}
                            variant="ghost"
                            size="sm"
                            disabled={gradient.stops.length <= 2}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  )
}