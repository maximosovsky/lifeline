# ⏳ LifeLine

**Life timeline visualization** — see your entire life on paper, from birth to horizon.

A browser-based tool that generates multi-page SVG timelines with a Gantt-style grid. Add personal events, export to PDF, print on large format paper.

## ✨ Features

- **Decades at a glance** — past and future years on a scrollable multi-page canvas
- **Gantt rows** — 10 or 14 rows for categories (career, education, travel, etc.)
- **Custom entries** — add events like `3, Product launch` at year `2018`
- **Repeat every year** — mark recurring events
- **PDF & SVG export** — with embedded IBM Plex Sans fonts
- **RU/EN interface** — full localization toggle
- **Draggable sticky note** — category cheatsheet on screen
- **Moleskine-style highlight** — current year stands out
- **Private** — all data stored in your browser's localStorage, invisible to others
- **Zero dependencies** — no npm, no framework, pure vanilla JS

## 🚀 Quick Start

```bash
# Serve locally
npx -y serve -l 3456

# Open in browser
http://localhost:3456
```

## 🎛️ Controls

| Control | Action |
|---------|--------|
| **Hindsight dial** | Years into the past (pages) |
| **Foresight dial** | Years into the future (pages) |
| **10 / 14 chips** | Number of Gantt rows |
| **T button** | Add entry modal |
| **RU / EN** | Switch interface language |
| **⬇ SVG** | Download as SVG |
| **🖨 PDF** | Download as PDF |
| **Mouse wheel** | Zoom in/out |
| **Click + drag** | Pan the canvas |

## 📝 Adding Entries

1. Click the **T** button
2. Type: `3, Product launch` (row number, comma, event name)
3. Type year: `2018`
4. Optionally check **Repeat every year**
5. Click **Add**

Entries are saved in `localStorage` and persist across sessions.

## 🏗️ Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details.

## 📄 License

© 2014–2026 Maxim Osovsky. This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0).
