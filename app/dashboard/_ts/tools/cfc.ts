import tailwindJson from './json/tailwind.json'

export interface ConversionResult {
  input: string
  output: string
  framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'
  language: 'css' | 'scss' | 'less'
}

export const tailwindToCss = (tailwindClasses: string): string => {
  const flatMap: Record<string, string> = {}

  Object.values(tailwindJson).forEach((group: any) => {
    Object.assign(flatMap, group)
  })

  const classes = tailwindClasses.split(' ').filter(Boolean)
  const cssRules: string[] = []

  classes.forEach((cls) => {

    // Static classes
    if (flatMap[cls]) {
      cssRules.push(flatMap[cls])
      return
    }

    // Custom padding support (p-[4px])
    const customPadding = cls.match(/^p-\[(.+)\]$/)
    if (customPadding) {
      cssRules.push(`padding: ${customPadding[1]};`)
      return
    }

    const customPx = cls.match(/^px-\[(.+)\]$/)
    if (customPx) {
      cssRules.push(`padding-left: ${customPx[1]}; padding-right: ${customPx[1]};`)
      return
    }

    const customPy = cls.match(/^py-\[(.+)\]$/)
    if (customPy) {
      cssRules.push(`padding-top: ${customPy[1]}; padding-bottom: ${customPy[1]};`)
      return
    }

    const customPt = cls.match(/^pt-\[(.+)\]$/)
    if (customPt) {
      cssRules.push(`padding-top: ${customPt[1]};`)
      return
    }

    const customPr = cls.match(/^pr-\[(.+)\]$/)
    if (customPr) {
      cssRules.push(`padding-right: ${customPr[1]};`)
      return
    }

    const customPb = cls.match(/^pb-\[(.+)\]$/)
    if (customPb) {
      cssRules.push(`padding-bottom: ${customPb[1]};`)
      return
    }

    const customPl = cls.match(/^pl-\[(.+)\]$/)
    if (customPl) {
      cssRules.push(`padding-left: ${customPl[1]};`)
      return
    }

  })

  return cssRules.join(' ')
}

