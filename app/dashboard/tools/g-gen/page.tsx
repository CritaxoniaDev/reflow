'use client'

import { useState, useEffect } from 'react'
import {
  Copy,
  Download,
  Plus,
  Trash2,
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
} from '@/components/ui'
import {
  generateGradient,
  getGradientCSS,
  getGradientStyle,
  addColorStop,
  removeColorStop,
  updateColorStop,
  presetGradients,
  exportAsScss,
  type Gradient,
  type GradientStop,
} from '../../_ts/tools/g-gen'

export default function GradientGenerator() {
  const router = useRouter()
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

  const handleExportCSS = () => {
    const css = getGradientCSS(gradient)
    const dataStr = `/* Gradient CSS */\n.gradient {\n  ${css.css}\n}`
    const dataBlob = new Blob([dataStr], { type: 'text/css' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gradient-${Date.now()}.css`
    link.click()
  }

  const handleExportSCSS = () => {
    const scss = exportAsScss(gradient, 'gradient-color')
    const dataBlob = new Blob([scss], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gradient-${Date.now()}.scss`
    link.click()
  }

  const gradientCSS = getGradientCSS(gradient)
  const gradientStyle = getGradientStyle(gradient)

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="flex-1 space-y-8 p-6 md:p-8 mx-auto">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                  Gradient Generator
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Create beautiful CSS gradients with ease
                </p>
              </div>
            </div>
          </div>

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
                  {['linear', 'radial', 'conic'].map((type) => (
                    <Button
                      key={type}
                      variant={gradient.type === type ? 'default' : 'outline'}
                      onClick={() => handleTypeChange(type as any)}
                      className={`w-full justify-start ${
                        gradient.type === type ? 'bg-purple-600' : 'border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                      }`}
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
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <span className="text-sm font-medium">Angle</span>
                        <span className="text-lg font-bold text-purple-600">{gradient.angle}°</span>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {['closest-side', 'closest-corner', 'farthest-side', 'farthest-corner'].map((size) => (
                        <Button
                          key={size}
                          variant={gradient.size === size ? 'default' : 'outline'}
                          onClick={() => handleSizeChange(size as any)}
                          size="sm"
                          className={gradient.size === size ? 'bg-purple-600' : 'text-xs'}
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
                    onClick={handleExportCSS}
                    variant="outline"
                    className="w-full border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSS File
                  </Button>
                  <Button
                    onClick={handleExportSCSS}
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

            {/* Gradient Display & Color Stops */}
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
                      <p className="text-sm font-medium mb-2">CSS Code</p>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm overflow-x-auto border border-slate-200 dark:border-slate-700">
                        {gradientCSS.css}
                      </div>
                      <Button
                        onClick={handleCopyCSS}
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedCode === 'css' ? 'Copied!' : 'Copy CSS'}
                      </Button>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Background Image</p>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm overflow-x-auto border border-slate-200 dark:border-slate-700">
                        {gradientCSS.backgroundImage}
                      </div>
                      <Button
                        onClick={handleCopyBackgroundImage}
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedCode === 'backgroundImage' ? 'Copied!' : 'Copy Background'}
                      </Button>
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
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Position</p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) => handlePositionChange(index, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold">{stop.position}%</p>
                      </div>
                      <Button
                        onClick={() => handleRemoveStop(index)}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        disabled={gradient.stops.length === 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}