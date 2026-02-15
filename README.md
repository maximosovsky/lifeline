# ⏳ LifeLine

**Life timeline visualization** — see your entire life on paper, from birth to horizon.

A browser-based tool that generates multi-page SVG timelines with a Gantt-style grid. Add personal events, export to PDF, print on large format paper (A4 or 914mm roll).

## 💡 Concept

> Lines and structures are a language for making sense of your life — just as a blueprint is the language of an engineer, a map is the language of a geographer, a Gantt chart and org chart are the language of a manager, BPMN is the language of IT, and a timeline is the language of a historian.

LifeLine is part of the broader **#линии_жизни** (#lifelines) and **#структуры_жизни** (#life_structures) methodology:

**Publications:**
- [Lifelines](https://t.me/maximosowski/382) · [Ladder of Life](https://t.me/maximosowski/383) · [Lifelines-2](https://t.me/maximosowski/384) · [Lifelines-3](https://t.me/maximosowski/385) · [Template](https://t.me/maximosowski/388)
- [Family Connections](https://t.me/maximosowski/394) · [13 Generations](https://t.me/maximosowski/397)
- [Academic Genealogies](https://t.me/maximosowski/399) · [Netmaps](https://t.me/maximosowski/402) · [Org Structures](https://t.me/maximosowski/403)
- [How to Draw a Vision of the Future](https://t.me/maximosowski/411) · [Expanding Planning Horizons](https://osowski.medium.com/calendar-392272c97af3) · [Timeline Calendar](https://t.me/maximosowski/174)
- [Шаблон «Линии жизни»](https://osovsky.medium.com/%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8-%D0%B6%D0%B8%D0%B7%D0%BD%D0%B8-1a2e5c978e22) (Medium)

**📹 Lectures & Seminars:**
- [Lifeline. Schematization](https://t.me/maximosowski/216) (Cheboksary, 2019)
- [Career Development of a Top Manager](https://t.me/maximosowski/172) (Sochi, 2018)
- [Lifeline. How Was It?](https://t.me/maximosowski/201) (PiR, 2018)
- [Lifeline & Schematization in Coaching](https://t.me/maximosowski/183) (Seminar, 2018)
- [Images of the Future & Graphic Thinking](https://t.me/maximosowski/114) (Kirov, 2017)
- [Forum of Ideas](https://t.me/maximosowski/266) (Moscow, 2020)

## ✨ Features

- **Decades at a glance** — past and future years on a scrollable multi-page canvas
- **Paper formats** — A4 (multi-page) and ×4 (914mm roll, 4 copies, continuous)
- **Gantt rows** — 10 or 14 rows for categories (career, education, travel, etc.)
- **Custom entries** — add events like `3, Product launch` at year `2018`
- **Repeat every year** — mark recurring events
- **PDF & SVG export** — with embedded IBM Plex Sans fonts, parallel font loading
- **RU/EN interface** — full localization toggle
- **Draggable sticky note** — category cheatsheet on screen (mouse + touch)
- **Mobile-first** — dedicated bottom bar/sheet UI with scroll wheel pickers
- **Touch gestures** — one finger pan, pinch-to-zoom, touch-drag for sticky note
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

Or visit the live version: [lifeline-phi.vercel.app](https://lifeline-phi.vercel.app)

## 🎛️ Controls

### Desktop

| Control | Action |
|---------|--------|
| **Hindsight dial** | Years into the past (drag up/down) |
| **Foresight dial** | Years into the future (drag up/down) |
| **A4 / ×4 chips** | Paper format selection |
| **10 / 14 chips** | Number of Gantt rows |
| **T button** | Add entry modal |
| **RU / EN** | Switch interface language |
| **⬇ SVG** | Download as SVG |
| **🖨 PDF** | Download as PDF |
| **Mouse wheel** | Zoom in/out |
| **Click + drag** | Pan the canvas |

### Mobile

| Control | Action |
|---------|--------|
| **35 past / 25 future** | Tap to open settings sheet |
| **A4 chip** | Paper format (tap to open sheet) |
| **T** | Add entry |
| **⬇** | Download SVG/PDF popup |
| **RU/EN** | Language toggle |
| **⚙** | Settings bottom sheet |
| **Scroll wheels** | Hindsight/Foresight (1–99 years) |

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
