import tailwindJson from './json/tailwind.json'
import bootstrapJson from './json/bootstrap.json'

export interface ConversionResult {
  input: string
  output: string
  framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'
  language: 'css' | 'scss' | 'less'
}

// Extract breakpoint value
const getBreakpointValue = (breakpoint: string): string | null => {
  const breakpoints = (tailwindJson as any).breakpoints || {}
  return breakpoints[breakpoint] || null
}

// Parse responsive class (e.g., "md:flex" -> { breakpoint: "md", class: "flex" })
const parseResponsiveClass = (cls: string): { breakpoint: string | null; class: string } => {
  const parts = cls.split(':')
  if (parts.length === 2) {
    const [prefix, baseClass] = parts
    if (getBreakpointValue(prefix)) {
      return { breakpoint: prefix, class: baseClass }
    }
  }
  return { breakpoint: null, class: cls }
}

// Generate media query wrapper
const wrapInMediaQuery = (breakpoint: string, css: string): string => {
  const value = getBreakpointValue(breakpoint)
  if (!value) return css
  return `@media (min-width: ${value}) {\n  ${css.split(';').filter(r => r.trim()).join(';\n  ')}\n}`
}

export const tailwindToCss = (tailwindClasses: string): string => {
  const flatMap: Record<string, string> = {}

  Object.entries(tailwindJson).forEach(([key, group]: [string, any]) => {
    if (key !== 'breakpoints' && typeof group === 'object') {
      Object.assign(flatMap, group)
    }
  })

  const classes = tailwindClasses.split(' ').filter(Boolean)
  const cssRules: string[] = []
  const mediaQueries: Record<string, string[]> = {}

  classes.forEach((cls) => {
    const { breakpoint, class: baseClass } = parseResponsiveClass(cls)

    // Static classes
    if (flatMap[baseClass]) {
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(flatMap[baseClass])
      } else {
        cssRules.push(flatMap[baseClass])
      }
      return
    }

    // Custom padding support (p-[4px])
    const customPadding = baseClass.match(/^p-\[(.+)\]$/)
    if (customPadding) {
      const rule = `padding: ${customPadding[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPx = baseClass.match(/^px-\[(.+)\]$/)
    if (customPx) {
      const rule = `padding-left: ${customPx[1]}; padding-right: ${customPx[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPy = baseClass.match(/^py-\[(.+)\]$/)
    if (customPy) {
      const rule = `padding-top: ${customPy[1]}; padding-bottom: ${customPy[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPt = baseClass.match(/^pt-\[(.+)\]$/)
    if (customPt) {
      const rule = `padding-top: ${customPt[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPr = baseClass.match(/^pr-\[(.+)\]$/)
    if (customPr) {
      const rule = `padding-right: ${customPr[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPb = baseClass.match(/^pb-\[(.+)\]$/)
    if (customPb) {
      const rule = `padding-bottom: ${customPb[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }

    const customPl = baseClass.match(/^pl-\[(.+)\]$/)
    if (customPl) {
      const rule = `padding-left: ${customPl[1]};`
      if (breakpoint) {
        if (!mediaQueries[breakpoint]) {
          mediaQueries[breakpoint] = []
        }
        mediaQueries[breakpoint].push(rule)
      } else {
        cssRules.push(rule)
      }
      return
    }
  })

  // Combine regular rules
  let output = cssRules.join(' ')

  // Add media queries
  Object.entries(mediaQueries).forEach(([breakpoint, rules]) => {
    const breakpointValue = getBreakpointValue(breakpoint)
    if (breakpointValue) {
      const mediaQuery = `@media (min-width: ${breakpointValue}) { ${rules.join(' ')} }`
      output += ` ${mediaQuery}`
    }
  })

  return output
}

// Bootstrap to CSS converter
export const bootstrapToCss = (bootstrapClasses: string): string => {
  const flatMap: Record<string, string> = {}

  Object.entries(bootstrapJson).forEach(([key, group]: [string, any]) => {
    if (typeof group === 'object') {
      Object.assign(flatMap, group)
    }
  })

  const classes = bootstrapClasses.split(' ').filter(Boolean)
  const cssRules: string[] = []

  classes.forEach((cls) => {
    if (flatMap[cls]) {
      cssRules.push(flatMap[cls])
    }
  })

  return cssRules.join(' ')
}

// Bulma to CSS converter
export const bulmaToCss = (bulmaClasses: string): string => {
  const bulmaMap: Record<string, string> = {
    'is-flex': 'display: flex;',
    'is-inline-flex': 'display: inline-flex;',
    'is-block': 'display: block;',
    'is-inline': 'display: inline;',
    'is-inline-block': 'display: inline-block;',
    'is-hidden': 'display: none;',
    'is-flex-direction-row': 'flex-direction: row;',
    'is-flex-direction-column': 'flex-direction: column;',
    'is-flex-wrap-wrap': 'flex-wrap: wrap;',
    'is-flex-wrap-nowrap': 'flex-wrap: nowrap;',
    'is-justify-content-center': 'justify-content: center;',
    'is-align-items-center': 'align-items: center;',
    'has-text-centered': 'text-align: center;',
    'has-text-left': 'text-align: left;',
    'has-text-right': 'text-align: right;',
    'has-text-justify': 'text-align: justify;',
    'm-0': 'margin: 0;',
    'm-1': 'margin: 0.25rem;',
    'm-2': 'margin: 0.5rem;',
    'm-3': 'margin: 1rem;',
    'mx-auto': 'margin-left: auto; margin-right: auto;',
    'p-0': 'padding: 0;',
    'p-1': 'padding: 0.25rem;',
    'p-2': 'padding: 0.5rem;',
    'p-3': 'padding: 1rem;',
    'p-4': 'padding: 1.5rem;',
    'is-size-1': 'font-size: 3rem;',
    'is-size-2': 'font-size: 2.5rem;',
    'is-size-3': 'font-size: 2rem;',
    'is-size-4': 'font-size: 1.5rem;',
    'is-size-5': 'font-size: 1.25rem;',
    'is-size-6': 'font-size: 1rem;',
    'has-background-white': 'background-color: white;',
    'has-background-light': 'background-color: #f5f5f5;',
    'has-background-dark': 'background-color: #363636;',
    'has-background-primary': 'background-color: #3273dc;',
    'has-text-white': 'color: white;',
    'has-text-dark': 'color: #363636;',
    'has-text-primary': 'color: #3273dc;',
    'has-text-weight-light': 'font-weight: 300;',
    'has-text-weight-normal': 'font-weight: 400;',
    'has-text-weight-semibold': 'font-weight: 600;',
    'has-text-weight-bold': 'font-weight: 700;',
    'box': 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 1.25rem;',
    'delete': 'cursor: pointer; position: relative;',
  }

  const classes = bulmaClasses.split(' ').filter((c) => c.trim())
  const cssRules: string[] = []

  classes.forEach((cls) => {
    if (bulmaMap[cls]) {
      cssRules.push(bulmaMap[cls])
    }
  })

  return cssRules.join(' ')
}

// Materialize to CSS converter
export const materializeToCss = (materializeClasses: string): string => {
  const materializeMap: Record<string, string> = {
    'row': 'display: flex; flex-wrap: wrap;',
    'col': 'flex: 1; min-width: 0;',
    's12': 'width: 100%;',
    's11': 'width: 91.66667%;',
    's10': 'width: 83.33333%;',
    's9': 'width: 75%;',
    's8': 'width: 66.66667%;',
    's7': 'width: 58.33333%;',
    's6': 'width: 50%;',
    's5': 'width: 41.66667%;',
    's4': 'width: 33.333%;',
    's3': 'width: 25%;',
    's2': 'width: 16.66667%;',
    's1': 'width: 8.33333%;',
    'center': 'text-align: center;',
    'left-align': 'text-align: left;',
    'right-align': 'text-align: right;',
    'white-text': 'color: white;',
    'black-text': 'color: black;',
    'z-depth-0': 'box-shadow: none;',
    'z-depth-1': 'box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2);',
    'z-depth-2': 'box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2);',
    'z-depth-3': 'box-shadow: 0 3px 3px -2px rgba(0,0,0,0.2);',
    'z-depth-4': 'box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2);',
    'z-depth-5': 'box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2);',
    'waves-effect': 'position: relative; cursor: pointer; overflow: hidden;',
    'waves-light': 'color: white;',
    'waves-dark': 'color: #212121;',
  }

  const classes = materializeClasses.split(' ').filter((c) => c.trim())
  const cssRules: string[] = []

  classes.forEach((cls) => {
    if (materializeMap[cls]) {
      cssRules.push(materializeMap[cls])
    }
  })

  return cssRules.join(' ')
}

// Convert framework classes to CSS
export const convertFrameworkToCss = (
  input: string,
  framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'
): string => {
  switch (framework) {
    case 'tailwind':
      return tailwindToCss(input)
    case 'bootstrap':
      return bootstrapToCss(input)
    case 'bulma':
      return bulmaToCss(input)
    case 'materialize':
      return materializeToCss(input)
    default:
      return ''
  }
}

// Generate CSS file content
export const generateCssFile = (selector: string, css: string): string => {
  const formattedCss = css
    .split(';')
    .filter((r) => r.trim())
    .map((r) => `  ${r.trim()};`)
    .join('\n')

  return `/* Generated CSS from Framework Converter */\n/* Generated on ${new Date().toLocaleDateString()} */\n\n${selector} {\n${formattedCss}\n}`
}

// Export as SCSS
export const exportAsScss = (selector: string, css: string): string => {
  const formattedCss = css
    .split(';')
    .filter((r) => r.trim())
    .map((r) => `  ${r.trim()};`)
    .join('\n')

  return `/* Generated SCSS from Framework Converter */\n/* Generated on ${new Date().toLocaleDateString()} */\n\n${selector} {\n${formattedCss}\n}\n`
}

// Export as LESS
export const exportAsLess = (selector: string, css: string): string => {
  const formattedCss = css
    .split(';')
    .filter((r) => r.trim())
    .map((r) => `  ${r.trim()};`)
    .join('\n')

  return `// Generated LESS from Framework Converter\n// Generated on ${new Date().toLocaleDateString()}\n\n${selector} {\n${formattedCss}\n}\n`
}

// Framework documentation
export const frameworkDocs = {
  tailwind: {
    name: 'Tailwind CSS',
    docs: 'https://tailwindcss.com/docs',
    description: 'Utility-first CSS framework with responsive breakpoints (sm, md, lg, xl, 2xl)',
    prefix: '',
  },
  bootstrap: {
    name: 'Bootstrap',
    docs: 'https://getbootstrap.com/docs',
    description: 'Popular CSS framework by Bootstrap',
    prefix: 'd-',
  },
  bulma: {
    name: 'Bulma',
    docs: 'https://bulma.io/documentation',
    description: 'Modern CSS framework with clean syntax',
    prefix: 'is-',
  },
  materialize: {
    name: 'Materialize',
    docs: 'https://materializecss.com',
    description: 'Material Design CSS framework',
    prefix: '',
  },
}

// Get framework examples
export const getFrameworkExamples = (framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'): Record<string, string> => {
  const examples = {
    tailwind: {
      'Flex Container': 'flex flex-col gap-4 p-6 rounded-lg shadow-md',
      'Responsive Grid': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      'Responsive Button': 'px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded font-semibold',
    },
    bootstrap: {
      'Flex Container': 'd-flex flex-column gap-3 p-3 rounded',
      'Button': 'px-3 py-2 bg-primary text-white rounded fw-bold',
      'Card': 'p-3 bg-white rounded border',
    },
    bulma: {
      'Flex Container': 'is-flex is-flex-direction-column p-3',
      'Button': 'p-2 has-background-primary has-text-white',
      'Card': 'p-4 box has-background-light',
    },
    materialize: {
      'Flex Container': 'row p-3',
      'Button': 'z-depth-1 white-text',
      'Card': 'col s12 z-depth-2',
    },
  }

  return examples[framework] || {}
}

// Export gradient metadata
export const exportMetadata = (framework: string, selector: string, css: string): Record<string, any> => {
  return {
    framework,
    selector,
    css,
    timestamp: new Date().toISOString(),
    ruleCount: css.split(';').filter((r) => r.trim()).length,
  }
}

// Format CSS output with proper indentation and media queries
export const formatCssOutput = (selector: string, css: string): string => {
  // Split by @media to separate regular rules from media queries
  const parts = css.split(/(@media[^{]*\{[^}]*\})/g).filter(p => p.trim())
  
  let formatted = `${selector} {\n`
  const regularRules: string[] = []
  const mediaQueries: string[] = []

  parts.forEach(part => {
    if (part.includes('@media')) {
      mediaQueries.push(part)
    } else {
      regularRules.push(part)
    }
  })

  // Add regular CSS rules
  regularRules.forEach(rule => {
    rule.split(';').forEach(prop => {
      const trimmed = prop.trim()
      if (trimmed && !trimmed.includes('@media')) {
        formatted += `  ${trimmed};\n`
      }
    })
  })

  // Add media queries
  mediaQueries.forEach(mq => {
    const mqMatch = mq.match(/@media\s*\(([^)]+)\)\s*\{\s*(.+?)\s*\}/)
    if (mqMatch) {
      const breakpoint = mqMatch[1]
      const mqRules = mqMatch[2]
      
      formatted += `\n  @media (${breakpoint}) {\n`
      
      mqRules.split(';').forEach(rule => {
        const trimmed = rule.trim()
        if (trimmed) {
          formatted += `    ${trimmed};\n`
        }
      })
      
      formatted += `  }\n`
    }
  })

  formatted += `}`
  return formatted
}