# LifeLine — Performance Review

**Date**: 2026-02-15
**Codebase**: `calendar.js` (1749 lines, 60KB)

---

## ✅ What's Done Well

| Area | Details |
|------|---------|
| **requestAnimationFrame** | Pan/zoom uses `_rafId` guard — no double-renders per frame |
| **DOM Pooling** | `_getPooledDiv` / `_hidePoolFrom` reuses paper/guide divs instead of recreating |
| **Lazy PDF loading** | jsPDF + svg2pdf.js loaded only on export (~500KB saved on initial load) |
| **Font caching** | `_fontCache` fetches TTF files once, reuses base64 on subsequent PDFs |
| **SVG path batching** | Grid lines collected into single `<path>` via string concatenation instead of individual `<line>` elements |
| **Cached page refs** | `_cachedPages` avoids repeated `querySelectorAll` on every viewport update |
| **Resize debounce** | `window.resize` debounced with 150ms timer |

---

## ⚠️ Issues Found

### 1. Dead Code: `DECADE_NAMES` object (lines 186–192)
```javascript
const DECADE_NAMES = { 1920: 'TWENTIES', ... }; // UNUSED
```
Line 242 uses `I18N[_currentLang].decades[d]` — this object is never read.

> **Fix**: Delete lines 186–192.

---

### 2. `yearsWidth()` is O(n) per call, called multiple times
```javascript
const yearsWidth = (from, to) => {
    let w = 0; for (let y = from; y <= to; y++) w += yearW(y); return w;
};
```
Called for: `totalYearsW`, every custom entry, every decade label. For 60-year range × 10 entries × 4 pages = hundreds of loop iterations.

> **Fix**: Precompute cumulative width array once:
> ```javascript
> const cum = [0];
> for (let y = startYear; y <= endYear; y++) cum.push(cum[cum.length-1] + yearW(y));
> const yearsWidth = (from, to) => cum[to - startYear + 1] - cum[from - startYear];
> ```

---

### 3. Custom entries: nested loop is O(entries × years)
```javascript
for (const e of customEntries) {
    for (let y = startYear; y <= endYear; y++) { ... }
}
```
With 20 entries × 60 years = 1200 iterations per page. Each creates an SVG `<text>` element even if not needed.

> **Fix**: For non-yearly entries, skip the inner loop entirely:
> ```javascript
> if (!e.yearly) {
>     if (e.year >= startYear && e.year <= endYear) { /* render once */ }
> } else { /* loop from e.year to endYear */ }
> ```

---

### 4. `new Date().getFullYear()` called inside `generateCalendarSVG`
```javascript
const currentYear = new Date().getFullYear(); // line 137
```
Called once per page (4–6 times). Minor, but should be a parameter.

> **Fix**: Pass `currentYear` from `buildPages` where it's already computed.

---

### 5. Sticky note drag adds duplicate event listeners
`_ensureStickyNote()` is called on every `buildPages()`. It checks `if (!note)` before creating, but if the note already exists, it only updates `innerHTML`. However, on first create, it adds `mousemove` and `mouseup` to **document** — these are never removed.

If `buildPages` is called 10+ times (e.g. changing settings), there's only 1 set of listeners. ✅ OK — the closure guards prevent issues.

---

### 6. `applyViewport()` computes everything every frame
`applyViewport` is ~120 lines and touches 15+ DOM elements on every pan/zoom frame. Most of the guide/ruler/panel positioning could be skipped during pan (only `left`/`top` changes).

> **Optimization**: Split into `_applyPositionOnly()` for pan (just left/top on pages) and full `applyViewport()` for zoom changes.

---

### 7. Font files fetched sequentially
```javascript
for (const w of weights) {
    const resp = await fetch('fonts/IBMPlexSans/' + w.file);  // sequential!
    const buf = await resp.arrayBuffer();
}
```
7 font files loaded one-by-one. ~200ms per font = ~1.4s total.

> **Fix**: Use `Promise.all`:
> ```javascript
> const results = await Promise.all(weights.map(w =>
>     fetch('fonts/IBMPlexSans/' + w.file).then(r => r.arrayBuffer())
> ));
> ```

---

### 8. `drawRulers()` redraws full canvas on every pan frame
Both ruler canvases (~400 lines of drawing) redraw completely on every viewport change. This is expensive during smooth panning.

> **Fix**: Either throttle ruler redraws to 30fps, or only redraw the visible portion incrementally.

---

## 📊 Impact Summary

| Issue | Severity | User Impact | Fix Effort |
|-------|----------|-------------|------------|
| Dead DECADE_NAMES | 🟢 Low | None (dead code) | 1 min |
| yearsWidth O(n) | 🟡 Medium | Slow render with 60+ years | 5 min |
| Custom entries loop | 🟡 Medium | Slow with many entries | 5 min |
| Font sequential load | 🔴 High | 1.4s PDF export delay | 2 min |
| Rulers every frame | 🟡 Medium | Jank during pan on slow devices | 15 min |
| applyViewport split | 🟡 Medium | Smoother pan/zoom | 20 min |

---

## 🎯 Quick Wins (< 10 min total)

1. Delete dead `DECADE_NAMES` → saves confusion
2. Parallel font loading → 5× faster PDF export
3. Optimize custom entries loop → eliminates O(n²)
