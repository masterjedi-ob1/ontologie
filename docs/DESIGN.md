---
name: Taruvi Enterprise Path
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f0069'
  on-tertiary-container: '#7671ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-canvas: '#F8FAFC'
  surface-card: '#FFFFFF'
  border-subtle: '#E2E8F0'
  border-strong: '#CBD5E1'
  status-ready-text: '#047857'
  status-ready-bg: '#ECFDF5'
  status-ready-border: '#A7F3D0'
  status-close-text: '#B45309'
  status-close-bg: '#FFFBEB'
  status-close-border: '#FDE68A'
  status-stretch-text: '#4338CA'
  status-stretch-bg: '#EEF2FF'
  status-stretch-border: '#C7D2FE'
  skill-technical: '#2563EB'
  skill-technical-bg: '#EFF6FF'
  skill-durable: '#7C3AED'
  skill-durable-bg: '#F5F3FF'
  skill-credential: '#0D9488'
  skill-credential-bg: '#F0FDFA'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system is engineered for enterprise workforce mobility, career pathway navigation, and skills graph intelligence. The core philosophy is "Path First, Graph Second" — transforming complex, multi-dimensional relational ontologies into digestible, actionable human journeys.

### Brand Personality & Emotional Impact
- **Authoritative & Trustworthy:** Enterprise-grade reliability built on predictable, structured layouts.
- **Empathetic & Guiding:** Clear progress markers and non-judgmental gap analysis reduce the cognitive overwhelm of career transitions.
- **Systematic & Utilitarian:** High-density data tables, matrices, and flow lanes engineered for instant legibility and executive-grade decision-making.

### Visual Style
The design system combines **Corporate Modern** with **Technical Precision**. It avoids decorative frivolity (no heavy glassmorphism, no neo-brutalist harshness) in favor of crisp white surface cards, low-contrast borders, purposeful semantic badges, and functional ambient elevation. Accessible, multi-channel communication is a core tenant: status and graph relationships are never signaled by color alone; they are always reinforced through typography, iconography, and distinct geometric node shapes.

## Colors

The color system operates under strict WCAG AA/AAA compliance rules on all functional interfaces.

### Foundations & Surface Palette
- **Canvas Background (`surface-canvas`):** `#F8FAFC` (Slate 50) provides a soft, eye-resting backdrop that separates the page canvas from active cards.
- **Card & Surface Tiers (`surface-card`):** `#FFFFFF` pure white, used across elevated paper panels, active data tables, and input containers.
- **Structural Outlines:** `#E2E8F0` for interior dividers, card borders, and lane boundaries. `#CBD5E1` for hover states, active tab baselines, and graph connector lines.
- **Primary Brand Ink:** `#0F172A` (Slate 900) ensures extreme contrast for headings and primary actions, accented by `#2563EB` (Action Blue) for interactive states, focused links, and primary navigation buttons.

### Semantic Status Badges
Status chips communicate career fit and skill match degrees. Every semantic status uses paired text, background tint, and border tone to guarantee minimum 4.5:1 text-to-background contrast:
- **READY (High Match / Low Barrier):** Foreground `#047857`, Background `#ECFDF5`, Border `#A7F3D0`.
- **CLOSE (Moderate Gap / Near Term):** Foreground `#B45309`, Background `#FFFBEB`, Border `#FDE68A`.
- **STRETCH (Aspirational / High Gap):** Foreground `#4338CA`, Background `#EEF2FF`, Border `#C7D2FE`.

### Ontology Skill Categories
- **Technical Skills:** Blue (`#2563EB` on `#EFF6FF`).
- **Durable / Human Skills:** Purple (`#7C3AED` on `#F5F3FF`).
- **Credentials & Certifications:** Teal (`#0D9488` on `#F0FDFA`).

## Typography

The design system uses a unified **Inter** grotesque grotesque typeface stack engineered specifically for dense dashboards, tabular data interfaces, and graph labels.

### Typographic Hierarchy Rules
- **High-Contrast Text System:** Primary typography renders in `#0F172A` (Slate 900) for headers and card titles. Body copy uses `#334155` (Slate 700). Secondary metadata, breadcrumbs, and helper text use `#64748B` (Slate 500).
- **Match Badges & Chips:** Render strictly using `label-sm` with uppercase styling, explicit `0.05em` letter spacing, and a minimum font weight of `600` for crisp legibility inside badges.
- **Tabular Data & Matrices:** Numerics and metric data points render using tabular numbers (`font-variant-numeric: tabular-nums`) to preserve optical alignment across comparison matrices and gap tables.
- **Responsive Handling:** Page headers scale down via responsive variant tokens on viewports smaller than 768px, preventing header wrapping in multi-column dashboards.

## Layout & Spacing

Layouts follow an 8px grid baseline rhythm standard to MUI v7 and Refine v5 enterprise patterns.

### Core Layout Models
1. **The 3-Column Path Layout (My Map):**
   - **Column 1 (`Current State / Profile`):** 280px–320px fixed rail summarizing verified skills and baseline credential tier.
   - **Column 2 (`Gap Analysis / Bridge`):** Flexible center workspace featuring matrix comparisons, prerequisite delta checklists, and learning roadmaps.
   - **Column 3 (`Target Roles & Programs`):** 360px–400px panel anchoring target career profiles, wage projections, and associated credentials.
   - On screens `< 1200px`, the 3-column system stacks sequentially into a step-based progression.

