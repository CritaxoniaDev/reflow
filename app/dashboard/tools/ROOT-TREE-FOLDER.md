
---

## Individual Tool Directories

### `/app/dashboard/tools/c-p-g/` - Color Palette Generator
**Purpose:** Generate beautiful color schemes based on color theory.

- **page.tsx**
  - Settings panel (color picker, format selection, action buttons)
  - Scheme selection (7 harmony types)
  - Generated palette preview with color swatches
  - Copy and export functionality (JSON, CSS)
  - Color details table

- **Related Utility:** `_ts/tools/cpg.ts`

**Features:**
- 7 color harmony schemes (complementary, analogous, triadic, etc.)
- Multiple color format support (HEX, RGB, HSL)
- Real-time preview
- Export as JSON or CSS
- Copy individual colors to clipboard

---

### `/app/dashboard/tools/g-gen/` - Gradient Generator
**Purpose:** Create beautiful CSS gradients with interactive controls.

- **page.tsx**
  - Gradient type selector (linear, radial, conic)
  - Angle/size control with live slider
  - Preset gradients (6 options)
  - Live gradient preview (full height display)
  - Color stops editor with add/remove functionality
  - CSS and background-image code generators
  - Export as CSS or SCSS

- **Related Utility:** `_ts/tools/g-gen.ts`

**Features:**
- 3 gradient types with different controls
- 6 preset gradients
- Add/remove color stops up to any number
- Adjust individual stop colors and positions
- Real-time CSS code generation
- Export capabilities

---

### `/app/dashboard/tools/c-f-c/` - CSS Framework Converter
**Purpose:** Convert utility classes from CSS frameworks to raw CSS.

- **page.tsx**
  - Framework selector (Tailwind, Bootstrap, Bulma, Materialize)
  - CSS selector input
  - Framework classes input textarea
  - Generated CSS output with formatted display
  - Conversion details breakdown
  - Copy and export (CSS, SCSS)
  - Framework documentation links

- **Related Utility:** `_ts/tools/cfc.ts`

**Features:**
- Converts 4 popular CSS frameworks
- Support for 50+ utility classes per framework
- Custom CSS selector support
- Real-time conversion
- Conversion breakdown showing each rule
- Export as CSS, SCSS, or LESS
- Links to official framework documentation

---
