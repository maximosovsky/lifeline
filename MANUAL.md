# LifeLine — User Manual

## What is LifeLine?

LifeLine is a free tool that draws your entire life as a timeline — from birth to the horizon of your future. You can mark key events, see decades at a glance, and print it on paper (from A4 to 1-meter-wide rolls).

Everything runs in your browser. No login, no server, no account. Your data stays on your device.

**Live**: [lifeline.osovsky.com](https://lifeline.osovsky.com)

---

## Getting Started

When you open LifeLine, you see:

- A **white paper sheet** with your timeline (decades, years, Gantt grid)
- A **toolbar** at the top (desktop) or bottom (mobile)
- A **sticky note** on the left with life categories

The default view shows ~30 years of past and ~20 years of future.

---

## Setting Your Time Range

### Desktop

Two number inputs in the toolbar:
- **Left input** → start year (e.g. `1991`)
- **Right input** → end year (e.g. `2051`)

Type a year or use mouse scroll wheel to adjust.

### Mobile

- Tap the **⚙ gear icon** → opens the Settings sheet
- **Hindsight** = start year, **Foresight** = end year
- Type or scroll to adjust

---

## Adding Entries

Tap/click the **Life-button** (the favicon icon in the center of the toolbar).

A text box opens. Type one entry per line:

### Point entries (single year mark)

```
row, text, year
```

**Examples:**
```
3, Product launch, 2018
5, Started MBA, 2020
1, Born, 1991
```

- `row` = Gantt row number (1–14)
- `text` = your label
- `year` = the year to place it

### Bar entries (multi-year range)

```
row, YYYY-YYYY, text, color
```

**Examples:**
```
4, 1979-1990, School, lightblue
5, 1990-1995, University, #4A90D9
6, 1995-2020, Career at Google, salmon
3, 2001-2010, Marriage, pink
```

- `row` = Gantt row number (1–14), optional for bars
- `YYYY-YYYY` = start and end year
- `text` = label displayed on the bar
- `color` = any CSS color name or hex code (optional, default: `lightblue`)

### Color ideas

| Color | Good for |
|-------|----------|
| `lightblue` | Education |
| `#4A90D9` | Career |
| `salmon` | Relationships |
| `pink` | Family |
| `lightgreen` | Hobbies, travel |
| `gold` | Achievements |
| `#C4A8D8` | Personal growth |
| `lightyellow` | Projects |

### Tips

- **Edit anytime** — re-open the modal, all entries are pre-filled
- **Delete entries** — remove lines and click Add
- **All entries save at once** — the text box always shows all your entries
- **Data is private** — stored in your browser's localStorage only

---

## Life Milestones

Click/tap the **person icon** (👤) in the toolbar to toggle statistical life milestones.

Two lines appear on your timeline:

| Line | Color | Represents |
|------|-------|------------|
| ♀ Female | Tiffany `#81D8D0` | Average woman's life events |
| ♂ Male | Purple `#C4A8D8` | Average man's life events |

Based on **Eurostat statistical averages** for EU:

- 🎓 **School** (ages 6–17)
- 🎓 **University** (ages 18–23)
- 💼 **Career start**
- 🏠 **Leaving home**
- 👶 **First child**
- 🌅 **Retirement**
- ⏳ **Life expectancy**

Toggle on/off anytime — it doesn't affect your personal entries.

---

## Paper Formats

| Format | What it is | Best for |
|--------|-----------|----------|
| **A4** | Standard paper, multi-page | Home printing, A4/A3 printers |
| **×4** | 914mm roll × 4 copies | Copy center, large format wall printing |

### Desktop
Click the paper button in the toolbar (shows `A4` or `×4`).

### Mobile
- Quick toggle: tap the **A4** chip in the bottom bar
- Full selection: open **⚙ Settings** → Paper format chips

---

## Column Width

How wide each year column is on paper:

| Setting | Width | Best for |
|---------|-------|----------|
| **1 cm** | 10mm | Compact view, many decades |
| **1.5 cm** | 15mm | Balanced |
| **2 cm** | 20mm | Detailed, future planning |

> **Note:** Future years are always at least 2cm wide — more space for annotations.

### Desktop
Click the column width button (shows `1`, `1.5`, or `2`).

### Mobile
Open **⚙ Settings** → Column width chips.

---

## Gantt Rows

The horizontal rows where you place your life events.

| Option | The chart has |
|--------|-------------|
| **10** | 10 rows (more compact) |
| **14** | 14 rows (more space for entries) |

---

## Navigation

### Desktop
| Action | How |
|--------|-----|
| **Zoom** | Mouse scroll wheel |
| **Pan** | Click and drag |

### Mobile
| Action | How |
|--------|-----|
| **Pan** | One finger drag |
| **Zoom** | Pinch with two fingers |

---

## Sticky Note

The colored note on the left side is a **category cheatsheet**:

😊 Happiness · 💜 Relationships · 👶 Children · 🎓 Education · 🏢 Career · 💰 Income · ⛺ Travel · ✏ Hobbies · 🏃 Sport · 🏥 Health · 💀 Loss · ⚡ Conflicts

- **Drag** it anywhere (mouse or touch)
- It appears on your exported SVG/PDF
- Changes language with the app

---

## Exporting

### SVG (vector image)
- Best for: editing in Illustrator/Figma, crisp at any size
- File size: small

### PDF (print-ready document)
- Best for: sending to print shops, copy centers
- Fonts embedded (IBM Plex Sans)
- File size: larger

### Desktop
Click the **⬇ download** or **🖨 print** icon in the toolbar.

### Mobile
Tap the **⬇ download icon** → choose **SVG** or **PDF**.

---

## Printing Tips

### Home printer (A4)
1. Set paper format to **A4**
2. Export as **PDF**
3. Print — pages tile together to form one long timeline
4. Tape pages side by side

### Copy center (large format)
1. Set paper format to **×4** (914mm roll)
2. Export as **PDF** or **SVG**
3. Bring the file to a copy center with a wide-format plotter
4. Ask for 914mm (36") roll paper
5. You get 4 copies on one roll — cut and share!

### Recommended paper
- **Engineering roll paper**: 914mm wide, matte, any length
- **A3 printing**: export as A4 PDF, scale to fit A3 at the printer

---

## Privacy

- ✅ All data stored in **localStorage** (your browser only)
- ✅ Nothing is sent to any server
- ✅ No login, no account, no cookies (except GA4 analytics)
- ✅ Open source — you can verify the code yourself

To clear all entries: open the entry modal, delete all text, click Add.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Scroll wheel` | Zoom in/out |
| `Click + drag` | Pan canvas |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Timeline looks blank | Set a wider year range (e.g. 1990–2050) |
| Entries disappeared | Check that you didn't clear localStorage. Entries auto-save. |
| PDF fonts look wrong | Make sure fonts loaded (check console). Try re-exporting. |
| Mobile toolbar missing | Rotate to portrait mode. The toolbar shows at the bottom. |
| Zoom stuck | Refresh the page — viewport resets to fit content |

---

## FAQ

**Q: Can I save my timeline as an image (PNG)?**
A: Not yet — use SVG or PDF export. PNG export is planned.

**Q: Can I share my timeline with someone?**
A: URL sharing is planned. For now, export SVG/PDF and send the file.

**Q: Does it work offline?**
A: Yes! Once loaded, everything works without internet. Only PDF export needs CDN for the first load.

**Q: Can I use custom fonts?**
A: The timeline uses IBM Plex Sans. Custom font support is not available yet.

**Q: How many entries can I add?**
A: No hard limit. Practically, 50–100 entries work smoothly.

---

© 2014–2026 [Maxim Osovsky](https://www.wikidata.org/wiki/Q107189449). Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
