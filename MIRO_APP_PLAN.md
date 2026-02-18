# LifeLine — Miro App Plan

## 🎯 Goal

Publish LifeLine as a **Miro App** in the [Miro Marketplace](https://miro.com/marketplace/).  
User clicks "Use template" → gets a multi-decade life timeline generated directly on a Miro board as native board items (shapes, frames, text, connectors).

Perfect for **coaching sessions**, **life planning workshops**, and **strategic offsites** — where participants already use Miro.

---

## 🧩 Two Products in One

### Product A: Miro App (panel plugin)
- Icon in Miro sidebar → opens LifeLine panel
- User selects: birth year, hindsight/foresight, Gantt rows, milestones on/off
- Click "Generate" → life timeline is created on the board as native Miro items
- Can be re-generated, updated, deleted

### Product B: Miro Template (Miroverse)
- Pre-built board with a sample 60-year life timeline (1991–2051)
- Published to [Miroverse](https://miro.com/miroverse/) (community templates, no review needed)
- Free marketing — appears in search results for "life planning", "timeline", "coaching"
- Link to the full App for customization

---

## 📐 Architecture

```
lifeline-miro/
├── src/
│   ├── app.tsx              # Panel UI (settings form)
│   ├── index.ts             # SDK entry point
│   ├── generator.ts         # Timeline → Miro board items
│   ├── timeline-engine.ts   # Ported from calendar.js (year math, layout)
│   ├── milestones.ts        # Eurostat life milestones (M/F)
│   └── styles.css           # Panel styles (Mirotone CSS)
├── public/
│   └── icon.svg             # App icon for sidebar
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Stack:** TypeScript + React + Vite (official Miro starter)

---

## 🔧 Phase 1: Setup (Day 1)

### 1.1 Create Miro Developer Account
- Go to https://developers.miro.com
- Create a Developer Team (free)
- Register a new App in Developer Dashboard

### 1.2 Scaffold Project
```bash
npx create-miro-app@latest lifeline-miro
# Select: React, TypeScript
```

### 1.3 Configure App Permissions
Required OAuth scopes:
- `boards:read` — read board info
- `boards:write` — create items on board
- `identity:read` — user info (for onboarding)

### 1.4 Local Dev
```bash
cd lifeline-miro
npm run start    # Starts on localhost:3000
# Install app on test board via Developer Dashboard
```

---

## 🗓️ Phase 2: Timeline Engine (Days 2–4)

### 2.1 Port Core Logic from `calendar.js`

Extract pure functions (no DOM/SVG dependencies):

| Function | Purpose |
|----------|---------|
| `calcYearRange(birthYear, past, future)` | Generate year metadata array |
| `calcLayout(years, rows)` | Dimensions, cell sizes, decade grouping |
| `getMilestones(gender, birthYear)` | Eurostat statistical averages |
| `getDecadeName(decade, lang)` | Decade label (TWENTIES / ДВАДЦАТЫЕ) |
| `yearWidth(year, currentYear)` | Past: 10mm, Future: 20mm |

### 2.2 Timeline → Miro Items Mapping

| LifeLine Element | Miro Item Type | SDK Method |
|-----------------|----------------|------------|
| Decade group | `frame` | `miro.board.createFrame()` |
| Year column line | `shape` (line) | `miro.board.createShape()` |
| Year number label | `text` | `miro.board.createText()` |
| Decade label (TWENTIES) | `text` | `miro.board.createText()` |
| Gantt grid lines | `shape` (line) | `miro.board.createShape()` |
| Current year highlight | `shape` (rect) | `miro.board.createShape()` |
| ♀ Female lifeline | `shape` (line) | `miro.board.createShape()` |
| ♂ Male lifeline | `shape` (line) | `miro.board.createShape()` |
| Milestone dots | `shape` (circle) | `miro.board.createShape()` |
| Milestone labels | `text` | `miro.board.createText()` |
| Education bars (School/Uni) | `shape` (rounded rect) | `miro.board.createShape()` |
| Milestone icons | `shape` (SVG path) | `miro.board.createShape()` |
| Sticky note (event categories) | `sticky_note` | `miro.board.createStickyNote()` |

### 2.3 Color Palette (LifeLine)

```typescript
const COLORS = {
  paper:        '#F7F6F3',  // warm gray background
  ink:          '#37352F',  // main text (Notion-style)
  inkLight:     '#787774',  // secondary text
  yearNum:      '#999999',  // year numbers
  border:       '#E3E3E1',  // grid lines
  cellLine:     '#D1D1CF',  // cell separators
  currentYear:  '#D3E5EF',  // current year highlight (blue tint)
  decadeLabel:  '#81D8D0',  // decade name (Tiffany blue)
  decadeLine:   '#81D8D0',  // decade border
  femaleLine:   '#81D8D0',  // ♀ lifeline (Tiffany)
  femaleIcon:   '#B5EBE7',  // ♀ icons
  maleLine:     '#C4A8D8',  // ♂ lifeline (lavender)
  maleIcon:     '#DBC8EB',  // ♂ icons
  maleLabel:    '#9B7DB8',  // ♂ text
  stickyNote:   '#C6E8E5',  // sticky note background
};
```

---

## 🎨 Phase 3: Panel UI (Days 5–6)

### 3.1 Settings Panel

The app panel (sidebar) contains:

```
┌─────────────────────┐
│  LifeLine           │
├─────────────────────┤
│ Birth Year          │
│ [1991]              │
│                     │
│ Hindsight           │
│ ← [35] years        │
│                     │
│ Foresight           │
│ [25] years →        │
│                     │
│ Gantt Rows          │
│ ● 10  ○ 14          │
│                     │
│ Column Width        │
│ ● 1cm  ○ 1.5  ○ 2   │
│                     │
│ Life Milestones     │
│ ☑ Show ♀/♂ lines    │
│                     │
│ Language            │
│ ● EN  ○ RU          │
│                     │
│ ┌─────────────────┐ │
│ │  Generate ▶     │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │  Clear Timeline  │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### 3.2 Use Mirotone CSS
- Official Miro design system: https://www.mirotone.xyz/
- Ensures consistent look with native Miro UI
- `npm install mirotone`

---

## ⚡ Phase 4: Generator (Days 7–10)

### 4.1 Generation Flow

```
User clicks "Generate"
  → clearPreviousTimeline()
  → calcLayout(settings)
  → createMainFrame(totalW, totalH)
  → for each year:
      → createYearColumn(year)         // vertical line
      → createYearLabel(year)          // "2026" at top/middle/bottom
  → for each decade:
      → createDecadeLabel(decade)      // "TWENTIES" in Tiffany
  → createCurrentYearHighlight()       // blue rect
  → createGanttGrid(rows)             // horizontal lines
  → if milestones:
      → createLifeline('f', MILESTONES_F)  // ♀ Tiffany line
      → createLifeline('m', MILESTONES_M)  // ♂ lavender line
      → createMilestoneIcons()              // school, job, home, child, retire
      → createEducationBars()               // School 6-17, University 18-23
  → createStickyNote(categories)       // event category list
  → zoomToFit()
```

### 4.2 Performance Considerations

- Miro SDK has rate limits (~100 items/sec)
- 60-year timeline with milestones ≈ 300–500 items
- Use `Promise.all` batching (groups of 20)
- Show progress bar in panel: "Creating decade 3/6..."
- Cache generated item IDs in board metadata for cleanup

### 4.3 Board Metadata

Store timeline config in board app data:
```typescript
await miro.board.setAppData({
  lifeline: {
    version: '1.0',
    birthYear: 1991,
    past: 35,
    future: 25,
    rows: 10,
    milestones: true,
    lang: 'EN',
    generatedAt: Date.now(),
    itemIds: [...] // for cleanup
  }
});
```

---

## 📋 Phase 5: Miroverse Template (Day 11)

### 5.1 Create Template Board
- Generate a beautiful 60-year life timeline (1991–2051)
- Show ♀/♂ milestone lines with all icons
- Include sticky note with event categories
- Add instructional frame: "How to use LifeLine"
- Add link to the full Miro App and to lifeline.osovsky.com
- Use the Tiffany + lavender color palette

### 5.2 Template Description

**Title:** LifeLine — Life Timeline Visualization for Coaching & Planning

**Description:**
> See your entire life on a single Miro board — from birth to the horizon of your future.
> Gantt-style rows for personal events. Statistical life milestones for men and women.
> Perfect for life planning workshops, coaching sessions, and strategic offsites.
> Customize with the LifeLine Miro App or visit lifeline.osovsky.com.

**Category:** Planning & Strategy

**Tags:** life planning, timeline, coaching, personal development, life visualization, Gantt chart

### 5.3 Submit to Miroverse
- Go to https://miro.com/miroverse/
- Click "Share template"
- Fill in: title, description, category
- No review process — published immediately
- **This gives us instant visibility while the App goes through review**

---

## 🔒 Phase 6: Marketplace Submission (Days 12–14)

### 6.1 Requirements Checklist

| Requirement | Status |
|-------------|--------|
| OAuth 2.0 authorization | ☐ |
| HTTPS only | ☐ |
| TLS 1.2+ | ☐ |
| Privacy policy URL | ☐ |
| Support email | ☐ |
| App icon (128×128 SVG) | ☐ |
| Marketplace listing (screenshots, description) | ☐ |
| Mirotone CSS for UI | ☐ |
| No Miro credential storage | ☐ |
| Developer profile on Miro | ☐ |

### 6.2 Hosting

- **Vercel** (recommended) — free, HTTPS, auto-deploy from GitHub
- Already used for lifeline.osovsky.com

### 6.3 Marketplace Listing

**Title:** LifeLine — Life Timeline Generator

**Short description:** Generate multi-decade life timelines directly on your Miro board. Perfect for coaching, life planning workshops, and personal development sessions.

**Category:** Planning & Strategy

**Screenshots needed:**
1. Panel UI with settings
2. Generated timeline on board — full 60-year view
3. Close-up of ♀/♂ milestone lines with icons
4. Gantt rows with participant stickers
5. Workshop scenario — 4 participants' timelines side by side

### 6.4 Review Timeline
- Submit → Jira ticket created
- Review takes **6–8 weeks**
- Communication via Jira ticket
- May require iterations based on feedback

---

## 🚀 Phase 7: Post-Launch (Ongoing)

### 7.1 Analytics
- Miro App Metrics Dashboard (built-in):
  - Total installs
  - Daily active users
  - Churn rate
  - User reviews

### 7.2 Future Features
- Custom entries (user stickers on specific years)
- Team mode: multiple participants generate their timelines on one board
- Import from CSV (birthdate + events)
- Different timeline styles (compact, detailed, decade-focused)
- Integration with WallPlan Miro App (cross-link)

---

## 📅 Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Setup | Day 1 | Scaffolded project, dev environment |
| 2. Engine | Days 2–4 | Ported timeline logic (TypeScript) |
| 3. Panel UI | Days 5–6 | Settings form with Mirotone CSS |
| 4. Generator | Days 7–10 | Timeline → Miro board items |
| 5. Template | Day 11 | Miroverse template (instant publish) |
| 6. Submission | Days 12–14 | Marketplace submission |
| 7. Review | +6–8 weeks | Marketplace approval |

**Total active work: ~2 weeks**  
**Time to Marketplace: ~2 months** (including review)

---

## 💰 Monetization

The Miro App itself is **free** (drives LifeLine brand awareness).  
Revenue comes from:
- Brand visibility → users discover lifeline.osovsky.com
- Workshop facilitators → recommend LifeLine to participants
- Cross-sell with WallPlan Miro App
- Future: premium features (custom milestone sets, team sync, sticker packs)

---

## 🎯 Workshop Use Case (Key Differentiator)

This is LifeLine's **killer feature** in Miro that WallPlan doesn't have:

```
Workshop flow:
1. Facilitator opens Miro board
2. Generates 4× LifeLine timelines (one per participant)
3. Participants fill in their events using Miro stickers
4. Group discussion: compare timelines, find patterns
5. Screenshot/export for each participant
```

This makes LifeLine a **tool for coaches**, not just a personal app.

---

## 🔗 Key Links

- Miro Developer Platform: https://developers.miro.com
- Web SDK Docs: https://developers.miro.com/docs/web-sdk-reference
- Mirotone CSS: https://www.mirotone.xyz
- Miroverse (templates): https://miro.com/miroverse
- App Examples: https://github.com/miroapp/app-examples
- Marketplace Guidelines: https://developers.miro.com/docs/app-submission-requirements
- WallPlan Miro Plan: ../wallplan/MIRO_APP_PLAN.md (sister project)