// Bootstrap to CSS converter
export const bootstrapToCss = (bootstrapClasses: string): string => {
  const bootstrapMap: Record<string, string> = {
    // Display
    'd-flex': 'display: flex;',
    'd-inline-flex': 'display: inline-flex;',
    'd-grid': 'display: grid;',
    'd-block': 'display: block;',
    'd-inline': 'display: inline;',
    'd-inline-block': 'display: inline-block;',
    'd-none': 'display: none;',

    // Flexbox
    'flex-row': 'flex-direction: row;',
    'flex-column': 'flex-direction: column;',
    'flex-wrap': 'flex-wrap: wrap;',
    'flex-nowrap': 'flex-wrap: nowrap;',
    'justify-content-start': 'justify-content: flex-start;',
    'justify-content-center': 'justify-content: center;',
    'justify-content-end': 'justify-content: flex-end;',
    'justify-content-between': 'justify-content: space-between;',
    'justify-content-around': 'justify-content: space-around;',
    'align-items-start': 'align-items: flex-start;',
    'align-items-center': 'align-items: center;',
    'align-items-end': 'align-items: flex-end;',
    'gap-1': 'gap: 0.25rem;',
    'gap-2': 'gap: 0.5rem;',
    'gap-3': 'gap: 1rem;',
    'gap-4': 'gap: 1.5rem;',

    // Sizing
    'w-100': 'width: 100%;',
    'w-auto': 'width: auto;',
    'h-100': 'height: 100%;',
    'h-auto': 'height: auto;',
    'mw-100': 'max-width: 100%;',
    'min-vh-100': 'min-height: 100vh;',

    // Padding
    'p-0': 'padding: 0;',
    'p-1': 'padding: 0.25rem;',
    'p-2': 'padding: 0.5rem;',
    'p-3': 'padding: 1rem;',
    'p-4': 'padding: 1.5rem;',
    'p-5': 'padding: 3rem;',
    'px-1': 'padding-left: 0.25rem; padding-right: 0.25rem;',
    'px-2': 'padding-left: 0.5rem; padding-right: 0.5rem;',
    'px-3': 'padding-left: 1rem; padding-right: 1rem;',
    'py-1': 'padding-top: 0.25rem; padding-bottom: 0.25rem;',
    'py-2': 'padding-top: 0.5rem; padding-bottom: 0.5rem;',
    'py-3': 'padding-top: 1rem; padding-bottom: 1rem;',

    // Margin
    'm-0': 'margin: 0;',
    'm-1': 'margin: 0.25rem;',
    'm-2': 'margin: 0.5rem;',
    'm-3': 'margin: 1rem;',
    'm-4': 'margin: 1.5rem;',
    'mx-auto': 'margin-left: auto; margin-right: auto;',
    'my-1': 'margin-top: 0.25rem; margin-bottom: 0.25rem;',
    'my-2': 'margin-top: 0.5rem; margin-bottom: 0.5rem;',
    'my-3': 'margin-top: 1rem; margin-bottom: 1rem;',
    'mt-1': 'margin-top: 0.25rem;',
    'mb-3': 'margin-bottom: 1rem;',

    // Text
    'text-sm': 'font-size: 0.875rem;',
    'text-center': 'text-align: center;',
    'text-start': 'text-align: left;',
    'text-end': 'text-align: right;',
    'text-muted': 'color: #6c757d;',
    'fw-light': 'font-weight: 300;',
    'fw-normal': 'font-weight: 400;',
    'fw-bold': 'font-weight: 700;',
    'fw-bolder': 'font-weight: 800;',
    'fst-italic': 'font-style: italic;',

    // Colors
    'text-white': 'color: white;',
    'text-dark': 'color: #212529;',
    'text-light': 'color: #f8f9fa;',
    'text-primary': 'color: #0d6efd;',
    'text-success': 'color: #198754;',
    'text-danger': 'color: #dc3545;',
    'bg-white': 'background-color: white;',
    'bg-light': 'background-color: #f8f9fa;',
    'bg-dark': 'background-color: #212529;',
    'bg-primary': 'background-color: #0d6efd;',
    'bg-success': 'background-color: #198754;',
    'bg-danger': 'background-color: #dc3545;',

    // Border
    'border': 'border: 1px solid #dee2e6;',
    'border-0': 'border: 0;',
    'border-top': 'border-top: 1px solid #dee2e6;',
    'border-bottom': 'border-bottom: 1px solid #dee2e6;',
    'border-primary': 'border-color: #0d6efd;',
    'rounded': 'border-radius: 0.375rem;',
    'rounded-1': 'border-radius: 0.25rem;',
    'rounded-2': 'border-radius: 0.5rem;',
    'rounded-circle': 'border-radius: 50%;',

    // Shadow
    'shadow': 'box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);',
    'shadow-sm': 'box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);',
    'shadow-lg': 'box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);',

    // Others
    'cursor-pointer': 'cursor: pointer;',
    'user-select-none': 'user-select: none;',
  }

  const classes = bootstrapClasses.split(' ').filter((c) => c.trim())
  const cssRules: string[] = []

  classes.forEach((cls) => {
    if (bootstrapMap[cls]) {
      cssRules.push(bootstrapMap[cls])
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

// Get CSS rule with selector
export const getCssRule = (selector: string, css: string): string => {
  return `${selector} {\n  ${css}\n}`
}

// Format CSS output with proper indentation
export const formatCss = (css: string, indent: number = 2): string => {
  const spaces = ' '.repeat(indent)
  return css
    .split(';')
    .filter((r) => r.trim())
    .map((r) => `${spaces}${r.trim()};`)
    .join('\n')
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
    description: 'Utility-first CSS framework',
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

// Get supported classes for a framework
export const getSupportedClasses = (framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'): string[] => {
  const maps = {
    tailwind: Object.keys(tailwindToCss('').split(' ').length === 0 ? [] : {}),
    bootstrap: Object.keys(bootstrapToCss('').split(' ').length === 0 ? [] : {}),
    bulma: Object.keys(bulmaToCss('').split(' ').length === 0 ? [] : {}),
    materialize: Object.keys(materializeToCss('').split(' ').length === 0 ? [] : {}),
  }
  return []
}

// Validate framework classes
export const validateClasses = (input: string, framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'): { valid: string[]; invalid: string[] } => {
  const classes = input.split(' ').filter((c) => c.trim())
  const css = convertFrameworkToCss(input, framework)
  const valid = classes.filter((cls) => convertFrameworkToCss(cls, framework).length > 0)
  const invalid = classes.filter((cls) => convertFrameworkToCss(cls, framework).length === 0)

  return { valid, invalid }
}

// Get framework examples
export const getFrameworkExamples = (framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize'): Record<string, string> => {
  const examples = {
    tailwind: {
      'Flex Container': 'flex flex-col gap-4 p-6 rounded-lg shadow-md',
      'Button': 'px-4 py-2 bg-blue-600 text-white rounded font-semibold',
      'Card': 'p-6 bg-white rounded-lg shadow-md border border-gray-200',
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