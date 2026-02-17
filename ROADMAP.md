# LifeLine — SEO & Growth Roadmap

## ✅ Done

- [x] `<title>` — descriptive
- [x] `<meta description>` — feature-rich
- [x] `<meta keywords>` — EN + RU terms
- [x] Open Graph (type, title, description, image 1200×630, url, site_name)
- [x] Twitter Card (summary_large_image)
- [x] `<link rel="canonical">`
- [x] `hreflang` (en + x-default)
- [x] JSON-LD `SoftwareApplication` schema
- [x] `robots.txt` with AI crawlers (GPTBot, Claude, Perplexity)
- [x] `sitemap.xml`
- [x] `manifest.json` (PWA)
- [x] `llms.txt` + `llms-full.txt`
- [x] `og-image.png` (1200×630)
- [x] Font preload (IBM Plex Sans 300/400/700)
- [x] GA4 analytics

---

## 🔴 1. Немедленно (сегодня-завтра)

### SEO Push
- [ ] Запушить SEO-фиксы — `sitemap.xml`, `llms.txt`, `llms-full.txt`
- [ ] Submit в **Google Search Console** — добавить `lifeline.osovsky.com`, отправить sitemap
- [ ] Submit в **Bing Webmaster Tools** — то же самое

### SEO Content
- [ ] Создать `keywords.md` — стратегия ключевых слов (primary, feature, long-tail, RU)
- [ ] Hidden `<h1>` + SEO текст — скрытый блок с ключевыми словами
- [x] Обновить `llms-full.txt` — добавить milestones, bar entries, education bars

---

## 🟡 2. На этой неделе — контент

### OG-image
- [ ] Проверить что `og-image.png` актуальный (с Tiffany-стилем) — первое впечатление в Telegram/Twitter/Facebook
- [ ] Тест через Facebook Sharing Debugger, Twitter Card Validator

### Welcome-модал
- [ ] Добавить welcome-модал на первом визите (localStorage flag)
- [ ] 2-3 предложения: что это, зачем, как начать + кнопка «Начать»
- [ ] Показывать только 1 раз (localStorage `lifeline-welcome-seen`)

### Кросс-ссылки WallPlan ↔ LifeLine
- [ ] В hidden SEO-текст — ссылки друг на друга
- [ ] В `<meta description>` — упомянуть "from the makers of WallPlan"
- [ ] В footer или скрытом блоке — `<a>` ссылка на wallplan

### GitHub Repository
- [x] Topics: `lifeline`, `life-timeline`, `life-visualization`, `life-calendar`, `gantt-chart`, `svg-export`, `pdf-export`, `personal-timeline`, `life-planning`, `planner`
- [x] Описание = SEO keywords

---

## 🟢 3. Продвижение (1-2 недели)

| Площадка | Что написать |
|----------|-------------|
| **Product Hunt** | Launch "LifeLine — See your entire life on paper" |
| **Hacker News** | Show HN: LifeLine – life timeline visualization, zero dependencies |
| **Reddit** | r/sideproject, r/webdev, r/productivity |
| **Twitter/X** | GIF/video — zoom from sticky note to full life |
| **Telegram** | Productivity channels |

### Assets
- [x] `CAROUSEL.md` — 4-slide text carousel (Hook → How → Print → CTA)
- [x] `MANUAL.md` — full user manual

---

## 🔵 4. Фичи для retention (2-4 недели)

| Фича | Эффект |
|------|--------|
| **Шеринг** — кнопка "Поделиться ссылкой" с параметрами в URL | Виральность, пользователи показывают свои lifelines |
| **Пресеты** — "Студент 20 лет", "Семья 40 лет", "Пенсионер 60 лет" | Снижает барьер входа |
| **Цветные записи** — привязать цвет из стикера к записям в Gantt | Визуальная ценность |
| **Экспорт PNG** — для быстрого шеринга в соцсетях (SVG/PDF тяжеловаты) | Виральность |

---

## 📊 5. Метрики — что отслеживать

| Метрика | Текущее | Цель |
|---------|---------|------|
| Session duration | > 3 мин ✅ | > 5 мин |
| Bounce rate | 25% ✅ | < 20% |
| Return visitors | ~0% | 20%+ |
| Export events (SVG/PDF) | не трекаем | Добавить GA4 event |

### GA4 Events (to add)
- [x] `export_svg` — скачивание SVG
- [x] `export_pdf` — скачивание PDF
- [x] `add_entry` — добавление записи
- [x] `toggle_milestones` — включение milestones
- [ ] `share_link` — шеринг (когда реализуем)

---

## ⭐ Приоритет #1

> **Google Search Console + Product Hunt + Welcome-модал**
> Эти три вещи дадут максимальный рост при минимальных затратах.

---

## 🛠️ Technical SEO

- [ ] Google Rich Results Test — проверить JSON-LD
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] `<noscript>` fallback content с ключевыми словами
- [ ] Verify social share previews (FB Debugger, Twitter Validator)
