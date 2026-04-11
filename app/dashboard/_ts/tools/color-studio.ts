// Color and Gradient utility functions combined

export interface ColorPalette {
  colors: string[]
  scheme: string
  baseColor: string
}

export interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
}

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

export interface WebsiteTemplate {
  name: string
  component: (colors: string[]) => React.ReactNode
}

export const applyChelorSchemesToTemplate = (colors: string[]) => {
  return {
    hero: colors[0],
    accent: colors[1] || colors[0],
    text: getContrastColor(colors[0]),
    lightBg: colors[2] || colors[0],
    darker: colors[colors.length - 1] || colors[0],
  }
}

// Color Conversion Functions
export const hexToHsl = (hex: string): [number, number, number] => {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - (((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  const toHex = (value: number) => {
    const hex = Math.round((value + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// Color Scheme Generators
export const getComplementary = (hex: string): string => {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex((h + 180) % 360, s, l)
}

export const getAnalogous = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = []
  const step = 360 / count

  for (let i = 0; i < count; i++) {
    colors.push(hslToHex((h + step * i) % 360, s, l))
  }

  return colors
}

export const getTriadic = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex)
  return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)]
}

export const getTetradic = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex)
  return [
    hex,
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l),
  ]
}

export const getMonochromatic = (hex: string, count: number = 5): string[] => {
  const [h, s] = hexToHsl(hex)
  const colors: string[] = []

  for (let i = 1; i <= count; i++) {
    const lightness = (i * 100) / (count + 1)
    colors.push(hslToHex(h, s, lightness))
  }

  return colors
}

export const getShades = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = [hex]

  for (let i = 1; i < count; i++) {
    colors.push(hslToHex(h, s, Math.max(0, l - (l / count) * i)))
  }

  return colors
}

export const getTints = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = [hex]

  for (let i = 1; i < count; i++) {
    colors.push(hslToHex(h, s, Math.min(100, l + ((100 - l) / count) * i)))
  }

  return colors
}

export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')
    .toUpperCase()
}

export const getColorFormats = (hex: string): ColorFormats => {
  const [h, s, l] = hexToHsl(hex)
  const [r, g, b] = hexToRgb(hex)

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
  }
}

export const generatePalette = (baseColor: string, scheme: string): string[] => {
  switch (scheme) {
    case 'complementary':
      return [baseColor, getComplementary(baseColor)]
    case 'analogous':
      return getAnalogous(baseColor)
    case 'triadic':
      return getTriadic(baseColor)
    case 'tetradic':
      return getTetradic(baseColor)
    case 'monochromatic':
      return getMonochromatic(baseColor)
    case 'shades':
      return getShades(baseColor)
    case 'tints':
      return getTints(baseColor)
    default:
      return [baseColor]
  }
}

export const isLightColor = (hex: string): boolean => {
  const [, , l] = hexToHsl(hex)
  return l > 50
}

export const getContrastColor = (hex: string): string => {
  return isLightColor(hex) ? '#000000' : '#FFFFFF'
}

// Gradient Functions
export const generateLinearGradient = (angle: number, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `linear-gradient(${angle}deg, ${stopString})`
}

export const generateRadialGradient = (size: string, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `radial-gradient(${size}, ${stopString})`
}

export const generateConicGradient = (angle: number, stops: GradientStop[]): string => {
  const stopString = stops
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ')

  return `conic-gradient(from ${angle}deg, ${stopString})`
}

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

export const getGradientCSS = (gradient: Gradient): GradientCSS => {
  const gradientValue = generateGradient(gradient)

  return {
    css: `background: ${gradientValue};`,
    backgroundImage: `background-image: ${gradientValue};`,
  }
}

export const getGradientStyle = (gradient: Gradient) => {
  const gradientValue = generateGradient(gradient)
  return {
    background: gradientValue,
  }
}

export const addColorStop = (stops: GradientStop[], color: string, position: number): GradientStop[] => {
  return [...stops, { color, position }].sort((a, b) => a.position - b.position)
}

export const removeColorStop = (stops: GradientStop[], index: number): GradientStop[] => {
  return stops.filter((_, i) => i !== index)
}

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

export const exportAsScss = (gradient: Gradient, variableName: string = 'gradient'): string => {
  const gradientValue = generateGradient(gradient)
  return `$${variableName}: ${gradientValue};\n\n.gradient {\n  background: $${variableName};\n}`
}