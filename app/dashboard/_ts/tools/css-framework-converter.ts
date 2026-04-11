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

// css-framework-converter.ts - Add these functions

export interface HierarchyNode {
  tagName: string
  classes: string[]
  id?: string
  children: HierarchyNode[]
  customClass?: string
}

// Improved HTML extraction that handles complete documents, DOCTYPE, and complex nesting
export const extractHierarchy = (html: string): HierarchyNode | null => {
  let normalizedHtml = html.trim()
  
  // Remove DOCTYPE declaration if present
  normalizedHtml = normalizedHtml.replace(/^<!DOCTYPE\s+html[^>]*>/i, '').trim()
  
  // Remove XML declaration if present
  normalizedHtml = normalizedHtml.replace(/^<\?xml[^?]*\?>/i, '').trim()
  
  // Remove HTML comments
  normalizedHtml = normalizedHtml.replace(/<!--[\s\S]*?-->/g, '').trim()
  
  // Extract body content if it exists
  let contentToProcess = normalizedHtml
  const bodyMatch = normalizedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  
  if (bodyMatch) {
    // Use the full body tag with its content
    contentToProcess = bodyMatch[0]
  } else {
    // Try to find html tag
    const htmlMatch = normalizedHtml.match(/<html[^>]*>([\s\S]*?)<\/html>/i)
    if (htmlMatch) {
      contentToProcess = htmlMatch[0]
    }
  }
  
  const parseElement = (content: string): HierarchyNode | null => {
    content = content.trim()
    if (!content) return null
    
    // Match opening tag
    const openingTagMatch = content.match(/^<([a-zA-Z][a-zA-Z0-9\-:]*)\s*([^>]*)>/);
    if (!openingTagMatch) return null;
    
    const [fullOpeningTag, tagName, attributes] = openingTagMatch;
    const tagNameLower = tagName.toLowerCase();
    
    // Check if it's declared as self-closing with />
    if (fullOpeningTag.endsWith('/>')) {
      const classMatch = attributes.match(/class\s*=\s*['"](.*?)['"]|className\s*=\s*['"](.*?)['"]/);
      const classStr = classMatch ? (classMatch[1] || classMatch[2]) : '';
      const classes = classStr.split(/\s+/).filter(c => c.trim());
      const idMatch = attributes.match(/id\s*=\s*['"](.*?)['"]/);
      const id = idMatch ? idMatch[1] : undefined;
      
      return {
        tagName,
        classes,
        id,
        children: [],
      };
    }
    
    // Check if it's a known self-closing tag
    if (getSelfClosingTags().includes(tagNameLower)) {
      const classMatch = attributes.match(/class\s*=\s*['"](.*?)['"]|className\s*=\s*['"](.*?)['"]/);
      const classStr = classMatch ? (classMatch[1] || classMatch[2]) : '';
      const classes = classStr.split(/\s+/).filter(c => c.trim());
      const idMatch = attributes.match(/id\s*=\s*['"](.*?)['"]/);
      const id = idMatch ? idMatch[1] : undefined;
      
      return {
        tagName,
        classes,
        id,
        children: [],
      };
    }
    
    // Extract class and id
    const classMatch = attributes.match(/class\s*=\s*['"](.*?)['"]|className\s*=\s*['"](.*?)['"]/);
    const classStr = classMatch ? (classMatch[1] || classMatch[2]) : '';
    const classes = classStr.split(/\s+/).filter(c => c.trim());
    
    const idMatch = attributes.match(/id\s*=\s*['"](.*?)['"]/);
    const id = idMatch ? idMatch[1] : undefined;
    
    // Find matching closing tag
    const closeTagPattern = new RegExp(`</${tagNameLower}>`, 'i');
    let tagDepth = 1;
    let searchPos = fullOpeningTag.length;
    let closingTagIndex = -1;
    
    while (tagDepth > 0 && searchPos < content.length) {
      const openTagPattern = new RegExp(`<${tagNameLower}(?:\\s|>|\\-)`, 'i');
      const remainingContent = content.substring(searchPos);
      
      const openMatch = remainingContent.match(openTagPattern);
      const closeMatch = remainingContent.match(closeTagPattern);
      
      const openIndex = openMatch ? searchPos + remainingContent.indexOf(openMatch[0]) : -1;
      const closeIndex = closeMatch ? searchPos + remainingContent.indexOf(closeMatch[0]) : -1;
      
      if (closeIndex === -1) return null;
      
      if (openIndex !== -1 && openIndex < closeIndex) {
        tagDepth++;
        searchPos = openIndex + 1;
      } else {
        tagDepth--;
        if (tagDepth === 0) {
          closingTagIndex = closeIndex;
        }
        searchPos = closeIndex + 1;
      }
    }
    
    if (closingTagIndex === -1) return null;
    
    const innerContent = content.substring(fullOpeningTag.length, closingTagIndex);
    const children: HierarchyNode[] = [];
    let remaining = innerContent.trim();
    
    while (remaining) {
      remaining = remaining.trim();
      if (!remaining.startsWith('<')) break;
      
      const childOpenMatch = remaining.match(/^<([a-zA-Z][a-zA-Z0-9\-:]*)\s*([^>]*)>/);
      if (!childOpenMatch) break;
      
      const childTagName = childOpenMatch[1];
      const childTagNameLower = childTagName.toLowerCase();
      const childFullOpenTag = childOpenMatch[0];
      
      // Self-closing child?
      if (childFullOpenTag.endsWith('/>') || getSelfClosingTags().includes(childTagNameLower)) {
        const childNode = parseElement(childFullOpenTag);
        if (childNode) {
          children.push(childNode);
        }
        remaining = remaining.substring(childFullOpenTag.length);
        continue;
      }
      
      // Find closing tag for child
      let childDepth = 1;
      let searchStart = childFullOpenTag.length;
      let childClosingIndex = -1;
      const childCloseTagPattern = new RegExp(`</${childTagNameLower}>`, 'i');
      
      while (childDepth > 0 && searchStart < remaining.length) {
        const childRemaining = remaining.substring(searchStart);
        const childOpenPattern = new RegExp(`<${childTagNameLower}(?:\\s|>|\\-)`, 'i');
        
        const childOpenMatch = childRemaining.match(childOpenPattern);
        const childCloseMatch = childRemaining.match(childCloseTagPattern);
        
        const childOpenIdx = childOpenMatch ? searchStart + childRemaining.indexOf(childOpenMatch[0]) : -1;
        const childCloseIdx = childCloseMatch ? searchStart + childRemaining.indexOf(childCloseMatch[0]) : -1;
        
        if (childCloseIdx === -1) break;
        
        if (childOpenIdx !== -1 && childOpenIdx < childCloseIdx) {
          childDepth++;
          searchStart = childOpenIdx + 1;
        } else {
          childDepth--;
          if (childDepth === 0) {
            childClosingIndex = childCloseIdx + childTagNameLower.length + 3;
          }
          searchStart = childCloseIdx + 1;
        }
      }
      
      if (childClosingIndex === -1) break;
      
      const childElement = remaining.substring(0, childClosingIndex);
      const childNode = parseElement(childElement);
      
      if (childNode) {
        children.push(childNode);
      }
      
      remaining = remaining.substring(childClosingIndex).trim();
    }
    
    return {
      tagName,
      classes,
      id,
      children,
    };
  };
  
  return parseElement(contentToProcess);
};

// Generate CSS from hierarchy
export const generateHierarchicalCss = (
  node: HierarchyNode | null,
  framework: 'tailwind' | 'bootstrap' | 'bulma' | 'materialize',
  parentSelector = ''
): string => {
  if (!node) return '';
  
  // Build selector
  let selector = '';
  if (parentSelector) {
    selector = `${parentSelector} > ${node.tagName}`;
  } else {
    selector = node.tagName;
  }
  
  // Add ID if present
  if (node.id) {
    selector += `#${node.id}`;
  }
  
  // Add classes if present
  if (node.classes.length > 0) {
    selector += `.${node.classes.join('.')}`;
  }
  
  let output = '';
  
  // Generate CSS rules if node has classes
  if (node.classes.length > 0) {
    const cssInput = node.classes.join(' ');
    const cssDeclarations = convertFrameworkToCss(cssInput, framework);
    
    // Clean and format CSS
    if (cssDeclarations && cssDeclarations.trim() && cssDeclarations !== ' ') {
      const rules = cssDeclarations
        .split(';')
        .map(r => r.trim())
        .filter(r => r.length > 0)
        .map(r => `  ${r}${r.endsWith(';') ? '' : ';'}`)
        .join('\n');
      
      if (rules.trim()) {
        output += `${selector} {\n${rules}\n}\n\n`;
      }
    }
  }
  
  // Recursively process children - they'll generate their own CSS rules
  node.children.forEach(child => {
    output += generateHierarchicalCss(child, framework, selector);
  });
  
  return output;
};

// Build visual tree representation
export const visualizeHierarchy = (node: HierarchyNode | null, depth = 0): string => {
  if (!node) return '';
  
  const indent = '  '.repeat(depth);
  const classStr = node.classes.length > 0 ? `.${node.classes.join('.')}` : '';
  const idStr = node.id ? `#${node.id}` : '';
  
  let output = `${indent}├─ <${node.tagName}>${idStr}${classStr}\n`;
  
  node.children.forEach((child, idx) => {
    output += visualizeHierarchy(child, depth + 1);
  });
  
  return output;
};

// All HTML5 semantic and structural tags
export const HTML5_TAGS = [
  // Semantic
  'article', 'aside', 'details', 'dialog', 'figure', 'figcaption', 'footer', 'header', 'main', 'mark', 'nav', 'section', 'summary', 'time',
  // Document structure
  'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script',
  // Content grouping
  'div', 'p', 'hr', 'pre', 'blockquote', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  // Text-level
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'u', 'var', 'wbr',
  // Forms
  'form', 'fieldset', 'legend', 'label', 'input', 'button', 'select', 'datalist', 'optgroup', 'option', 'textarea', 'output', 'progress', 'meter',
  // Tables
  'table', 'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
  // Media
  'img', 'canvas', 'svg', 'video', 'audio', 'source', 'picture', 'iframe', 'embed', 'object', 'param',
  // Scripting
  'noscript',
];

export const isValidHtml5Tag = (tag: string): boolean => {
  return HTML5_TAGS.includes(tag.toLowerCase());
};

export const getSelfClosingTags = (): string[] => [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];

// Enhanced hierarchy with complete HTML structure
export interface HierarchyNodeEnhanced extends HierarchyNode {
  closingTag: string;
  isSelfClosing: boolean;
  attributes: Record<string, string>;
}

export const renderFullHtmlStructure = (node: HierarchyNode | null, depth = 0): string => {
  if (!node) return '';
  
  const indent = '  '.repeat(depth);
  const classStr = node.classes.length > 0 ? ` class="${node.classes.join(' ')}"` : '';
  const idStr = node.id ? ` id="${node.id}"` : '';
  const selfClosing = getSelfClosingTags().includes(node.tagName.toLowerCase());
  
  let output = '';
  
  if (selfClosing) {
    output += `${indent}<${node.tagName}${idStr}${classStr} />\n`;
  } else {
    output += `${indent}<${node.tagName}${idStr}${classStr}>\n`;
    
    // Render children
    node.children.forEach(child => {
      output += renderFullHtmlStructure(child, depth + 1);
    });
    
    output += `${indent}</${node.tagName}>\n`;
  }
  
  return output;
};

