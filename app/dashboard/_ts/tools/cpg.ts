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

// Convert HEX to HSL
export const hexToHsl = (hex: string): [number, number, number] => {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
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

// Convert HSL to HEX
export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - (((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

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

// Convert HEX to RGB
export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

// Convert RGB to HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// Generate complementary color (opposite on color wheel)
export const getComplementary = (hex: string): string => {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex((h + 180) % 360, s, l)
}

// Generate analogous colors (adjacent on color wheel)
export const getAnalogous = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = []
  const step = 360 / count

  for (let i = 0; i < count; i++) {
    colors.push(hslToHex((h + step * i) % 360, s, l))
  }

  return colors
}

// Generate triadic colors (3 evenly spaced)
export const getTriadic = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex)
  return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)]
}

// Generate tetradic (square) colors (4 evenly spaced)
export const getTetradic = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex)
  return [
    hex,
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l),
  ]
}

// Generate monochromatic colors (same hue, different lightness)
export const getMonochromatic = (hex: string, count: number = 5): string[] => {
  const [h, s] = hexToHsl(hex)
  const colors: string[] = []

  for (let i = 1; i <= count; i++) {
    const lightness = (i * 100) / (count + 1)
    colors.push(hslToHex(h, s, lightness))
  }

  return colors
}

// Generate shades (darker versions)
export const getShades = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = [hex]

  for (let i = 1; i < count; i++) {
    colors.push(hslToHex(h, s, Math.max(0, l - (l / count) * i)))
  }

  return colors
}

// Generate tints (lighter versions)
export const getTints = (hex: string, count: number = 5): string[] => {
  const [h, s, l] = hexToHsl(hex)
  const colors: string[] = [hex]

  for (let i = 1; i < count; i++) {
    colors.push(hslToHex(h, s, Math.min(100, l + ((100 - l) / count) * i)))
  }

  return colors
}

// Generate a random color
export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')
    .toUpperCase()
}

// Get all color formats (HEX, RGB, HSL)
export const getColorFormats = (hex: string): ColorFormats => {
  const [h, s, l] = hexToHsl(hex)
  const [r, g, b] = hexToRgb(hex)

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
  }
}

// Generate palette based on color scheme
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

// Check if color is light or dark
export const isLightColor = (hex: string): boolean => {
  const [, , l] = hexToHsl(hex)
  return l > 50
}

// Get contrasting text color (black or white)
export const getContrastColor = (hex: string): string => {
  return isLightColor(hex) ? '#000000' : '#FFFFFF'
}