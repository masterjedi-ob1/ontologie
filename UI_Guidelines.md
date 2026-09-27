# Taruvi UI/UX Guidelines (draft — terse standard)

Design-system rules the MUI theme can't enforce, plus general web-interface
rules for the parts of the stack no theme covers. State issue only. 

```ts
import { taruviTokens } from "../../theme/themeOptions"; // adjust depth to your file
```
---

## Theme-handled — don't rebuild

- Type: Open Sans 13px/1.6 body, Quicksand headings (H1 800, H2–H6 700)
- Buttons: Quicksand 700 UPPERCASE, 4px radius, min-h 28/36/44 (44px on `(pointer: coarse)`)
- Chips: pill, Quicksand 700 UPPERCASE, 4 pastel variants
- Cards/Dialogs: 10px radius, 28px padding
- Inputs: 6px radius, `#F3F3F5` fill, 16px font (blocks iOS zoom-on-focus), 2px focus ring
- Tables/DataGrid: 8px wrapper, 11px UPPERCASE head, hover `primary-50`, row virtualization built in
- Radii render ~50% softer than design-spec comments in `themeOptions.ts` say — trust the rendered value

## Color

- Brand tones (`success[500]`, `primary[700]`) → illustrations/swatches only
- Chip/status tone (`status.inProgress` `#1976d2`, `status.review` `#f57c00`, chip-success `#388e3c`) → chips, alerts, buttons, sidebar
- Chart tone (`status.resolved`, `status.chartPrimary`, `status.underReview`) → charts only, never UI affordances
- Never hardcode a brand hex — import `taruviTokens`
- Status chips: `<Chip color="success|info|warning|error" label="COMPLETE|IN PROGRESS|REVIEW|DELAYED" />`
- ON HOLD / TO DO chips use `sx` with a **measured** label color, not reflexive `#fff` — `#00acc1` (TO DO fill) is only 2.74:1 with white, needs a dark label
- Priority chips: `<Chip variant="outlined" color="error|warning|success" label="HIGH|MEDIUM|LOW" />` — theme supplies the tone, don't set `color`/`borderColor` by hand
- Tag/category chips: `variant="tagBlue|tagPurple|tagGreen|tagOrange|tagTeal|tagPink|tagLime|tagRose"` (8 variants) — hash tag name to an index for deterministic rotation; only append to the palette, never reorder
- Never use the tag rotation palette for status — rotation means "different," status means "different in severity"
- Every chip carries a text label; never a bare colored dot or fill
- Blue accent has 3 non-interchangeable jobs: `button.primaryDefault` = non-text only (rings/borders/fills, 3:1 bar); `button.primaryFill` = fill behind white text (contained buttons); `button.primaryHover` = foreground/text tone (links, labels, focused fields) — dark-mode uses `primary[300]`-class for the foreground role
- Pick foreground tones that pass on `background.default` and a hovered `primary[50]` row, not just on `paper` — a tone that only passes on paper fails on hover
- A fill's contrast depends on its label — light-to-mid fills (`status.todo`, `status.review`) need a dark label, not a reflexive white one

## Accessibility

- `<button>` for actions, `<a>`/`<Link>` for navigation — never a click handler on `Box`/`div`
- One `<h1>` per page (`variant` is visual, `component` is semantic) — never skip heading levels
- Icon-only controls need `aria-label` — a `<Tooltip>` is not an accessible name
- Color never carries meaning alone — chips/charts/errors carry text or icon + text too
- Never use `text.disabled` for content text (2.8:1, fails AA) — use `text.secondary`
- Errors use `role="alert"`
- Never remove focus outlines without a `:focus-visible` replacement
- Touch targets ≥24px, primary actions ≥44px — `size="small"` `IconButton` (30px) is table-row-only
- Landmarks present (`<main>`, `<nav>`, `<header>`); `document.title` updates on route change
- Modals: `aria-labelledby` → the `DialogTitle` id (MUI handles focus trap/Esc, not the label)
- Group focus with `:focus-within` for compound controls
- `aria-live="polite"` for toasts, result counts, selection counts; skip link first in tab order
- Full audit: **ui-ux-reviewer** agent, runs automatically via `.github/workflows/ui-ux-review.yml` on every PR touching `src/pages/**`/`src/components/**` — informational, never blocks merge

## Forms

