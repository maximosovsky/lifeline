---
title: I Built a Life Timeline Tool That Coaches Say You Shouldn't Use
published: false
description: A zero-dependency browser tool that turns your entire life into a printable Gantt chart — born from real strategic sessions, not a tutorial.
tags: javascript, opensource, webdev, productivity
cover_image: https://raw.githubusercontent.com/maximosovsky/lifeline/main/cover.jpg
---

In coaching, drawing lifelines is considered taboo. They say it frustrates people — forces them to confront gaps, failures, missed decades.

I'm not a coach. I'm a strategy consultant. And in strategic sessions, we draw timelines with organizations all the time. One day I thought: why not apply the same tool to personal strategy?

So I started drawing lifelines on paper with real participants. Decades across the top, life categories down the side, colored markers for events. It worked. People saw their entire life at a glance — patterns they never noticed, gaps they could fill, futures they could plan.

Then I automated it.

## What LifeLine Does

**[LifeLine](https://lifeline.osovsky.com)** is a browser-based tool that generates a multi-decade timeline with a Gantt-style grid. You mark events, milestones, and periods across 12 life categories — from Happiness to Career to Loss.

No login. No server. No database. Everything stays in your browser's localStorage.

The core idea: **see your entire life on one page** — from birth year to the horizon you choose.

![LifeLine — life timeline visualization](https://raw.githubusercontent.com/maximosovsky/lifeline/main/scrennshot.jpg)

### 12 Life Categories

| Category | | Category | |
|----------|--|----------|--|
| 😊 Happiness | 💜 Relationships | 👶 Children | 🎓 Education |
| 🏢 Career | 💰 Income | ⛺ Travel | ✏ Hobbies |
| 🏃 Sport | 🏥 Health | 💀 Loss | ⚡ Conflicts |

### What You Can Do

- Add point events: `3, Product launch, 2018`
- Add bar ranges: `4, 1979-1990, School, blue`
- Toggle life milestones (statistical ♀/♂ lines with education, career, family)
- Export as SVG or multi-page PDF
- Print on A4 sheets or **914mm plotter rolls**

Yes, I actually print these on a plotter. A 40-year life on a single continuous roll of paper, pinned to a wall. That's how we use them in real sessions.

## From Paper to Code

The first lifelines were hand-drawn on large paper with colored markers. Participants in strategic sessions would fill in their decades while I facilitated.

The problem: every session needed a fresh template. Drawing the grid by hand takes 30 minutes. Printing a pre-made template means fixed year ranges.

So I built a generator. Start year, end year, number of rows — the tool renders a perfect SVG grid that you can fill in digitally or print blank and fill by hand.

## Zero Dependencies — By Design

The entire project is three files:

```
index.html    — 18 KB (toolbar, modals, canvas, mobile UI)
calendar.js   — 84 KB (SVG renderer, viewport, i18n, PDF export)
style.css     — 25 KB (all styling, responsive, mobile)
```

No React. No build step. No npm install. The whole thing loads instantly and runs on any device with a browser.

### Why No Framework?

1. **Instant load** — zero bundle, zero hydration, zero FOUC
2. **SVG over Canvas** — vector output for crisp printing at any scale
3. **Offline-capable** — works without internet after first visit
4. **Easy to host** — `npx -y serve -l 3456` and you're done

The PDF export lazy-loads jsPDF + svg2pdf.js (~500KB) only when the user clicks "Download PDF". Seven font weights (IBM Plex Sans) are fetched in parallel and embedded as base64.

## The WallPlan Connection

LifeLine shares DNA with [WallPlan](https://github.com/maximosovsky/wallplan), my wall calendar generator. Same SVG rendering engine, same viewport pan/zoom system, same IBM Plex Sans fonts, same PDF export pipeline.

This wasn't an accident. WallPlan proved that pure SVG + vanilla JS can handle complex multi-page printable layouts. When I needed the same capability for life timelines, I forked the rendering core and adapted it.

Same engine, different purpose:
- **WallPlan** → years × months (planning ahead)
- **LifeLine** → decades × life categories (looking back and forward)

## Mobile-First, Touch-Native

The mobile UI uses a bottom bar + bottom sheet pattern:

- One-finger pan, two-finger pinch-to-zoom
- Paper format toggle (A4 / plotter roll)
- Column width selection (1cm / 1.5cm / 2cm per year)
- Entry input via a full-screen modal

Everything renders as SVG with `position: fixed` pages — smooth pan/zoom without DOM reflow.

## Built-in i18n

The tool ships with English and Russian interfaces. Language auto-detects on load. Every string — from decade labels to tooltip text to the sticky-note category cheatsheet — is localized through a built-in `t('key')` function. No i18n library needed.

Russian version lives at [lifeline.osovsky.com/ru](https://lifeline.osovsky.com/ru).

## Publications & Lectures

This isn't a weekend project. The methodology behind LifeLine has been presented at conferences and published since 2017:

- **Images of the Future & Graphic Thinking** — Kirov, 2017
- **Career Development of a Top Manager** — Sochi, 2018
- **Lifeline & Schematization in Coaching** — Seminar, 2018
- **Forum of Ideas** — Moscow, 2020
- **[Expanding Planning Horizons](https://osowski.medium.com/calendar-392272c97af3)** — Medium article

The concept: *"Lines and structures are a language for making sense of your life — just as a blueprint is the language of an engineer, a map is the language of a geographer, and a Gantt chart is the language of a manager."*

## Try It

**Live:** [lifeline.osovsky.com](https://lifeline.osovsky.com)
**GitHub:** [github.com/maximosovsky/lifeline](https://github.com/maximosovsky/lifeline)

```bash
npx -y serve -l 3456  # Open http://localhost:3456
```

---

*Building in public, one repo at a time. Follow the journey: [LinkedIn](https://www.linkedin.com/in/osovsky/) · [GitHub](https://github.com/maximosovsky)*
