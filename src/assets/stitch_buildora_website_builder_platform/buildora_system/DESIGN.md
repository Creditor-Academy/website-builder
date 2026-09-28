---
name: Buildora System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#5c5e68'
  on-secondary: '#ffffff'
  secondary-container: '#dedfeb'
  on-secondary-container: '#60626c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e1e2ed'
  secondary-fixed-dim: '#c4c6d1'
  on-secondary-fixed: '#191b24'
  on-secondary-fixed-variant: '#444650'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is anchored in a "Clean Tech" philosophy, characterized by high-precision utility and an understated premium aesthetic. It targets creative professionals and enterprise teams who require a high-end website builder that feels like a powerful, distraction-free tool.

The visual style is **Corporate Modern with Minimalist influences**, emphasizing:
- **Clarity over Clutter:** Every element serves a functional purpose; decoration is replaced by purposeful whitespace.
- **Precision:** Tight alignments, consistent stroke weights, and a rigorous adherence to the grid.
- **Sophistication:** A balance of deep, authoritative tones and vibrant action colors to evoke a sense of reliability and modern innovation.

## Colors
This design system utilizes a high-contrast palette to define structural hierarchy and interactive clarity.

- **Foundational Blue:** `slate-900` (#0F172A) is the primary anchor for text, headers, and heavy UI components, providing a grounded, trustworthy feel.
- **Action Interface:** `Action Blue` (#3B82F6) is reserved exclusively for primary interactions, links, and active states to draw the eye without overwhelming the canvas.
- **Surface Strategy:** In light mode, use `slate-50` for secondary background areas to create subtle depth against the pure white primary background. In dark mode, use `slate-950` with `slate-900` as the surface container color.

## Typography
The typography system relies on **Inter** to deliver a systematic, utilitarian feel that remains highly legible across all weights.

- **Headings:** Use tight tracking (letter-spacing) for display and headline styles to create a dense, impactful "editorial" look typical of high-end SaaS products.
- **Hierarchy:** Contrast is achieved through weight rather than just size. Use `Medium (500)` for UI labels and `Semi-Bold (600)` for sub-headers to maintain a crisp appearance on high-DPI displays.
- **Body Text:** Maintain a generous line-height (1.6) for long-form content to ensure breathability within the "Clean Tech" aesthetic.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict adherence to an 8px spacing rhythm. 

- **Desktop (1440px+):** 12-column grid, 24px gutters, 40px side margins. 
- **Tablet (768px - 1024px):** 8-column grid, 24px gutters, 32px side margins.
- **Mobile (Up to 767px):** 4-column grid, 16px gutters, 16px side margins.

Content should be grouped using logical spacing containers. Use `lg` (48px) spacing between major sections and `sm` (16px) for internal component spacing (e.g., between an icon and text).

## Elevation & Depth
Depth in this design system is achieved through **Ambient Shadows** and **Tonal Layers**.

- **Level 0 (Base):** Pure white background for content creation areas.
- **Level 1 (Subtle):** Used for cards and navigation bars. Defined by a 1px border in `slate-200` and a very soft, diffused shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active/Floating):** Used for dropdowns and modals. Defined by a more pronounced shadow to imply physical proximity to the user: `0 10px 25px rgba(15, 23, 42, 0.1)`.
- **Tonal Depth:** Use semi-transparent overlays (e.g., `slate-900` at 40% opacity) for backdrops to keep the focus on the elevated element.

## Shapes
The shape language is **Rounded**, providing a modern, approachable feel while maintaining professional structural integrity.

- **Standard Elements:** Buttons, input fields, and small tags use `0.5rem` (8px) corner radius.
- **Large Containers:** Cards and modal containers use `1rem` (16px) corner radius to create a distinct visual container.
- **Interactive States:** On hover, shapes do not change radius, but may receive a subtle inner shadow or stroke to reinforce the "tactile" feedback.

## Components

### Buttons
- **Primary:** `Action Blue` background, white text. No border. On hover, darken the background slightly.
- **Secondary:** `slate-50` background, `slate-900` text. Subtle `slate-200` border.
- **Ghost:** Transparent background, `slate-600` text. Becomes `slate-50` on hover.

### Input Fields
- Background: `White` or `slate-50`.
- Border: 1px `slate-200`. 
- Focus State: 1px `Action Blue` border with a 3px soft blue outer glow (ring).

### Cards
- Border: 1px `slate-200`.
- Padding: `md` (24px) for desktop, `sm` (16px) for mobile.
- Background: `White`.

### Chips / Tags
- Small, uppercase labels using `label-caps`.
- Style: Light gray background (`slate-100`) with `slate-600` text for neutral categories; use soft green or amber tints for status-specific indicators.

### Navigation Sidebar
- Background: `slate-900` (for high contrast in builder mode) or `White` with a 1px right border.
- Icons: Minimalist line icons (2px stroke) in `slate-400`, switching to `Action Blue` or `White` when active.