- Single-column default; two columns only for genuinely paired inputs (Start/End, City/Country)
- Section titles: `component="h2"` (a form's only other heading is its `<h1>`; `h3` here skips a level) — use `h3` only under a genuine intervening `h2`
- Every input has a visible label above it — placeholder is never the only label, and is an example not an instruction (`e.g. jane@acme.com`)
- Correct `type`/`inputmode` (`email`, `tel`, `url`, `inputmode="numeric"`) + `autocomplete` tokens
- Related radios/checkboxes: `<FormControl component="fieldset">` + `<FormLabel component="legend">`
- Tab order matches visual order; `Enter` submits
- Disable spellcheck on emails/codes/usernames
- Warn before navigating away with unsaved changes
- Checkbox/radio label + control share one hit target, no dead zones
- Constrain before validating — date pickers over free text, selects for finite sets, masks for known formats; multi-step beats one long scroll on mobile; smart defaults where the app can reasonably guess
- Taruvi auth is redirect-based via `LoginRedirect` — building credential forms/password meters/username-availability checks means you've taken a wrong turn

## Typography

- Ellipsis character `…`, not `...`; loading states end with it too (`"Saving…"`)
- Dates: `MMM DD, YYYY` — never raw ISO, never two formats in one table
- Numeric columns meant for comparison: `font-variant-numeric: tabular-nums`
- Headings: `text-wrap: balance` (prevents widows) where supported
- Any column whose text can outgrow its width must ellipsize in its own element (DataGrid v7 flex cells don't inherit `text-overflow` from a bare string child) — wrap in `<Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>` or `<Typography noWrap>`

## Content Handling

- Long text: `truncate`/`noWrap`/`line-clamp` — never let it blow out a layout
- Flex children holding truncatable text need `min-width: 0`
- Anticipate short, average, and very long user-generated content — test with real-length data, not "Lorem ipsum"
- Empty cells render `—`, never `null` or blank

## Images

- `<img>` needs explicit `width`/`height` (prevents CLS)
- Below-fold images: `loading="lazy"`
- Above-fold critical images: `fetchpriority="high"`
- Avatars: 34px default; 30px in table rows

## Touch & Interaction

- `touch-action: manipulation` on interactive elements (prevents double-tap zoom delay)
- `overscroll-behavior: contain` in modals/drawers/sheets
- During drag: disable text selection, `inert` on the dragged element; provide a keyboard/tap alternative (move up/down in an overflow menu)
- `autoFocus` sparingly — desktop only, single primary input, avoid on mobile
- Row hover/selected states are theme-wired — leave them alone
- Interactive elements need a `hover:` state; hover/active/focus states increase contrast over rest

## Navigation & Flow

- Every flow has a visible exit — cancel, close, or working back navigation
- Browser back behaves: modals/drawers close, wizard steps step back, no broken intermediate state
- Multi-step flows go backward without losing entered data
- Session expiry preserves work — draft retained, re-auth in place, no silent data loss
- Current location always clear — active nav state, breadcrumbs on deep hierarchies, accurate page title
- Never a modal opened from a modal — stacked dialogs have no coherent escape
- Nothing auto-advances, auto-plays, or auto-refreshes without user control
- Error/404 pages offer a path forward — home link, search, or a relevant suggestion
- Filters/sort/pagination state → Refine's `filters[]`/`sorters[]` + `syncWithLocation`, never local `useState` alone — survives back-navigation

## Dark Mode & Theming

- NavKit ships 3 variants — Blue `#2b97ff` (default), White, Dark `#004369` — set via `getTheme` callback in `src/App.tsx`, not the MUI theme
- Theme mode lives in `src/contexts/color-mode/index.tsx`
- Dark-mode foreground tones use `primary[300]`-class, not the light-mode `button.primaryHover` value

## Page patterns

### List page

Required, no exceptions even for small datasets:
- `<Typography variant="h2" component="h1">` heading + primary action right-aligned
- Search input bound to server-side `search`, debounced 300–500ms, real `label` (visually hidden OK), full width on `xs` / 280–320px on `sm+`
- ≥1 filter control, pushed into Refine's `filters[]`
- Active-filter chip row when ≥1 filter set — `×` removes one, "Clear all" resets filters and keeps search
- Server-side pagination, default 10 rows
- All four empty-state variants (below)

One card, not three: heading+action in the header, then toolbar, then chip row, then rows — never split toolbar/grid into separate `<Paper>` blocks. Grid height `autoHeight`, never fixed pixels (theme's `--DataGrid-overlayHeight` already prevents the autoHeight-collapses-overlays bug — don't set it per page).

### Detail / show page

Required: breadcrumb (`<nav aria-label="Breadcrumb">`, current item `aria-current="page"`) · H1 + status chip beside it · Edit/Delete/More right-aligned (Delete → confirmation dialog below) · meta line (`body2 secondary`) below title · tabs labelled `Label (count)`, each tab body with its own empty/loading state.

### Empty states

Floor: never blank — every list has at least an *empty* state and an *error* state, each with a heading and next action.

Full 4-variant treatment *(judgment — 2 states is an acceptable floor for internal apps)*:
- No data yet (`total===0 && !search && !filters`) → `FolderOpenRounded` → contained "+ Create"
- No results found (search active, 0 rows) → `SearchOffRounded` → outlined "Clear search"
- No matching items (filters active, 0 rows) → `FilterListRounded` → outlined "Clear all filters"
- Unable to load (`isError`) → `ErrorRounded` → contained "Try again"

`role="status"` (error variant: `role="alert"`); icon `aria-hidden`. Anti-pattern: a search miss followed by a "+ Create" CTA.

### Tables
Left-align + vertical-center is the DataGrid v7 default (theme's `cell` slot flex-centers, including block-level `renderCell` children) — don't set `align`/`headerAlign` to achieve it, only to deviate. Cells: horizontal padding only (`0 16px`) — vertical padding pushes text down instead of centering it. Every action needs an accessible name (`GridActionsCellItem`'s `label`, not a tooltip). 5–6 visible columns; beyond that, a column picker or move data to the detail page.

### Bulk actions toolbar

A list with selection checkboxes needs one — checkboxes without it are dead controls. Appears only when ≥1 row selected · count in an `aria-live="polite"` region · clear-selection control has `aria-label` · destructive bulk actions route through the confirmation-dialog rules above · outlined-on-blue borders use `rgba(255,255,255,0.7)` (`0.5` fails 3:1).

### Entity card

Use when records are mobile-first, drag-ordered, or richer than scalars — not as a default alternative to rows. `<Card><CardContent>` → title row (`h5` + overflow menu) → description → chip stack → footer (date + edit/delete). Every card `IconButton` names its record (`aria-label="Delete Website Redesign"`, not "Delete"). Card title `component` fits the page outline (`h3` under the page `h1`). Whole-card navigation → `<CardActionArea>`, no nested buttons. Drag-to-reorder needs a keyboard/tap alternative.

### Stat / KPI card

Plain themed `<Card>` — number is the hero (`h3`, `component="p"`, not a heading), label above. No colored accent border, no decorative icon puck. If color carries meaning, say so in text too. Navigable tile → `<CardActionArea>` + trailing chevron only.

## Icons

Affordances, not decoration — add one only tied to an action/control. Decorative glyphs on stat tiles/section headers/card corners read as machine-generated. Exception: empty-state illustrations.

`*Rounded` variants only (`EditRoundedIcon`, not `EditIcon`). Sizes: inline 20px, standard 24px, feature/empty-state 32px+. Decorative → `aria-hidden`; meaningful → `titleAccess` or labelled parent. Never let the same icon mean two things.

## Charts
Legend top-right/bottom-center · axis Y starts at 0 · title Quicksand 600 top-left.

- `role="img"` with `aria-label` stating the takeaway, not the chart type ("Ticket status, Q2: 42% resolved")
- Underlying data as a `<table>` or `<figcaption>` — the accessible alternative, usually what users wanted anyway
- Distinguish series by a second channel besides color (labels, dash patterns, marker shapes), repeated in the legend swatch
- Each series ≥3:1 against the background — don't force 3:1 *between* series fills on 5+ categorical series (unsatisfiable; it forces a sequential luminance ramp that destroys hue coding). Use the non-color channel instead.
- Never put data only in a hover tooltip — unreachable on touch

## Where things live

| What | Where |
|---|---|
| Tokens, overrides | `themeOptions.ts` — `taruviTokens`, `componentOverrides(mode)` |
| Theme provider | `src/contexts/color-mode/index.tsx` |
| Fonts | `index.html` |
| Global styles | `src/App.tsx` — `<GlobalStyles>` |
| Sidebar geometry | `src/components/sidenav/MuiSidenav.tsx` |
| Home | `src/pages/home/index.tsx` |
| Refine list wiring | `taruvi-refine-providers` skill |
| A11y audit | **ui-ux-reviewer** agent, via `.github/workflows/ui-ux-review.yml` |
