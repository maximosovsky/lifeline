# LifeLine — Architecture

## Overview

LifeLine is a **client-side only** life timeline visualization tool. It renders multi-page SVG calendars spanning decades (past and future), with a Gantt-style row grid for personal events. No server, no database — everything runs in the browser.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Rendering | Pure SVG (DOM API, no libraries) |
| Layout | CSS + JS viewport management |
| PDF Export | jsPDF + svg2pdf.js (lazy-loaded CDN) |
| Fonts | IBM Plex Sans (Google Fonts + local TTF for PDF) |
| Persistence | localStorage (private per browser) |
| Hosting | Static files (Vercel / any HTTP server) |

## File Structure

```
lifeline/
├── index.html          # Single page: toolbar, modals, canvas, mobile UI
├── calendar.js         # Core engine (~1700 lines): SVG renderer, viewport, i18n
├── style.css           # All styling: toolbar, modals, rulers, responsive
├── fonts/
│   └── IBMPlexSans/    # TTF files for PDF embedding (200–700 weights)
├── ARCHITECTURE.md     # This file
├── README.md           # User-facing documentation
├── vercel.json         # Vercel deployment config
├── manifest.json       # PWA manifest
├── robots.txt          # Search engine directives
├── sitemap.xml         # Sitemap
└── og-image.png        # Open Graph preview image
```

## Core Components

### 1. SVG Calendar Generator (`generateCalendarSVG`)

Renders one page of the timeline as an SVG element:

- **Year columns**: 10mm for past years, 20mm for current year onward
- **Decade labels**: Large italic text (40px), centered on the decade's midpoint
- **Year labels**: Displayed at top, middle, and bottom of each column
- **Gantt grid**: Horizontal rows with configurable count (10 or 14)
- **Custom entries**: Text labels placed at (row, year) coordinates
- **Moleskine highlight**: Current year column gets a subtle background

### 2. Page Builder (`buildPages`)

Splits the full year range across multiple pages:

```
Past pages ← [right-aligned, 10mm cols] | [future pages → left-aligned, 20mm cols]
```

- Past: fills pages from right to left, leftmost page gets the legend zone
- Future: fills pages from left to right
- Each page is an independent SVG element

### 3. Viewport System (`applyViewport`)

Manages pan/zoom of the multi-page canvas:

- All pages use `position: fixed` with calculated screen coordinates
- Paper sheets rendered as background dividers
- Guides show printable area boundaries
- Mouse wheel = zoom, drag = pan

### 4. i18n System

```javascript
I18N.RU / I18N.EN → t('key') → localized string
```

- Decade names, tooltips, modal text, sticky note, mobile UI
- `toggleLang()` switches language and re-renders everything
- Language state stored in `_currentLang`

### 5. Custom Entries

```javascript
{ row: 3, text: "Product launch", year: 2018, yearly: false }
```

- Stored in `localStorage('lifeline-entries')`
- Private per browser — other users never see them
- `yearly: true` → renders on every year from `year` onward
- Input format: `"3, Product launch"` + `"2018"`

## Data Flow

```
User Input (dials/modal)
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
_loadPDFFonts(doc)   → fetch TTF files, encode base64, register in jsPDF
    ↓
svg2pdf(svg, doc)    → convert each SVG page to PDF page
    ↓
doc.save(filename)   → browser download
```

## Design Decisions

1. **No framework** — Pure vanilla JS for zero dependencies and instant load
2. **SVG over Canvas** — Vector output for crisp printing at any scale
3. **localStorage for entries** — Zero-config persistence, complete privacy
4. **Lazy PDF libs** — ~500KB loaded only when user exports
5. **Fixed positioning for pages** — Enables smooth pan/zoom without DOM reflow
6. **Variable column widths** — Past years are narrow (10mm), future years wide (20mm) for annotation space
