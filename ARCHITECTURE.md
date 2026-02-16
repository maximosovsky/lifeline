# LifeLine — Architecture

## Overview

LifeLine is a **client-side only** life timeline visualization tool. It renders multi-page SVG calendars spanning decades (past and future), with a Gantt-style row grid for personal events. No server, no database — everything runs in the browser. Fully responsive with dedicated mobile UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Rendering | Pure SVG (DOM API, no libraries) |
| Layout | CSS + JS viewport management |
| PDF Export | jsPDF + svg2pdf.js (lazy-loaded CDN) |
| Fonts | IBM Plex Sans (local TTF, preloaded for key weights) |
| Persistence | localStorage (private per browser) |
| Hosting | Static files (Vercel / any HTTP server) |

## File Structure

```
lifeline/
├── index.html          # Single page: toolbar, modals, canvas, mobile UI
├── calendar.js         # Core engine (~1760 lines): SVG renderer, viewport, i18n
├── style.css           # All styling: toolbar, modals, rulers, responsive, mobile
├── fonts/
│   └── IBMPlexSans/    # TTF files for PDF embedding (200–700 weights)
├── favicon.png         # LIF cube favicon
├── ARCHITECTURE.md     # This file
├── README.md           # User-facing documentation
├── PERFORMANCE.md      # Performance review and optimization notes
├── vercel.json         # Vercel deployment config
├── manifest.json       # PWA manifest
├── robots.txt          # Search engine directives
├── sitemap.xml         # Sitemap
└── og-image.png        # Open Graph preview image
```

## Core Components

### 1. SVG Calendar Generator (`generateCalendarSVG`)

Renders one page of the timeline as an SVG element:

- **Year columns**: configurable width (10/15/20mm) via `currentColW_MM`, future years min 20mm
- **Column width buttons**: 1cm / 1.5cm / 2cm on desktop toolbar + mobile settings
- **Decade labels**: Large italic text (40px), centered on the decade's midpoint
- **Year labels**: Displayed at top, middle, and bottom of each column
- **Gantt grid**: Horizontal rows with configurable count (10 or 14)
- **Custom entries**: Text labels placed at (row, year) coordinates
- **Moleskine highlight**: Current year column gets a subtle background

### 2. Page Builder (`buildPages`)

Splits the full year range across multiple pages:

```
Sheet paper (A4):
  Past pages ← [right-aligned, colW cols] | [future pages → left-aligned, max(colW,20mm) cols]

Roll paper (914mm, 914×2, 914×4):
  Single continuous page — all years on one unbroken SVG
```

- **Sheet paper**: Past fills from right to left, leftmost gets legend; future fills left to right
- **Roll paper**: One page spanning full year range, SVG height = printable height (calendarScale = 1)
- **914×4**: 4 copies stacked vertically on a single 914mm roll
- Each page is an independent SVG element

### 3. Paper Formats

| Format | Width | Height | Copies | Year width |
|--------|-------|--------|--------|------------|
| A4 | 297mm | 210mm | 1 | configurable (1/1.5/2 cm) |
| ×4 (914×4) | roll | 914mm | 4 | configurable (1/1.5/2 cm) |

- Paper selection via toolbar chips (A4, ×4)
- Tooltip shows page count / roll length
- `setPaperSize()` → `updateCalendar()` → `autoFitViewport()`

### 4. Viewport System (`applyViewport`)

Manages pan/zoom of the multi-page canvas:

- All pages use `position: fixed` with calculated screen coordinates
- Paper sheets rendered as background dividers
- Guides show printable area boundaries
- Mouse wheel = zoom, drag = pan
- Touch: one finger = pan, pinch = zoom

### 5. i18n System

```javascript
I18N.RU / I18N.EN → t('key') → localized string
```

- Decade names, tooltips, modal text, sticky note, mobile UI
- `toggleLang()` switches language and re-renders everything
- Language state stored in `_currentLang`
- Synced across desktop and mobile buttons

### 6. Custom Entries

```javascript
{ row: 3, text: "Product launch", year: 2018, yearly: false }
```

- Stored in `localStorage('lifeline-entries')`
- Private per browser — other users never see them
- `yearly: true` → renders on every year from `year` onward
- Input format: `"3, Product launch"` + `"2018"`

### 7. Sticky Note

- Draggable category cheatsheet positioned left of first page
- 12 categories: 😊 Happiness, 💜 Relationships, 👶 Children, 🎓 Education, 🏢 Career, 💰 Income, ⛺ Travel, ✏ Hobbies, 🏃 Sport, 🏥 Health, 💀 Loss, ⚡ Conflicts
- `position: fixed` on `document.body`
- Supports both mouse and touch drag
- Content translates with language switch
- Remembers drag position until page reload

## Mobile UI

### Bottom Bar (`mob-bar`)
- Year range display (e.g. "1991–\n2051") — read-only text
- Paper format chip (A4 / ×4) — direct toggle, no sheet
- Entry button (T), download (SVG/PDF), language toggle, settings

### Bottom Sheet (`mob-sheet`)
- **Hindsight/Foresight inputs**: Absolute year number inputs
- **Paper format chips**: A4, ×4
- **Gantt rows chips**: 10, 14
- **Column width chips**: 1 cm, 1.5 cm, 2 cm
- Overlay dismissal on tap outside

### Touch Gestures
- One finger = pan
- Two fingers = pinch-to-zoom
- Sticky note drag via `touchstart/touchmove/touchend`

## Data Flow

```
User Input (year inputs / column width / paper chips / modal)
    ↓
updateCalendar()
    ↓
buildPages() → generateCalendarSVG() × N pages
    ↓
applyViewport() → position fixed SVGs on screen
    ↓
drawRulers() → mm-scale rulers
```

## PDF Export Pipeline

```
printPDF()
    ↓
_ensurePDFLibs()     → lazy-load jsPDF + svg2pdf.js
    ↓
_loadPDFFonts(doc)   → fetch TTF files in parallel (Promise.all), encode base64
    ↓
svg2pdf(svg, doc)    → convert each SVG page to PDF page
    ↓
doc.save(filename)   → browser download
```

## Performance

- **Font preload**: 3 key weights (300/400/700) preloaded via `<link rel="preload">`
- **Parallel font loading**: All 7 PDF font weights fetched simultaneously
- **DOM pooling**: `_getPooledDiv` / `_hidePoolFrom` for paper sheet elements
- **Debounced updates**: Mobile wheel scroll, resize events
- **Lazy PDF libs**: ~500KB loaded only when user exports

## Design Decisions

1. **No framework** — Pure vanilla JS for zero dependencies and instant load
2. **SVG over Canvas** — Vector output for crisp printing at any scale
3. **localStorage for entries** — Zero-config persistence, complete privacy
4. **Lazy PDF libs** — ~500KB loaded only when user exports
5. **Fixed positioning for pages** — Enables smooth pan/zoom without DOM reflow
6. **Configurable column widths** — User selects 1cm, 1.5cm, or 2cm; future years min 20mm
7. **Mobile-first responsive** — Dedicated touch UI with bottom bar/sheet pattern
8. **Roll paper = single page** — Continuous timeline without breaks for large-format printing