2. **Navigator Dashboard (Skills × Roles Matrix):**
   - A multi-column dashboard with a fixed left filter bar (`space-lg` padding), responsive metric KPI tiles spanning 3–4 columns (`gutter: 1.5rem`), and a responsive horizontal-scroll data grid with sticky column pinning.

3. **Breakpoints & Form Factors:**
   - **Mobile (`< 600px`):** Single-column stack, outer canvas margin `1rem`, compact gutter `1rem`. Canvas graph views automatically fall back to accessible 1:1 tabular card views.
   - **Tablet (`600px - 1024px`):** 2-column adaptive flow, outer margin `1.5rem`.
   - **Desktop (`> 1024px`):** Full 12-column layout or 3-column path workflow with fixed 2rem outer margins.

## Elevation & Depth

Visual depth is conveyed through **crisp card elevation combined with low-contrast structural outlines**. The design avoids noisy multi-tier drop shadows, ensuring dense data remains readable.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Flat `#F8FAFC` surface with no shadows. Used for viewport background canvas.
- **Level 1 (Card & Content Surface):** `#FFFFFF` fill with border `1px solid #E2E8F0` and subtle ambient depth:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
  This represents standard cards, table containers, and filter toolbars.
- **Level 2 (Hover & Interactive Cards):**
  `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
  Applied to draggable skill nodes, selectable career cards, and pathway steps on pointer hover.
- **Level 3 (Modals, Graph Tooltips & Flyouts):**
  `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
  Border adjusted to `1px solid #CBD5E1` for floating node inspector drawers and dropdown popovers.

## Shapes

The design system maintains a **Rounded (Level 2)** geometry for standard UI containers (8px / 0.5rem base border radius), softened with fully rounded iconography.

### Graph & Node Shape Taxonomy
To ensure clarity in workforce mapping without relying exclusively on color, entity types are strictly governed by primary visual geometry:
- **Skill Nodes:** **Circle (`border-radius: 50%`)**. Always spherical, representing granular, elemental skill entities.
- **Role & Occupation Nodes:** **Rounded Rectangle (`border-radius: 8px`)**. Stable horizontal structural shape accommodating title and salary range.
- **Program & Pathway Nodes:** **Diamond (`transform: rotate(45deg)`)** or chamfered hexagon, symbolizing institutional education and credential gateways.

### Badges & Form Elements
- **Status Badges (`READY`, `CLOSE`, `STRETCH`):** Enclosed inside `rounded-md` (6px) or pill shapes with high-contrast text and a left-aligned status icon dot.
- **Buttons & Text Inputs:** `border-radius: 6px` to convey crisp, professional utility.

## Components

### 1. Buttons
- **Primary Action:** Solid background `#0F172A`, text `#FFFFFF`, hover `#1E293B`, border-radius `6px`, height 36px (medium) or 44px (large), font `label-lg`.
- **Secondary / Refine Actions:** White background, border `1px solid #CBD5E1`, text `#0F172A`, hover `#F8FAFC`.
- **Icon Buttons:** Rounded Material icons (`@mui/icons-material/*Rounded`), 20px glyph centered within a 36px × 36px touch target.

### 2. Status Chips & Skill Category Tags
- **Match Status Chips (`READY`, `CLOSE`, `STRETCH`):**
  - Height 24px, padding 2px 8px.
  - Border `1px solid` in matching status border token.
  - Text strictly formatted in `label-sm` (uppercase).
  - Must pair with a semantic prefix icon (e.g., `CheckCircleRounded` for READY, `AccessTimeRounded` for CLOSE, `TrendingUpRounded` for STRETCH).
- **Skill Badges:**
  - Technical: `#EFF6FF` background, `#2563EB` text, `border: 1px solid #BFDBFE`.
  - Durable: `#F5F3FF` background, `#7C3AED` text, `border: 1px solid #DDD6FE`.
  - Credential: `#F0FDFA` background, `#0D9488` text, `border: 1px solid #99F6E4`.

### 3. Cards & Panels
- **Structure:** Crisp white background (`#FFFFFF`), `1px solid #E2E8F0` border, `0.5rem` (8px) radius.
- **Header:** Padding `space-md` (16px), separated from card body with an optional `#F1F5F9` divider when containing dense tabular information.
- **Selected State:** Border color upgrades to `#2563EB` with an inset `0 0 0 1px #2563EB` focus ring.

### 4. Input Fields & Form Controls
- **Text Fields:** Background `#FFFFFF`, border `1px solid #CBD5E1`, border-radius 6px, padding `8px 12px`, text color `#0F172A`.
- **Focused State:** Border `#2563EB` with `0 0 0 3px rgba(37, 99, 235, 0.15)` focus halo.
- **Checkboxes & Radios:** Primary accent `#2563EB`, custom rounded corners (`4px` for checkboxes), verified checkmark icon using `@mui/icons-material/CheckRounded`.

### 5. Data Tables & Navigator Matrix
- **Header Row:** Sticky, background `#F8FAFC`, border-bottom `2px solid #E2E8F0`, typography `label-md` in uppercase `#64748B`.
- **Rows:** Alternating hover highlight `#F8FAFC`, baseline border-bottom `1px solid #F1F5F9`, minimum row height 48px.
- **Heatmap Gap Matrix Cells:** Discrete stepped opacity levels based on match percentage, paired with an explicit percentage or numeric deficit label inside every cell.

### 6. Accessible Alternate View Toggle
- A standardized toggle switch (`Graph View` vs. `Table/List View`) displayed on all pathway and mapping views. Enables a 1:1 fallback table view with keyboard navigation and screen-reader semantics for users unable to navigate graph canvases.