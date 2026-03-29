export interface GradientStop {
  color: string
  position: number
}

export interface Gradient {
  type: 'linear' | 'radial' | 'conic'
  angle: number
  stops: GradientStop[]
  size: 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'
}

export interface GradientCSS {
  css: string
  backgroundImage: string
}

// Generate linear gradient CSS
export const generateLinearGradient = (angle: number, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `linear-gradient(${angle}deg, ${stopString})`
}

// Generate radial gradient CSS
export const generateRadialGradient = (size: string, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `radial-gradient(${size}, ${stopString})`
}

// Generate conic gradient CSS
export const generateConicGradient = (angle: number, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `conic-gradient(from ${angle}deg, ${stopString})`
}

// Generate gradient based on type
export const generateGradient = (gradient: Gradient): string => {
  switch (gradient.type) {
    case 'linear':
      return generateLinearGradient(gradient.angle, gradient.stops)
    case 'radial':
      return generateRadialGradient(gradient.size, gradient.stops)
    case 'conic':
      return generateConicGradient(gradient.angle, gradient.stops)
    default:
      return generateLinearGradient(0, gradient.stops)
  }
}

// Generate full CSS code
export const getGradientCSS = (gradient: Gradient): GradientCSS => {
  const gradientValue = generateGradient(gradient)

  return {
    css: `background: ${gradientValue};`,
    backgroundImage: `background-image: ${gradientValue};`,
  }
}

// Get background image style
export const getGradientStyle = (gradient: Gradient) => {
  const gradientValue = generateGradient(gradient)
  return {
    background: gradientValue,
  }
}

// Add new color stop
export const addColorStop = (stops: GradientStop[], color: string, position: number): GradientStop[] => {
  return [...stops, { color, position }].sort((a, b) => a.position - b.position)
}

// Remove color stop
export const removeColorStop = (stops: GradientStop[], index: number): GradientStop[] => {
  return stops.filter((_, i) => i !== index)
}

// Update color stop
export const updateColorStop = (
  stops: GradientStop[],
  index: number,
  color?: string,
  position?: number
): GradientStop[] => {
  return stops.map((stop, i) =>
    i === index
      ? { ...stop, ...(color && { color }), ...(position !== undefined && { position }) }
      : stop
  )
}

// Generate preset gradients
export const presetGradients: Record<string, Gradient> = {
  sunset: {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FF6B6B', position: 0 },
      { color: '#FFA500', position: 50 },
      { color: '#FFD700', position: 100 },
    ],
    size: 'farthest-corner',
  },
  ocean: {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#0047AB', position: 0 },
      { color: '#1E90FF', position: 50 },
      { color: '#87CEEB', position: 100 },
    ],
    size: 'farthest-corner',
  },
  forest: {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#1B4D3E', position: 0 },
      { color: '#2D6A4F', position: 50 },
      { color: '#52B788', position: 100 },
    ],
    size: 'farthest-corner',
  },
  cyberpunk: {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FF006E', position: 0 },
      { color: '#8338EC', position: 50 },
      { color: '#3A86FF', position: 100 },
    ],
    size: 'farthest-corner',
  },
  cosmic: {
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#FF1493', position: 0 },
      { color: '#9932CC', position: 50 },
      { color: '#000080', position: 100 },
    ],
    size: 'farthest-corner',
  },
  warm: {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FFE66D', position: 0 },
      { color: '#FF6B6B', position: 50 },
      { color: '#8B0000', position: 100 },
    ],
    size: 'farthest-corner',
  },
  professional: {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#667EEA', position: 0 },
      { color: '#764BA2', position: 100 },
    ],
    size: 'farthest-corner',
  },
  tropical: {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#F093FB', position: 0 },
      { color: '#F5576C', position: 100 },
    ],
    size: 'farthest-corner',
  },
}

// Export gradient as SCSS
export const exportAsScss = (gradient: Gradient, variableName: string = 'gradient'): string => {
  const gradientValue = generateGradient(gradient)
  return `$${variableName}: ${gradientValue};\n\n.gradient {\n  background: $${variableName};\n}`
}

// Export gradient as Tailwind CSS
export const exportAsTailwind = (gradient: Gradient): string => {
  const stops = gradient.stops.map((stop) => `from-[${stop.color}]`).join(' ')
  return `bg-gradient-to-r ${stops}`
}

// Export gradient as JSON
export const exportAsJSON = (gradient: Gradient): string => {
  return JSON.stringify(
    {
      type: gradient.type,
      angle: gradient.angle,
      size: gradient.size,
      stops: gradient.stops,
      css: getGradientCSS(gradient),
    },
    null,
    2
  )
}

// Validate gradient
export const isValidGradient = (gradient: Gradient): boolean => {
  if (!gradient.type || !['linear', 'radial', 'conic'].includes(gradient.type)) {
    return false
  }

  if (!Array.isArray(gradient.stops) || gradient.stops.length < 2) {
    return false
  }

  const validStops = gradient.stops.every(
    (stop) => /^#[0-9A-F]{6}$/i.test(stop.color) && stop.position >= 0 && stop.position <= 100
  )

  return validStops
}

// Create gradient from hex colors array
export const createGradientFromColors = (
  colors: string[],
  type: 'linear' | 'radial' | 'conic' = 'linear',
  angle: number = 45
): Gradient => {
  const stops: GradientStop[] = colors.map((color, index) => ({
    color,
    position: (index / (colors.length - 1)) * 100,
  }))

  return {
    type,
    angle,
    stops,
    size: 'farthest-corner',
  }
}

// Reverse gradient
export const reverseGradient = (gradient: Gradient): Gradient => {
  return {
    ...gradient,
    stops: gradient.stops
      .map((stop) => ({
        ...stop,
        position: 100 - stop.position,
      }))
      .reverse(),
  }
}

// Duplicate gradient with offset
export const duplicateGradient = (gradient: Gradient): Gradient => {
  return {
    ...gradient,
    stops: [...gradient.stops],
  }
}

// Get random preset gradient
export const getRandomPreset = (): string => {
  const presets = Object.keys(presetGradients)
  return presets[Math.floor(Math.random() * presets.length)]
}

// Interpolate between two gradients
export const interpolateGradients = (
  gradient1: Gradient,
  gradient2: Gradient,
  factor: number
): Gradient => {
  const t = Math.max(0, Math.min(1, factor))
  const stops1 = gradient1.stops
  const stops2 = gradient2.stops

  // For simplicity, interpolate angle if both are linear
  if (gradient1.type === 'linear' && gradient2.type === 'linear') {
    return {
      type: 'linear',
      angle: gradient1.angle + (gradient2.angle - gradient1.angle) * t,
      stops: stops1,
      size: gradient1.size,
    }
  }

  // Default to first gradient
  return gradient1
}

// Export gradient as data URL
export const exportAsDataUrl = (gradient: Gradient, width: number = 512, height: number = 512): string => {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gradientValue = generateGradient(gradient)
  const style = `background: ${gradientValue};`

  // Create a temporary div to apply gradient
  if (typeof document !== 'undefined') {
    const temp = document.createElement('div')
    temp.style.cssText = `${style} width: ${width}px; height: ${height}px;`
    temp.style.position = 'absolute'
    temp.style.left = '-9999px'
    document.body.appendChild(temp)

    // Get computed background
    const computedStyle = window.getComputedStyle(temp)
    const bg = computedStyle.backgroundImage

    document.body.removeChild(temp)

    // Return canvas data URL (simplified)
    return canvas.toDataURL()
  }

  return ''
}
