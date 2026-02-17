// ─── Lifeline Calendar — SVG Renderer ───

// ─── i18n ───
let _currentLang = /\/ru(\/|$)/i.test(location.pathname) ? 'RU' : 'EN';

const I18N = {
	RU: {
		decades: { 1900: 'ДЕВЯТИСОТЫЕ', 1910: 'ДЕСЯТЫЕ', 1920: 'ДВАДЦАТЫЕ', 1930: 'ТРИДЦАТЫЕ', 1940: 'СОРОКОВЫЕ', 1950: 'ПЯТИДЕСЯТЫЕ', 1960: 'ШЕСТИДЕСЯТЫЕ', 1970: 'СЕМИДЕСЯТЫЕ', 1980: 'ВОСЬМИДЕСЯТЫЕ', 1990: 'ДЕВЯНОСТЫЕ', 2000: 'ДВУХТЫСЯЧНЫЕ', 2010: 'ДЕСЯТЫЕ', 2020: 'ДВАДЦАТЫЕ', 2030: 'ТРИДЦАТЫЕ', 2040: 'СОРОКОВЫЕ', 2050: 'ПЯТИДЕСЯТЫЕ', 2060: 'ШЕСТИДЕСЯТЫЕ', 2070: 'СЕМИДЕСЯТЫЕ', 2080: 'ВОСЬМИДЕСЯТЫЕ', 2090: 'ДЕВЯНОСТЫЕ' },
		sticky: ['😊 Счастье', '💜 Личные отношения', '👶 Дети', '🎓 Образование', '🏢 Работа', '💰 Доходы', '⛺ Путешествия', '✏ Хобби', '🏃 Спорт', '🏥 Здоровье', '💀 Смерть близких', '⚡ Конфликты'],
		addEntry: 'Добавить запись',
		add: 'Добавить',
		cancel: 'Отмена',
		repeatYearly: 'Повторять каждый год',
		downloadSvg: 'Скачать SVG',
		downloadPdf: 'Скачать PDF',
		hindsight: 'Прошлое',
		foresight: 'Будущее',
		addEntryTip: 'Добавить запись',
		language: 'Язык',
		pages: 'стр.',
		downloadQ: 'Скачать',
		yes: 'Да',
		paperFormat: 'Формат бумаги',
		ganttRows: 'Строки',
		columnWidth: 'Ширина колонки',
		welcomeSkip: 'Пропустить',
		welcome1title: 'Вся жизнь на одном листе бумаги',
		welcome1a: 'От рождения до горизонта будущего — на одной шкале.',
		welcome1b: 'Десятилетия видны с первого взгляда.',
		welcome1hint: 'Свайпни, чтобы узнать больше →',
		welcome2title: 'Добавляй события',
		welcome2a: 'Нажми Life-кнопку и пиши по одному событию на строку:',
		welcome2b: 'Точки, полоски, любой цвет.',
		welcome3title: 'Распечатай и повесь на стену',
		welcome3a: 'Экспортируй SVG или PDF. Печатай дома на A4 или в копи-центре на метровом рулоне.',
		welcome3b: '4 копии на одном рулоне — для мастерских и коучинг-сессий.',
		welcome4title: 'Начать',
		welcome4a: 'Бесплатно навсегда. Без регистрации. Данные только у тебя.',
		welcomeStart: 'Начать',
	},
	EN: {
		decades: { 1900: '1900S', 1910: 'TENS', 1920: 'TWENTIES', 1930: 'THIRTIES', 1940: 'FORTIES', 1950: 'FIFTIES', 1960: 'SIXTIES', 1970: 'SEVENTIES', 1980: 'EIGHTIES', 1990: 'NINETIES', 2000: '2000S', 2010: '2010S', 2020: '2020S', 2030: '2030S', 2040: '2040S', 2050: '2050S', 2060: '2060S', 2070: '2070S', 2080: '2080S', 2090: '2090S' },
		sticky: ['😊 Happiness', '💜 Relationships', '👶 Children', '🎓 Education', '🏢 Career', '💰 Income', '⛺ Travel', '✏ Hobbies', '🏃 Sport', '🏥 Health', '💀 Loss', '⚡ Conflicts'],
		addEntry: 'Add Entry',
		add: 'Add',
		cancel: 'Cancel',
		repeatYearly: 'Repeat every year',
		downloadSvg: 'Download SVG',
		downloadPdf: 'Download PDF',
		hindsight: 'Hindsight',
		foresight: 'Foresight',
		addEntryTip: 'Add entry',
		language: 'Language',
		pages: 'pages',
		downloadQ: 'Download',
		yes: 'Yes',
		paperFormat: 'Paper format',
		ganttRows: 'Gantt rows',
		columnWidth: 'Column width',
		welcomeSkip: 'Skip',
		welcome1title: 'Your entire life on a single sheet of paper',
		welcome1a: 'From birth to the horizon of your future — on one timeline.',
		welcome1b: 'See decades at a glance. Mark what matters.',
		welcome1hint: 'Swipe to learn more →',
		welcome2title: 'Add your events',
		welcome2a: 'Tap the Life-button and type one entry per line:',
		welcome2b: 'Points, bars, any color you want.',
		welcome3title: 'Print it on your wall',
		welcome3a: 'Export as SVG or PDF. Print at home on A4 or at a copy center on 1-meter-wide roll paper.',
		welcome3b: '4 copies on one roll — for workshops and coaching sessions.',
		welcome4title: 'Start exploring',
		welcome4a: 'Free forever. No signup. Your data never leaves your device.',
		welcomeStart: 'Start exploring',
	},
};

function t(key) { return I18N[_currentLang][key] || I18N.EN[key] || key; }

// Справочники
const MONTHS = [
	'', 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

// (Week days removed — not used in LifeLine)

// (Holidays removed — not used in LifeLine)
let customEntries = JSON.parse(localStorage.getItem('lifeline-entries') || '[]'); // {row, text, year, yearly}

function getCustomEntries(year) {
	const h = {};
	for (const e of customEntries) {
		if (e.yearly || e.year === year) {
			const key = pad2(e.month) + pad2(e.day);
			h[key] = e.text;
		}
	}
	return h;
}

// Утилиты для дат
function getUSDayOfWeek(date) { return date.getDay(); }
function getLastDayOfMonth(date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); }

function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function pad2(n) { return String(n).padStart(2, '0'); }
function formatIndex(date) { return String(date.getFullYear()).slice(2) + pad2(date.getMonth() + 1); }

// ─── SVG Helper ───
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, parent) {
	const el = document.createElementNS(SVG_NS, tag);
	if (attrs) for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
	if (parent) parent.appendChild(el);
	return el;
}

// ─── SVG Layout Constants (in unitless "points", 1pt ≈ on-screen px at scale 1) ───
const LAYOUT = {
	// Month column — all months have equal width
	monthColW: 340,     // width of one month column (equal for all months)

	// Gantt row height
	cellH: 14,          // height of one Gantt row (empty)

	// Month names & year
	monthNameH: 30,     // month name row height
	yearH: 20,          // year label row height

	// Spacer column (first column, left side)
	spacerW: 60 * (96 / 25.4),  // 60mm legend zone for row labels

	// Borders
	monthBorderW: 0.5,
	quarterBorderW: 0.75,
	yearBorderW: 1,

	// Fonts
	fontFamily: "'IBM Plex Sans', FreeSans, sans-serif",
};

// ─── Colors ───
const COLORS = {
	ink: '#37352f',
	inkLight: '#787774',
	red: '#eb5757',
	border: '#e3e3e1',
	cellLine: '#d1d1cf',
};

// ─── Life Milestones (Eurostat statistical averages) ───
const MILESTONES_F = [
	{ ageStart: 6, ageEnd: 17, type: 'bar', svgKey: 'school', en: 'School', ru: 'Школа' },
	{ ageStart: 18, ageEnd: 23, type: 'bar', svgKey: null, en: 'University', ru: 'Университет' },
	{ age: 23, svgKey: 'job', en: 'Start of\nfirst employment', ru: 'Первая\nработа', labelAlign: 'end' },
	{ age: 25.1, svgKey: 'home', en: 'Leaving\nparental home', ru: 'Уход\nиз дома', labelAlign: 'start' },
	{ age: 28.9, svgKey: 'child', en: 'First\nchild', ru: 'Первый\nребёнок' },
	{ age: 58.8, svgKey: 'retire', en: 'Retirement', ru: 'Пенсия' },
	{ age: 83.3, svgKey: 'life', en: 'Life\nexpectancy', ru: 'Ожидаемая\nпрод. жизни' },
];
const MILESTONES_M = [
	{ ageStart: 6, ageEnd: 17, type: 'bar', svgKey: 'school', en: 'School', ru: 'Школа' },
	{ ageStart: 18, ageEnd: 23, type: 'bar', svgKey: null, en: 'University', ru: 'Университет' },
	{ age: 22, svgKey: 'job', en: 'Start of\nfirst employment', ru: 'Первая\nработа', labelAlign: 'end' },
	{ age: 27.1, svgKey: 'home', en: 'Leaving\nparental home', ru: 'Уход\nиз дома', labelAlign: 'start' },
	{ age: 59.4, svgKey: 'retire', en: 'Retirement', ru: 'Пенсия' },
	{ age: 77.9, svgKey: 'life', en: 'Life\nexpectancy', ru: 'Ожидаемая\nпрод. жизни' },
];
let _showMilestones = false;
let _globalBirthYear = 1991;

// ─── SVG Calendar Generator (year-based) ───
function generateCalendarSVG(startYear, endYear, emptyRows, pageW, totalH, alignRight, hasLegend) {
	const L = LAYOUT;
	const numYears = endYear - startYear + 1;
	const MM = 96 / 25.4;
	const mW = currentColW_MM * MM;    // configurable column width
	const mW2 = Math.max(currentColW_MM, 20) * MM;   // future years: at least 20mm
	const legendW = L.spacerW;
	const currentYear = new Date().getFullYear();

	// Per-year width helpers
	const yearW = (y) => y > currentYear ? mW2 : mW;
	const yearsWidth = (from, to) => {
		let w = 0; for (let y = from; y <= to; y++) w += yearW(y); return w;
	};
	const totalYearsW = yearsWidth(startYear, endYear);

	const r0H = 38;
	const r1H = 20;
	const headerH = r0H + r1H;
	const yGantt = headerH;
	const ganttRowH = (totalH - headerH) / emptyRows;

	// ── Year columns position ──
	let xYearsStart;
	if (alignRight) {
		xYearsStart = pageW - totalYearsW;
	} else {
		xYearsStart = 0;
	}
	const xYearsEnd = xYearsStart + totalYearsW;

	// ── Content start for horizontal lines ──
	let xContentStart = xYearsStart;
	if (hasLegend) {
		xContentStart = xYearsStart - legendW;
	}
	xContentStart = Math.max(0, xContentStart); // clamp to printable area

	// ── Create SVG ──
	const svg = document.createElementNS(SVG_NS, 'svg');
	svg.setAttribute('viewBox', `0 0 ${pageW} ${totalH}`);
	svg.setAttribute('xmlns', SVG_NS);
	svg.setAttribute('width', pageW);
	svg.setAttribute('height', totalH);
	svg.style.overflow = 'visible';

	const styleEl = svgEl('style', {}, svg);
	styleEl.textContent = `
		text { font-family: ${L.fontFamily}; fill: ${COLORS.ink}; }
		.year-num { fill: #999999; }
		.decade-label { fill: #81D8D0; font-family: 'IBM Plex Sans', sans-serif; font-weight: 200; letter-spacing: 6px; }
	`;

	let pathGray = '';

	// ── Decade names ──


	// ── Render year columns ──
	let xCursor = xYearsStart;
	const _yearLabels = []; // collect for deferred rendering (on top of grid)
	for (let yi = 0; yi < numYears; yi++) {
		const year = startYear + yi;
		const colW = yearW(year);
		const isDecade = (year % 10 === 0);
		const isCurrentYear = (year === currentYear);

		if (isCurrentYear) {
			svgEl('rect', {
				x: xCursor, y: 0, width: colW, height: totalH,
				fill: '#d3e5ef', opacity: '0.6',
			}, svg);
		}

		let bw = L.monthBorderW;
		let bc = COLORS.cellLine;
		if (isDecade) { bw = L.yearBorderW; bc = '#81D8D0'; }

		svgEl('line', {
			x1: xCursor, y1: 0, x2: xCursor, y2: totalH,
			'stroke-width': bw, stroke: bc,
		}, svg);

		_yearLabels.push({ x: xCursor + colW / 2, year, isCurrentYear });

		xCursor += colW;
	}

	// ── Decade labels (show on page containing the decade's midpoint) ──
	const firstDecade = Math.floor(startYear / 10) * 10;
	for (let d = firstDecade; d <= endYear; d += 10) {
		const mid = d + 5; // midpoint of the decade
		if (mid < startYear || mid > endYear) continue; // this page doesn't have the majority
		const dStart = Math.max(d, startYear);
		const dEnd = Math.min(d + 9, endYear);
		const x0 = xYearsStart + yearsWidth(startYear, dStart - 1);
		const x1 = xYearsStart + yearsWidth(startYear, dEnd);
		const cx = (x0 + x1) / 2;
		const name = I18N[_currentLang].decades[d] || (d + 'S');
		svgEl('text', {
			x: cx, y: r0H - 4,
			'font-size': '28', 'text-anchor': 'middle',
			class: 'decade-label',
		}, svg).textContent = name;
	}

	// Right border
	svgEl('line', {
		x1: xYearsEnd, y1: 0, x2: xYearsEnd, y2: totalH,
		'stroke-width': '0.75', stroke: COLORS.ink,
	}, svg);

	// ── Horizontal grid lines (content start → years end) ──
	let pathHoriz = '';
	for (let ri = 0; ri <= emptyRows; ri++) {
		const lineY = yGantt + ri * ganttRowH;
		pathHoriz += `M${xContentStart} ${lineY}H${xYearsEnd}`;
	}

	if (pathHoriz) svgEl('path', {
		d: pathHoriz, fill: 'none', 'stroke-width': L.monthBorderW, stroke: COLORS.cellLine,
	}, svg);

	// ── Year numbers (rendered after grid lines so they appear on top) ──
	for (const yl of _yearLabels) {
		const ya = {
			x: yl.x, 'font-size': '12', 'text-anchor': 'middle',
			'font-weight': '300', class: 'year-num',
			fill: yl.isCurrentYear ? COLORS.ink : undefined,
		};
		svgEl('text', { ...ya, y: r0H + r1H - 3 }, svg).textContent = yl.year;
		const midY = headerH + (totalH - headerH) / 2;
		svgEl('text', { ...ya, y: midY + 4 }, svg).textContent = yl.year;
		svgEl('text', { ...ya, y: totalH - 3 }, svg).textContent = yl.year;
	}



	// ── Life milestones (dual lines: ♀ purple above, ♂ blue below) ──
	if (_showMilestones) {
		const cmUp = 20 * MM;
		const rowGap = 80; // vertical gap between female and male lines
		const baseMsY = yGantt + (emptyRows - 0.5) * ganttRowH - cmUp;
		const msYF = baseMsY - rowGap / 2; // female line (above)
		const msYM = baseMsY + rowGap / 2; // male line (below)


		// Render helper for one gender line (below=true → icons under line)
		const renderLine = (milestones, msY, color, iconColor, labelColor, below, gender) => {
			const msItems = [];
			const barItems = [];
			// Add birth year dot (age 0)
			if (_globalBirthYear >= startYear && _globalBirthYear <= endYear) {
				const bx = xYearsStart + yearsWidth(startYear, _globalBirthYear - 1) + yearW(_globalBirthYear) / 2;
				msItems.push({ age: 0, en: '', ru: '', mYear: _globalBirthYear, mx: bx, isBirth: true });
			}
			for (const m of milestones) {
				if (m.type === 'bar') {
					// Bar: thick rounded rect from ageStart to ageEnd
					const y1 = _globalBirthYear + m.ageStart;
					const y2 = _globalBirthYear + m.ageEnd;
					const bx1 = Math.max(y1, startYear);
					const bx2 = Math.min(y2, endYear);
					if (bx1 <= endYear && bx2 >= startYear) {
						const x1 = xYearsStart + yearsWidth(startYear, bx1 - 1);
						const x2 = xYearsStart + yearsWidth(startYear, bx2 - 1) + yearW(bx2);
						barItems.push({ ...m, x1, x2 });
					}
					continue;
				}
				const mYear = _globalBirthYear + Math.round(m.age);
				if (mYear < startYear || mYear > endYear) continue;
				const mx = xYearsStart + yearsWidth(startYear, mYear - 1) + yearW(mYear) / 2;
				msItems.push({ ...m, mYear, mx });
			}
			const hasBirthBefore = _globalBirthYear < startYear;
			const getAge = m => m.type === 'bar' ? m.ageStart : Math.round(m.age);
			const getAgeEnd = m => m.type === 'bar' ? m.ageEnd : Math.round(m.age);
			const hasBeforePage = hasBirthBefore || milestones.some(m => (_globalBirthYear + getAge(m)) < startYear);
			const hasAfterPage = milestones.some(m => (_globalBirthYear + getAgeEnd(m)) > endYear);
			const lineX1 = msItems.length > 0 ? msItems[0].mx : (hasBeforePage ? xYearsStart : null);
			const lineX2 = msItems.length > 0 ? msItems[msItems.length - 1].mx : (hasAfterPage ? xYearsEnd : null);
			const extX1 = hasBeforePage ? xYearsStart : lineX1;
			const extX2 = hasAfterPage ? xYearsEnd : lineX2;
			if (extX1 !== null && extX2 !== null) {
				svgEl('line', {
					x1: extX1, y1: msY, x2: extX2, y2: msY,
					'stroke-width': 4, stroke: color, 'stroke-linecap': 'round',
				}, svg);
			}
			// Draw education bars
			const barH = 14;
			for (const b of barItems) {
				svgEl('rect', {
					x: b.x1, y: msY - barH / 2, width: b.x2 - b.x1, height: barH,
					rx: barH / 2, ry: barH / 2, fill: color, opacity: 0.5,
				}, svg);
				// Bar label (centered)
				const barCx = (b.x1 + b.x2) / 2;
				const barLabelY = below ? msY + barH / 2 + 16 : msY - barH / 2 - 6;
				svgEl('text', {
					x: barCx, y: barLabelY,
					'font-size': '10', 'text-anchor': 'middle',
					'font-weight': '300',
					style: 'fill: #C4A8D8',
				}, svg).textContent = _currentLang === 'RU' ? b.ru : b.en;
			}
			for (const mi of msItems) {
				if (mi.isBirth) {
					svgEl('circle', { cx: mi.mx, cy: msY, r: 6, fill: color }, svg);
					// Draw head silhouette to the left of birth dot
					const g = document.createElementNS(SVG_NS, 'g');
					g.setAttribute('transform', `translate(${mi.mx - 28},${msY}) scale(0.9)`);
					const sp = (d, filled) => {
						const p = document.createElementNS(SVG_NS, 'path');
						p.setAttribute('d', d);
						p.setAttribute('fill', filled ? iconColor : 'none');
						p.setAttribute('stroke', iconColor);
						p.setAttribute('stroke-width', '2');
						p.setAttribute('stroke-linecap', 'round');
						p.setAttribute('stroke-linejoin', 'round');
						g.appendChild(p);
					};
					if (gender === 'f') {
						// Woman head: round face + long hair flowing
						const el = document.createElementNS(SVG_NS, 'circle');
						el.setAttribute('cx', 0); el.setAttribute('cy', -4); el.setAttribute('r', 8);
						el.setAttribute('fill', 'none'); el.setAttribute('stroke', iconColor); el.setAttribute('stroke-width', '2');
						g.appendChild(el);
						// Hair
						sp('M-8 -6 C-10 -14 -4 -18 0 -16 C4 -18 10 -14 8 -6');
						sp('M-8 -4 C-12 0 -12 8 -8 12');
					} else {
						// Man head: round face + short flat hair
						const el = document.createElementNS(SVG_NS, 'circle');
						el.setAttribute('cx', 0); el.setAttribute('cy', -2); el.setAttribute('r', 8);
						el.setAttribute('fill', 'none'); el.setAttribute('stroke', iconColor); el.setAttribute('stroke-width', '2');
						g.appendChild(el);
						// Short hair
						sp('M-8 -4 C-8 -14 8 -14 8 -4');
					}
					svg.appendChild(g);
				} else {
					svgEl('circle', { cx: mi.mx, cy: msY, r: 10, fill: color }, svg);
				}
			}
			const iconY = below ? msY + 30 : msY - 35;
			const labelY = below ? msY + 78 : msY + 28;
			// SVG icon paths (centered at 0,0, scale ~24px)
			const drawIcon = (cx, cy, iconKey, iconColor) => {
				const g = document.createElementNS(SVG_NS, 'g');
				g.setAttribute('transform', `translate(${cx},${cy}) scale(1.2)`);
				const s = (d, extra) => {
					const p = document.createElementNS(SVG_NS, 'path');
					p.setAttribute('d', d);
					p.setAttribute('fill', 'none');
					p.setAttribute('stroke', iconColor);
					p.setAttribute('stroke-width', '2');
					p.setAttribute('stroke-linecap', 'round');
					p.setAttribute('stroke-linejoin', 'round');
					if (extra) Object.entries(extra).forEach(([k, v]) => p.setAttribute(k, v));
					g.appendChild(p);
				};
				const c = (cx2, cy2, r) => {
					const el = document.createElementNS(SVG_NS, 'circle');
					el.setAttribute('cx', cx2); el.setAttribute('cy', cy2); el.setAttribute('r', r);
					el.setAttribute('fill', 'none'); el.setAttribute('stroke', iconColor); el.setAttribute('stroke-width', '2');
					g.appendChild(el);
				};
				switch (iconKey) {
					case 'school': // graduation cap
						s('M-12 2 L0 -6 L12 2 L0 10 Z');
						s('M0 10 L0 16');
						s('M8 5 L8 12');
						break;
					case 'job': // briefcase
						s('M-12 -2 L12 -2 L12 12 L-12 12 Z');
						s('M-4 -2 L-4 -6 L4 -6 L4 -2');
						s('M-12 4 L12 4');
						break;
					case 'home': // house
						s('M-12 4 L0 -8 L12 4');
						s('M-8 4 L-8 14 L8 14 L8 4');
						s('M-2 14 L-2 8 L2 8 L2 14');
						break;
					case 'child': // baby figure
						c(0, -6, 5);
						s('M0 -1 L0 8');
						s('M-6 3 L6 3');
						s('M0 8 L-5 14');
						s('M0 8 L5 14');
						break;
					case 'retire': // sun
						c(0, 2, 6);
						s('M0 -8 L0 -10'); s('M0 12 L0 14');
						s('M-8 -4 L-10 -6'); s('M8 8 L10 10');
						s('M-8 8 L-10 10'); s('M8 -4 L10 -6');
						s('M-10 2 L-12 2'); s('M10 2 L12 2');
						break;
				}
				svg.appendChild(g);
			};
			for (const mi of msItems) {
				if (mi.isBirth) continue;
				drawIcon(mi.mx, iconY, mi.svgKey, iconColor);
				if (!below) {
					const label = _currentLang === 'RU' ? mi.ru : mi.en;
					const anchor = mi.labelAlign || 'middle';
					const lines = label.split('\n');
					const txt = svgEl('text', {
						x: mi.mx, y: labelY,
						'font-size': '12', 'text-anchor': anchor,
						'font-weight': '300',
						style: 'fill: #C4A8D8',
					}, svg);
					lines.forEach((line, i) => {
						const ts = document.createElementNS(SVG_NS, 'tspan');
						ts.setAttribute('x', mi.mx);
						ts.setAttribute('dy', i === 0 ? '0' : '14');
						ts.setAttribute('style', 'fill: #C4A8D8');
						ts.textContent = line;
						txt.appendChild(ts);
					});
				}
			}
		};

		// ♀ Female (tiffany, above — icons below line)
		renderLine(MILESTONES_F, msYF, '#81D8D0', '#B5EBE7', '#5FBFB7', true, 'f');
		// ♂ Male (purple, below — icons above line)
		renderLine(MILESTONES_M, msYM, '#C4A8D8', '#DBC8EB', '#9B7DB8', false, 'm');
	}

	// ── Custom entry labels ──
	for (const e of customEntries) {
		if (e.type === 'bar') continue; // bars drawn separately
		if (e.row < 1 || e.row > emptyRows) continue;
		for (let y = startYear; y <= endYear; y++) {
			if (e.yearly ? y < e.year : y !== e.year) continue;
			const ex = xYearsStart + yearsWidth(startYear, y - 1);
			const ey = yGantt + (e.row - 1) * ganttRowH + ganttRowH / 2;
			svgEl('text', {
				x: ex + 2, y: ey + 3,
				'font-size': '7', 'text-anchor': 'start',
				'font-weight': '400', fill: COLORS.ink,
			}, svg).textContent = e.text;
		}
	}

	// ── Custom bar ranges ──
	let barIdx = 0;
	for (const e of customEntries) {
		if (e.type !== 'bar') continue;
		const y1 = Math.max(e.yearStart, startYear);
		const y2 = Math.min(e.yearEnd, endYear);
		if (y1 > endYear || y2 < startYear) continue;
		const x1 = xYearsStart + yearsWidth(startYear, y1 - 1);
		const x2 = xYearsStart + yearsWidth(startYear, y2);
		const barH = e.row ? ganttRowH - 2 : 16;
		let barY;
		if (e.row && e.row >= 1 && e.row <= emptyRows) {
			barY = yGantt + (e.row - 1) * ganttRowH + 1;
		} else {
			barY = yGantt + emptyRows * ganttRowH + 6 + barIdx * (barH + 6);
			barIdx++;
		}
		svgEl('rect', {
			x: x1, y: barY, width: x2 - x1, height: barH,
			rx: barH / 2, ry: barH / 2, fill: e.color, opacity: 0.6,
		}, svg);
		const cx = (x1 + x2) / 2;
		svgEl('text', {
			x: cx, y: barY + barH / 2 + 3.5,
			'font-size': '9', 'text-anchor': 'middle',
			'font-weight': '500',
			style: `fill: ${COLORS.ink}`,
		}, svg).textContent = e.text;
	}

	svg._calW = pageW;
	svg._calH = totalH;
	return svg;
}

// ─── Duration helpers ───
function _syncDialsFromTotal() {
	const curYear = new Date().getFullYear();
	const startYear = parseInt(document.getElementById('tb-val-yr').value) || (curYear - 30);
	const endYear = parseInt(document.getElementById('tb-val-mo').value) || (curYear + 10);
	const past = curYear - startYear;
	const future = endYear - curYear;
	document.getElementById('months-input').value = past + future;
}

function _totalFromDials() {
	const curYear = new Date().getFullYear();
	const startYear = parseInt(document.getElementById('tb-val-yr').value) || (curYear - 30);
	const endYear = parseInt(document.getElementById('tb-val-mo').value) || (curYear + 10);
	return (curYear - startYear) + (endYear - curYear);
}

// ─── Page building (year-based) ───
let _cachedPages = [];
let _cachedRollW = 0;
function buildPages() {
	const rows = parseInt(document.getElementById('rows-slider').value) || 10;
	const clampedRows = Math.max(6, Math.min(14, rows));

	const curYearNow = new Date().getFullYear();
	const startYearVal = parseInt(document.getElementById('tb-val-yr').value) || (curYearNow - 30);
	const endYearVal = parseInt(document.getElementById('tb-val-mo').value) || (curYearNow + 10);
	const past = curYearNow - startYearVal;
	const future = endYearVal - curYearNow;
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - past;
	const endYear = currentYear + future;
	_globalBirthYear = startYear;

	const MARGIN_MM = 7;
	const MM = 96 / 25.4;
	const PAST_W_MM = currentColW_MM;
	const FUTURE_W_MM = Math.max(currentColW_MM, 20);

	// Years per page for past (10mm) and future (FUTURE_W_MM)
	let yppPast, yppFuture;
	if (currentPaper.w !== null) {
		const printW_mm = currentPaper.w - 2 * MARGIN_MM;
		yppPast = Math.floor(printW_mm / PAST_W_MM);
		yppFuture = Math.floor(printW_mm / FUTURE_W_MM);
	} else {
		// Roll paper: everything on one page
		yppPast = 999;
		yppFuture = 999;
	}
	yppPast = Math.max(1, yppPast);
	yppFuture = Math.max(1, yppFuture);

	const pastYears = currentYear - startYear + 1;
	const futureCount = endYear - currentYear;

	// Compute total width of all years for this page size
	const allYearsW_MM = pastYears * PAST_W_MM + futureCount * FUTURE_W_MM;

	// Page width
	let pageW;
	if (currentPaper.w !== null) {
		pageW = Math.max(yppPast * PAST_W_MM, yppFuture * FUTURE_W_MM) * MM;
	} else {
		// Roll: single continuous page, width = all years
		pageW = allYearsW_MM * MM;
	}

	let totalH;
	if (currentPaper.w !== null) {
		const copies = currentPaper.copies || 1;
		const copyH_mm = currentPaper.h / copies;
		const printH_mm = copyH_mm - 2 * MARGIN_MM;
		const printW_mm = currentPaper.w - 2 * MARGIN_MM;
		totalH = pageW * printH_mm / printW_mm;
	} else {
		// Roll: SVG height = printable height so calendarScale = 1 → year = 10mm
		const copies = currentPaper.copies || 1;
		const copyH_mm = currentPaper.h / copies;
		const printH_mm = copyH_mm - 2 * MARGIN_MM;
		totalH = printH_mm * MM;
	}

	const cal = document.getElementById('calendar');
	cal.style.position = 'relative';
	cal.innerHTML = '';

	const pageRanges = [];

	if (currentPaper.w === null) {
		// Roll paper: single continuous page
		pageRanges.push({
			start: startYear, end: endYear,
			alignRight: false, hasLegend: true,
		});
	} else {
		// Past pages: all 10mm, fill from right, leftmost page gets legend
		if (pastYears > 0) {
			const pastPages = [];
			let remaining = pastYears;
			let cursor = currentYear;

			while (remaining > yppPast) {
				pastPages.unshift({
					start: cursor - yppPast + 1, end: cursor,
					alignRight: true, hasLegend: false,
				});
				cursor -= yppPast;
				remaining -= yppPast;
			}

			pastPages.unshift({
				start: cursor - remaining + 1, end: cursor,
				alignRight: true, hasLegend: true,
			});

			pageRanges.push(...pastPages);
		}

		// Future pages: left-aligned
		if (futureCount > 0) {
			let cursor = currentYear + 1;
			let rem = futureCount;
			while (rem > 0) {
				const count = Math.min(yppFuture, rem);
				pageRanges.push({
					start: cursor, end: cursor + count - 1,
					alignRight: false, hasLegend: false,
				});
				cursor += count;
				rem -= count;
			}
		}
	}

	for (let p = 0; p < pageRanges.length; p++) {
		const pr = pageRanges[p];
		const svg = generateCalendarSVG(pr.start, pr.end, clampedRows, pageW, totalH, pr.alignRight, pr.hasLegend);
		svg.classList.add('cal-page');
		svg.dataset.page = p;
		cal.appendChild(svg);

		const copies = currentPaper.copies || 1;
		for (let c = 1; c < copies; c++) {
			const clone = svg.cloneNode(true);
			clone.classList.add('cal-page', 'cal-copy');
			clone.dataset.page = p;
			clone.dataset.copy = c;
			cal.appendChild(clone);
		}
	}

	_cachedPages = Array.from(cal.querySelectorAll('.cal-page'));
	_cachedRollW = 0;
	totalPages = pageRanges.length;

	// Update dial tooltips with page counts
	const pastPageCount = pageRanges.filter(p => p.alignRight).length;
	const futurePageCount = pageRanges.filter(p => !p.alignRight).length;
	const yrDial = document.getElementById('tb-dial-yr');
	const moDial = document.getElementById('tb-dial-mo');
	if (yrDial) yrDial.setAttribute('data-tooltip', `${t('hindsight')} · ${pastPageCount} ${t('pages')}`);
	if (moDial) moDial.setAttribute('data-tooltip', `${t('foresight')} · ${futurePageCount} ${t('pages')}`);

	autoFitViewport();

	// ── Sticky note (created once, positioned in applyViewport) ──
	_ensureStickyNote();
}

function _ensureStickyNote() {
	let note = document.getElementById('sticky-note');
	if (!note) {
		note = document.createElement('div');
		note.id = 'sticky-note';
		Object.assign(note.style, {
			position: 'fixed', zIndex: '1001',
			width: '189px', minHeight: '189px',
			background: '#c6e8e5', padding: '12px 10px 8px',
			boxShadow: '2px 3px 8px rgba(0,0,0,0.12)',
			fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px',
			lineHeight: '1.45', color: '#37352f',
			borderBottom: '3px solid #a8d8d3',
			cursor: 'grab', userSelect: 'none',
			transformOrigin: 'top left',
		});
		// Paper-relative position (in mm from paper origin)
		note._paperX = -60; // left of paper
		note._paperY = 10;
		// Drag (mouse + touch) — converts screen coords to paper coords
		let dragging = false, dx, dy;
		function startDrag(cx, cy) {
			dragging = true;
			const step = viewport.zoom * MM_PX;
			dx = cx - (viewport.left + note._paperX * step);
			dy = cy - (viewport.top + note._paperY * step);
			note.style.cursor = 'grabbing';
		}
		function moveDrag(cx, cy) {
			if (!dragging) return;
			const step = viewport.zoom * MM_PX;
			note._paperX = (cx - dx - viewport.left) / step;
			note._paperY = (cy - dy - viewport.top) / step;
			_positionStickyNote(note);
		}
		function endDrag() {
			if (dragging) { dragging = false; note.style.cursor = 'grab'; }
		}
		note.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); startDrag(e.clientX, e.clientY); });
		document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
		document.addEventListener('mouseup', endDrag);
		note.addEventListener('touchstart', e => { e.stopPropagation(); const t = e.touches[0]; startDrag(t.clientX, t.clientY); }, { passive: true });
		document.addEventListener('touchmove', e => { if (!dragging) return; const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }, { passive: true });
		document.addEventListener('touchend', endDrag);
		document.body.appendChild(note);
	}
	// Update content (language may have changed)
	note.innerHTML = t('sticky').map(l => `<div>${l}</div>`).join('');
	_positionStickyNote(note);
}

function _positionStickyNote(note) {
	if (!note) note = document.getElementById('sticky-note');
	if (!note) return;
	const step = viewport.zoom * MM_PX;
	const sx = viewport.left + note._paperX * step;
	const sy = viewport.top + note._paperY * step;
	note.style.left = sx + 'px';
	note.style.top = sy + 'px';
	note.style.transform = `scale(${viewport.zoom})`;
}

function toggleLang() {
	_currentLang = _currentLang === 'RU' ? 'EN' : 'RU';
	const btn = document.getElementById('lang-toggle');
	if (btn) btn.textContent = _currentLang;
	const mobBtn = document.getElementById('mob-lang-btn');
	if (mobBtn) mobBtn.textContent = _currentLang;
	_applyTranslations();
	updateCalendar();
}

function _applyTranslations() {
	// Tooltips
	const svgBtn = document.querySelector('[data-tooltip*="SVG"]');
	const pdfBtn = document.querySelector('[data-tooltip*="PDF"]');
	const entryBtn = document.getElementById('entry-btn');
	const langBtn = document.getElementById('lang-toggle');
	if (svgBtn) svgBtn.setAttribute('data-tooltip', t('downloadSvg'));
	if (pdfBtn) pdfBtn.setAttribute('data-tooltip', t('downloadPdf'));
	if (entryBtn) entryBtn.setAttribute('data-tooltip', t('addEntryTip'));
	if (langBtn) langBtn.setAttribute('data-tooltip', t('language'));

	// Year inputs (wrapper divs for ::after tooltip)
	const wrapYr = document.getElementById('wrap-yr');
	const wrapMo = document.getElementById('wrap-mo');
	if (wrapYr) wrapYr.setAttribute('data-tooltip', t('hindsight'));
	if (wrapMo) wrapMo.setAttribute('data-tooltip', t('foresight'));

	// Toggles
	const paperToggle = document.getElementById('paper-toggle');
	const colWToggle = document.getElementById('col-w-toggle');
	const rowsToggle = document.getElementById('rows-toggle');
	if (paperToggle) paperToggle.setAttribute('data-tooltip', t('paperFormat'));
	if (colWToggle) colWToggle.setAttribute('data-tooltip', t('columnWidth'));
	if (rowsToggle) rowsToggle.setAttribute('data-tooltip', t('ganttRows'));

	// Entry modal
	const modalTitle = document.querySelector('#entry-overlay .confirm-msg');
	const addBtn = document.querySelector('#entry-overlay .confirm-yes');
	const cancelBtns = document.querySelectorAll('.confirm-cancel');
	if (modalTitle) modalTitle.textContent = t('addEntry');
	if (addBtn) addBtn.textContent = t('add');
	cancelBtns.forEach(b => b.textContent = t('cancel'));



	// Confirm modal
	const confirmYes = document.getElementById('confirm-yes');
	if (confirmYes) confirmYes.textContent = t('yes');

	// Mobile UI
	const mobHind = document.getElementById('mob-label-hindsight');
	const mobFore = document.getElementById('mob-label-foresight');
	if (mobHind) mobHind.textContent = t('hindsight');
	if (mobFore) mobFore.textContent = t('foresight');
	const mobLabels = document.querySelectorAll('.mob-sheet-label:not(#mob-label-hindsight):not(#mob-label-foresight)');
	if (mobLabels[0]) mobLabels[0].textContent = t('paperFormat');
	if (mobLabels[1]) mobLabels[1].textContent = t('ganttRows');
}

// ─── Init ───
function init() {
	const params = new URLSearchParams(window.location.search);
	const past = parseInt(params.get('p')) || 35;
	const future = parseInt(params.get('f')) || 25;
	let emptyRows = parseInt(params.get('g')) || 10;
	_showMilestones = params.get('m') === '1';

	if (emptyRows < 5 || emptyRows > 15) emptyRows = 10;

	const curYear = new Date().getFullYear();
	const yrEl = document.getElementById('tb-val-yr');
	const moEl = document.getElementById('tb-val-mo');
	const rowsSlider = document.getElementById('rows-slider');
	const rowsValue = document.getElementById('rows-value');

	if (yrEl) yrEl.value = curYear - past;
	if (moEl) moEl.value = curYear + future;
	document.getElementById('months-input').value = past + future;
	_syncYearDisplay();

	if (rowsSlider) rowsSlider.value = emptyRows;
	if (rowsValue) rowsValue.textContent = emptyRows;

	buildPages();
	_ui.sizeChips = Array.from(document.querySelectorAll('.tb-btn[data-size], .pm-item[data-size]'));
	_ui.rowsChips = Array.from(document.querySelectorAll('.rows-chip[data-rows], .mob-chip-opt[data-rows]'));
	_ui.mobSizeChips = Array.from(document.querySelectorAll('.mob-chip-opt[data-size]'));
	_ui.sizeChips.forEach(b => {
		b.classList.toggle('active', b.dataset.size === currentPaperKey);
	});
	_syncMobileUI();
	const _mbtn = document.getElementById('milestone-btn');
	if (_mbtn) _mbtn.classList.toggle('active', _showMilestones);
	const _mmbtn = document.getElementById('mob-milestone-btn');
	if (_mmbtn) _mmbtn.classList.toggle('active', _showMilestones);
}

function updateCalendar() {
	const curYear = new Date().getFullYear();
	const startYear = parseInt(document.getElementById('tb-val-yr').value) || (curYear - 30);
	const endYear = parseInt(document.getElementById('tb-val-mo').value) || (curYear + 10);
	const past = curYear - startYear;
	const future = endYear - curYear;
	const url = new URL(window.location);
	url.searchParams.set('p', past);
	url.searchParams.set('f', future);
	url.searchParams.set('g', parseInt(document.getElementById('rows-slider').value) || 10);
	if (_showMilestones) url.searchParams.set('m', '1'); else url.searchParams.delete('m');
	window.history.replaceState({}, '', url);
	buildPages();
}

function toggleMilestones() {
	_showMilestones = !_showMilestones;
	if (typeof gtag === 'function') gtag('event', 'toggle_milestones', { on: _showMilestones });
	const btn = document.getElementById('milestone-btn');
	if (btn) btn.classList.toggle('active', _showMilestones);
	const mobBtn = document.getElementById('mob-milestone-btn');
	if (mobBtn) mobBtn.classList.toggle('active', _showMilestones);
	updateCalendar();
}

function toggleRowsSlider() {
	const slider = document.getElementById('rows-slider');
	slider.style.display = slider.style.display === 'none' ? '' : 'none';
}

let _rowsTimer;
function onRowsSlider(val) {
	document.getElementById('rows-value').textContent = val;
	const mobRows = document.getElementById('mob-rows');
	if (mobRows) mobRows.textContent = val;
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === parseInt(val));
	});
	clearTimeout(_rowsTimer);
	_rowsTimer = setTimeout(updateCalendar, 80);
}

function setRows(val) {
	document.getElementById('rows-slider').value = val;
	document.getElementById('rows-value').textContent = val;
	const mobRows = document.getElementById('mob-rows');
	if (mobRows) mobRows.textContent = val;
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === val);
	});
	clearTimeout(_rowsTimer);
	_rowsTimer = setTimeout(updateCalendar, 80);
}

// ─── Viewport state ───
const MM_PX = 96 / 25.4;
const RULER_W = 20;

const viewport = {
	left: 10 * MM_PX,
	top: 10 * MM_PX,
	zoom: 1,
};

const PAPER_SIZES = {
	a4: { w: 297, h: 210 },
	a3: { w: 420, h: 297 },
	'914mm': { w: null, h: 914 },
	'914x2': { w: null, h: 914, copies: 2 },
	'914x4': { w: null, h: 914, copies: 4, copyH: 200 },
};
let currentPaper = PAPER_SIZES.a4;
let currentPaperKey = 'a4';
let totalPages = 1;
let calendarScale = 1;
let currentColW_MM = 10; // 10mm = 1cm default column width

// ─── Cached UI element references (fix: avoid repeated querySelectorAll) ───
const _ui = {
	sizeChips: [],    // .tb-btn[data-size] + .pm-item[data-size]
	rowsChips: [],    // .rows-chip[data-rows] + .mob-chip-opt[data-rows]
	mobSizeChips: [], // .mob-chip-opt[data-size]
};

// ─── Cached DOM pools ───
const _paperPool = [];
const _guidePool = [];

function _getPooledDiv(pool, index, className, parent) {
	if (index < pool.length) {
		pool[index].style.display = '';
		return pool[index];
	}
	const el = document.createElement('div');
	el.className = className;
	parent.appendChild(el);
	pool.push(el);
	return el;
}

function _hidePoolFrom(pool, startIndex) {
	for (let i = startIndex; i < pool.length; i++) {
		pool[i].style.display = 'none';
	}
}

function updatePageInfo() {
	const el = document.getElementById('page-info');
	const curYear = new Date().getFullYear();
	const startYear = parseInt(document.getElementById('tb-val-yr').value) || (curYear - 30);
	const endYear = parseInt(document.getElementById('tb-val-mo').value) || (curYear + 10);
	const pastYears = curYear - startYear + 1;
	const futureYears = endYear - curYear;

	const MARGIN_MM = 7;
	const PAST_W = currentColW_MM;
	const FUTURE_W = Math.max(currentColW_MM, 20);

	function _pagesFor(paper) {
		if (paper.w === null) return 1;
		const printW_mm = paper.w - 2 * MARGIN_MM;
		const yppPast = Math.max(1, Math.floor(printW_mm / PAST_W));
		const yppFuture = Math.max(1, Math.floor(printW_mm / FUTURE_W));
		const pastPages = Math.max(0, Math.ceil(pastYears / yppPast));
		const futurePages = Math.max(0, Math.ceil(futureYears / yppFuture));
		return Math.max(1, pastPages + futurePages);
	}

	function _rollLen(paper) {
		const firstPage = document.querySelector('#calendar .cal-page');
		if (!firstPage) return '';
		const svgW = firstPage._calW || parseFloat(firstPage.getAttribute('width')) || 800;
		const svgH = firstPage._calH || parseFloat(firstPage.getAttribute('height')) || 600;
		const copies = paper.copies || 1;
		const copyH = paper.h / copies;
		const printH = copyH - 2 * MARGIN_MM;
		const scale = (printH * MM_PX) / svgH;
		const paperW_mm = svgW * scale / MM_PX + 2 * MARGIN_MM;
		return (paperW_mm / 1000).toFixed(1) + ' m';
	}

	_ui.sizeChips.forEach(b => {
		const key = b.dataset.size;
		const paper = PAPER_SIZES[key];
		if (!paper) return;
		let tip = '';
		if (paper.w !== null) {
			const p = _pagesFor(paper);
			tip = p > 1 ? p + ' pages' : '1 page';
		} else {
			tip = _rollLen(paper);
		}
		b.setAttribute('data-tooltip', tip);
	});

	// Update paper-toggle tooltip with current paper info
	const paperToggle = document.getElementById('paper-toggle');
	if (paperToggle) {
		const paper = PAPER_SIZES[currentPaperKey];
		if (paper) {
			if (paper.w !== null) {
				const p = _pagesFor(paper);
				paperToggle.setAttribute('data-tooltip', p + ' ' + t('pages'));
			} else {
				paperToggle.setAttribute('data-tooltip', _rollLen(paper));
			}
		}
	}

	if (el) el.textContent = '';
}

function setPaperSize(key) {
	currentPaper = PAPER_SIZES[key] || PAPER_SIZES.a4;
	currentPaperKey = key;
	// Desktop toggle button
	const paperToggle = document.getElementById('paper-toggle');
	if (paperToggle) {
		const labels = { a4: 'A4', '914x4': '×4' };
		paperToggle.textContent = labels[key] || key;
	}
	// Highlight desktop top-bar + dropdown
	_ui.sizeChips.forEach(b => {
		b.classList.toggle('active', b.dataset.size === key);
	});
	// Sync mobile UI
	const mobFmt = document.getElementById('mob-format');
	if (mobFmt) {
		const labels = { a4: 'A4', a3: 'A3', '914mm': '914', '914x2': '×2', '914x4': '×4' };
		mobFmt.textContent = labels[key] || key;
	}
	_ui.mobSizeChips.forEach(b => {
		b.classList.toggle('active', b.dataset.size === key);
	});
	updateCalendar();
}

function toggleMobPaper() {
	togglePaper();
}

function togglePaper() {
	const next = currentPaperKey === 'a4' ? '914x4' : 'a4';
	setPaperSize(next);
}

const _colWidths = [10, 15, 20];
const _colLabels = ['1', '1.5', '2'];

function cycleColWidth() {
	const idx = _colWidths.indexOf(currentColW_MM);
	const next = (idx + 1) % _colWidths.length;
	currentColW_MM = _colWidths[next];
	const btn = document.getElementById('col-w-toggle');
	if (btn) btn.textContent = _colLabels[next];
	// sync mobile chips if any
	document.querySelectorAll('.mob-chip-opt[data-colw]').forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.colw) === currentColW_MM);
	});
	updateCalendar();
}

// Keep for mobile chip clicks
function setColWidth(mm) {
	currentColW_MM = mm;
	const idx = _colWidths.indexOf(mm);
	const btn = document.getElementById('col-w-toggle');
	if (btn && idx >= 0) btn.textContent = _colLabels[idx];
	document.querySelectorAll('.col-w-btn, .mob-chip-opt[data-colw]').forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.colw) === mm);
	});
	updateCalendar();
}

function toggleRows() {
	const slider = document.getElementById('rows-slider');
	const cur = parseInt(slider.value) || 10;
	const next = cur === 10 ? 14 : 10;
	slider.value = next;
	document.getElementById('rows-value').textContent = next;
	const toggle = document.getElementById('rows-toggle');
	if (toggle) toggle.textContent = next;
	const mobRows = document.getElementById('mob-rows');
	if (mobRows) mobRows.textContent = next;
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === next);
	});
	clearTimeout(_rowsTimer);
	_rowsTimer = setTimeout(updateCalendar, 80);
}

function togglePrintMenu() {
	const menu = document.getElementById('print-menu');
	const isOpen = menu.style.display !== 'none';
	menu.style.display = isOpen ? 'none' : '';
	if (!isOpen) {
		setTimeout(() => {
			document.addEventListener('click', function closePM(e) {
				if (!e.target.closest('.print-group')) {
					menu.style.display = 'none';
					document.removeEventListener('click', closePM);
				}
			});
		}, 0);
	}
}

// ─── Viewport ───
function autoFitViewport() {
	const cal = document.getElementById('calendar');
	const firstPage = cal.querySelector('.cal-page');
	if (!firstPage) return;

	// SVG has intrinsic dimensions via viewBox
	const svgW = firstPage._calW || parseFloat(firstPage.getAttribute('width')) || 800;
	const svgH = firstPage._calH || parseFloat(firstPage.getAttribute('height')) || 600;

	// 1) calendarScale: fit SVG content into printable area
	const MARGIN_MM = 7;
	const copies = currentPaper.copies || 1;
	const copyH = currentPaper.h / copies;
	const printH = copyH - 2 * MARGIN_MM;
	const printW = currentPaper.w !== null ? currentPaper.w - 2 * MARGIN_MM : Infinity;

	// Scale to fit height (primary constraint)
	const scaleH = (printH * MM_PX) / svgH;
	const scaleW = currentPaper.w !== null ? (printW * MM_PX) / svgW : Infinity;
	calendarScale = Math.min(scaleH, scaleW);

	// 2) viewport.zoom: fit the paper on screen
	const isMobile = window.innerWidth < 768;
	const screenMargin = 10 * MM_PX;
	const rulerGap = isMobile ? 0 : RULER_W + 3 * MM_PX;
	const availableH = window.innerHeight - rulerGap;

	if (isMobile) {
		// Mobile: zoom to fit sticky note + paper width on screen
		const stickyW_MM = 60; // sticky note is at paperX = -60mm
		const contentW_MM = stickyW_MM + (currentPaper.w || 297);
		const mobBarH = 60; // bottom bar height approx
		const availW = window.innerWidth - 20; // 10px padding each side
		const availH = window.innerHeight - mobBarH - 20;
		const scaleW = availW / (contentW_MM * MM_PX);
		const scaleH = availH / (currentPaper.h * MM_PX);
		viewport.zoom = Math.min(scaleW, scaleH, 1);

		const step = viewport.zoom * MM_PX;
		// Center horizontally: content starts at -60mm (sticky note)
		viewport.left = 10 + (availW - contentW_MM * step) / 2 + stickyW_MM * step;
		// Center vertically in available space (above mob-bar)
		const paperScreenH = currentPaper.h * step;
		viewport.top = (availH - paperScreenH) / 2 + 10;
	} else {
		const scaleScreen = (availableH - screenMargin) / (currentPaper.h * MM_PX);
		viewport.zoom = Math.min(scaleScreen, 1);

		const paperScreenH = currentPaper.h * viewport.zoom * MM_PX;
		viewport.top = (availableH - paperScreenH) / 2;

		if (currentPaper.w !== null) {
			const paperScreenW = currentPaper.w * viewport.zoom * MM_PX;
			const leftGap = RULER_W;
			viewport.left = leftGap + (window.innerWidth - leftGap - paperScreenW) / 2;
		} else {
			viewport.left = RULER_W + screenMargin;
		}
	}

	applyViewport();
	updatePageInfo();
}

function applyViewport() {
	const step = viewport.zoom * MM_PX;
	const marginPx = 7 * step;

	const originScreenX = viewport.left;
	const paperTopY = viewport.top;
	let paperW;
	if (currentPaper.w !== null) {
		paperW = currentPaper.w * step;
	} else {
		paperW = window.innerWidth * 2;
	}
	const paperH = currentPaper.h * step;
	const pageGap = 20;

	// Paper sheet
	const paper = document.getElementById('paper-sheet');
	paper.style.left = originScreenX + 'px';
	paper.style.top = paperTopY + 'px';
	paper.style.width = paperW + 'px';
	paper.style.height = paperH + 'px';

	// Extra paper sheets for multi-page
	for (let p = 1; p < totalPages; p++) {
		const extra = _getPooledDiv(_paperPool, p - 1, 'paper-sheet-extra', document.body);
		extra.style.position = 'fixed';
		extra.style.zIndex = '1';
		extra.style.background = '#ffffff';
		extra.style.borderRadius = '8px';
		extra.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';
		extra.style.pointerEvents = 'none';
		extra.style.left = (originScreenX + p * (paperW + pageGap)) + 'px';
		extra.style.top = paperTopY + 'px';
		extra.style.width = paperW + 'px';
		extra.style.height = paperH + 'px';
	}
	_hidePoolFrom(_paperPool, Math.max(0, totalPages - 1));

	const paperBottomY = paperTopY + paperH;
	const totalScale = calendarScale * viewport.zoom;

	// Position SVG pages
	const cal = document.getElementById('calendar');
	cal.style.position = 'fixed';

	const pages = _cachedPages;
	const copies = currentPaper.copies || 1;
	const copyH_px = (currentPaper.h / copies) * step;
	pages.forEach((page) => {
		const pageIdx = parseInt(page.dataset.page) || 0;
		const copyIdx = parseInt(page.dataset.copy) || 0;
		page.style.position = 'fixed';
		page.style.left = (originScreenX + marginPx + pageIdx * (paperW + pageGap)) + 'px';
		page.style.top = (paperTopY + marginPx + copyIdx * copyH_px) + 'px';
		page.style.transformOrigin = 'top left';
		page.style.transform = `scale(${totalScale})`;
	});

	// Trim roll paper (cached to avoid layout thrashing on pan/zoom)
	if (currentPaper.w === null) {
		if (!_cachedRollW) {
			const firstPage = _cachedPages[0];
			if (firstPage) {
				void firstPage.offsetHeight;
				_cachedRollW = firstPage.getBoundingClientRect().width / (calendarScale * viewport.zoom);
			}
		}
		if (_cachedRollW) {
			const trimMargin = 20 * step;
			paperW = _cachedRollW * calendarScale * viewport.zoom + 2 * marginPx + trimMargin;
			paper.style.width = paperW + 'px';
		}
	}

	// Guides — per-page printable area rectangles (no tails)
	document.getElementById('guide-h').style.display = 'none';
	document.getElementById('guide-v').style.display = 'none';
	document.getElementById('guide-h-a4').style.display = 'none';
	document.getElementById('guide-v-a4').style.display = 'none';

	const guideTopY = paperTopY + marginPx;
	const guideBotY = paperBottomY - marginPx;
	const guideH = guideBotY - guideTopY;

	let guideIdx = 0;
	for (let p = 0; p < totalPages; p++) {
		const pageLeft = originScreenX + p * (paperW + pageGap);
		const gLeft = pageLeft + marginPx;
		const gRight = currentPaper.w !== null ? pageLeft + paperW - marginPx : pageLeft + paperW;
		const gWidth = gRight - gLeft;

		// Top edge
		const gT = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-h guide-page-rect', document.body);
		gT.style.top = guideTopY + 'px';
		gT.style.left = gLeft + 'px';
		gT.style.width = gWidth + 'px';
		gT.style.height = '0';

		// Bottom edge
		const gB = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-h guide-page-rect', document.body);
		gB.style.top = guideBotY + 'px';
		gB.style.left = gLeft + 'px';
		gB.style.width = gWidth + 'px';
		gB.style.height = '0';

		// Left edge
		const gL = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-v guide-page-rect', document.body);
		gL.style.left = gLeft + 'px';
		gL.style.top = guideTopY + 'px';
		gL.style.height = guideH + 'px';
		gL.style.width = '0';

		// Right edge (only for fixed-width paper)
		if (currentPaper.w !== null) {
			const gR = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-v guide-page-rect', document.body);
			gR.style.left = gRight + 'px';
			gR.style.top = guideTopY + 'px';
			gR.style.height = guideH + 'px';
			gR.style.width = '0';
		}
	}
	_hidePoolFrom(_guidePool, guideIdx);

	// Hide margin guides
	document.getElementById('guide-margin-bottom').style.display = 'none';
	document.getElementById('guide-margin-top').style.display = 'none';
	document.getElementById('guide-margin-left').style.display = 'none';
	document.getElementById('guide-margin-right').style.display = 'none';

	// Gantt panel position
	const designPanel = document.getElementById('gantt-panel');
	if (designPanel && !designPanel._dragged) {
		const firstPage = document.querySelector('#calendar .cal-page');
		if (firstPage) {
			const pageRect = firstPage.getBoundingClientRect();
			const panelW = designPanel.offsetWidth;
			const panelH = designPanel.offsetHeight;
			designPanel.style.left = (pageRect.left - panelW - 6) + 'px';
			const midY = paperTopY + (paperBottomY - paperTopY) * 0.75 - panelH / 2;
			designPanel.style.top = midY + 'px';
		}
	}

	// Scale and reposition sticky note with zoom
	_positionStickyNote();

	drawRulers();
}

// ─── Rulers ───
let _rulerLeft, _rulerBottom;
function drawRulers() {
	const tickColor = '#d1d1cf';
	const textColor = '#9b9a97';
	const bgColor = '#ffffff';
	const step = viewport.zoom * MM_PX;

	if (!_rulerLeft) _rulerLeft = document.getElementById('ruler-left');
	if (!_rulerBottom) _rulerBottom = document.getElementById('ruler-bottom');

	const cmPx = step * 10;
	const largeMode = cmPx < 8;
	const tickStep = largeMode ? 100 : 1;
	const majorEvery = largeMode ? 1000 : 10;
	const midEvery = largeMode ? 100 : 5;

	const dpr = window.devicePixelRatio || 1;

	// Left ruler (vertical)
	const lCanvas = _rulerLeft;
	const lh = window.innerHeight;
	lCanvas.width = RULER_W * dpr;
	lCanvas.height = lh * dpr;
	lCanvas.style.width = RULER_W + 'px';
	lCanvas.style.height = lh + 'px';
	const lctx = lCanvas.getContext('2d');
	lctx.scale(dpr, dpr);
	lctx.fillStyle = bgColor;
	lctx.fillRect(0, 0, RULER_W, lh);

	const marginStep = 7 * step;
	const paperH = currentPaper.h * step;
	const zeroY = viewport.top + paperH - marginStep;
	const mmTopV = Math.ceil((zeroY) / step);
	const mmBotV = Math.floor((zeroY - lh) / step);
	const mmStartV = Math.floor(mmBotV / tickStep) * tickStep;
	const mmEndV = Math.ceil(mmTopV / tickStep) * tickStep;
	for (let mm = mmStartV; mm <= mmEndV; mm += tickStep) {
		const y = zeroY - mm * step;
		if (y < 0 || y > lh) continue;
		let tickLen;
		if (mm % majorEvery === 0) tickLen = RULER_W;
		else if (mm % midEvery === 0) tickLen = RULER_W * 0.6;
		else tickLen = RULER_W * 0.3;
		lctx.strokeStyle = tickColor;
		lctx.lineWidth = (mm % majorEvery === 0) ? 0.8 : 0.5;
		lctx.beginPath();
		lctx.moveTo(RULER_W - tickLen, y);
		lctx.lineTo(RULER_W, y);
		lctx.stroke();
		if (mm % majorEvery === 0) {
			lctx.fillStyle = textColor;
			lctx.font = '8px IBM Plex Sans, sans-serif';
			lctx.textAlign = 'center';
			const label = largeMode ? (mm / 1000) + 'm' : (mm / 10);
			lctx.fillText(label, 8, y - 2);
		} else if (largeMode && mm % 100 === 0) {
			lctx.fillStyle = textColor;
			lctx.font = '7px IBM Plex Sans, sans-serif';
			lctx.textAlign = 'center';
			lctx.globalAlpha = 0.6;
			lctx.fillText((mm / 10), 8, y - 2);
			lctx.globalAlpha = 1;
		}
	}

	// Bottom ruler (horizontal)
	const bCanvas = _rulerBottom;
	const bw = window.innerWidth;
	bCanvas.width = bw * dpr;
	bCanvas.height = RULER_W * dpr;
	bCanvas.style.width = bw + 'px';
	bCanvas.style.height = RULER_W + 'px';
	const bctx = bCanvas.getContext('2d');
	bctx.scale(dpr, dpr);
	bctx.fillStyle = bgColor;
	bctx.fillRect(0, 0, bw, RULER_W);

	const firstPage = _cachedPages[0];
	const zeroX = firstPage ? firstPage.getBoundingClientRect().left : viewport.left;
	const mmLeft = Math.floor(-zeroX / step);
	const mmRight = Math.ceil((bw - zeroX) / step);
	const mmStartH = Math.floor(mmLeft / tickStep) * tickStep;
	const mmEndH = Math.ceil(mmRight / tickStep) * tickStep;
	for (let mm = mmStartH; mm <= mmEndH; mm += tickStep) {
		const x = zeroX + mm * step;
		if (x < 0 || x > bw) continue;
		let tickLen;
		if (mm % majorEvery === 0) tickLen = RULER_W;
		else if (mm % midEvery === 0) tickLen = RULER_W * 0.6;
		else tickLen = RULER_W * 0.3;
		bctx.strokeStyle = tickColor;
		bctx.lineWidth = (mm % majorEvery === 0) ? 0.8 : 0.5;
		bctx.beginPath();
		bctx.moveTo(x, 0);
		bctx.lineTo(x, tickLen);
		bctx.stroke();
		if (mm % majorEvery === 0) {
			bctx.fillStyle = textColor;
			bctx.font = '8px IBM Plex Sans, sans-serif';
			bctx.textAlign = 'center';
			const label = largeMode ? (mm / 1000) + 'm' : (mm / 10);
			bctx.fillText(label, x, RULER_W - 4);
		} else if (largeMode && mm % 100 === 0) {
			bctx.fillStyle = textColor;
			bctx.font = '7px IBM Plex Sans, sans-serif';
			bctx.textAlign = 'center';
			bctx.globalAlpha = 0.6;
			bctx.fillText((mm / 10), x, RULER_W - 4);
			bctx.globalAlpha = 1;
		}
	}
}

// ─── Hide days toggle ───
function toggleHideDays() {
	hideDays = !hideDays;
	const btn = document.getElementById('hide-days-btn');
	if (btn) btn.classList.toggle('active', hideDays);
	const mobBtn = document.getElementById('mob-hide-days-btn');
	if (mobBtn) mobBtn.classList.toggle('active', hideDays);
	updateCalendar();
}

// ─── Custom entries ───
function openEntryModal() {
	const ta = document.getElementById('entry-text');
	// Pre-fill with existing entries
	ta.value = customEntries.map(e => {
		if (e.type === 'bar') {
			const rowPart = e.row ? `${e.row}, ` : '';
			const colorPart = e.color && e.color !== 'lightblue' ? ', ' + e.color : '';
			return `${rowPart}${e.yearStart}-${e.yearEnd}, ${e.text}${colorPart}`;
		}
		return `${e.row}, ${e.text}, ${e.year}`;
	}).join('\n');
	document.getElementById('entry-overlay').style.display = 'flex';
	setTimeout(() => ta.focus(), 50);
}

function closeEntryModal() {
	document.getElementById('entry-overlay').style.display = 'none';
}

function clearEntries() {
	customEntries = [];
	localStorage.removeItem('lifeline-entries');
	closeEntryModal();
	updateCalendar();
}

function addCustomEntry() {
	const ta = document.getElementById('entry-text');
	const lines = ta.value.split('\n').map(l => l.trim()).filter(Boolean);
	const parsed = [];

	for (const line of lines) {
		// Bar format: [row,] YYYY-YYYY, Text [, color]
		const barMatch = line.match(/^(?:(\d{1,2})\s*,\s*)?(\d{4})\s*-\s*(\d{4})\s*,\s*(.+)/);
		if (barMatch) {
			const row = barMatch[1] ? parseInt(barMatch[1]) : null;
			const yearStart = parseInt(barMatch[2]);
			const yearEnd = parseInt(barMatch[3]);
			const rest = barMatch[4].split(',').map(s => s.trim());
			const text = rest[0];
			const color = rest[1] || 'lightblue';
			if (yearStart && yearEnd && yearEnd >= yearStart && text) {
				if (row && (row < 1 || row > 14)) continue;
				parsed.push({ type: 'bar', row, yearStart, yearEnd, text, color });
			}
			continue;
		}
		// Standard format: row, text, year
		const parts = line.split(',');
		if (parts.length < 3) continue;
		const row = parseInt(parts[0].trim());
		const year = parseInt(parts[parts.length - 1].trim());
		const text = parts.slice(1, -1).join(',').trim();
		if (!row || row < 1 || row > 14 || !text || !year) continue;
		parsed.push({ row, text, year, yearly: false });
	}

	customEntries = parsed;
	localStorage.setItem('lifeline-entries', JSON.stringify(customEntries));
	if (typeof gtag === 'function') gtag('event', 'add_entry', { count: parsed.length });
	closeEntryModal();
	updateCalendar();
}

// ─── Helpers ───
function toggleWeekStart() {
	const btn = document.getElementById('week-start-btn');
	const isSun = btn.textContent === 'SU';
	btn.textContent = isSun ? 'MO' : 'SU';
	btn.style.color = isSun ? '' : '#C41E3A';
	// Sync mobile
	const monBtn = document.getElementById('mob-week-mon');
	const sunBtn = document.getElementById('mob-week-sun');
	if (monBtn && sunBtn) {
		monBtn.classList.toggle('active', isSun);
		sunBtn.classList.toggle('active', !isSun);
	}
	updateCalendar();
}

// ─── Mobile toolbar functions ───
function toggleMobSheet() {
	const sheet = document.getElementById('mob-sheet');
	const overlay = document.getElementById('mob-overlay');
	if (!sheet) return;
	const isOpen = sheet.classList.contains('open');
	sheet.classList.toggle('open', !isOpen);
	overlay.classList.toggle('open', !isOpen);
	// Close download popup if open
	const dlPopup = document.getElementById('mob-dl-popup');
	if (dlPopup) dlPopup.style.display = 'none';
}

function toggleMobDL() {
	const popup = document.getElementById('mob-dl-popup');
	if (!popup) return;
	popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

function closeWelcome() {
	localStorage.setItem('lifeline-welcome-seen', 'true');
	const overlay = document.getElementById('welcome-overlay');
	if (overlay) overlay.style.display = 'none';
}

function mobSetPaper(key) {
	setPaperSize(key);
	setTimeout(_updateMobRollLen, 200);
}

// ─── Rows chips ───
function mobSetRows(val) {
	document.getElementById('rows-slider').value = val;
	document.getElementById('rows-value').textContent = val;
	// Highlight chips (desktop + mobile)
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === val);
	});
	clearTimeout(_rowsTimer);
	_rowsTimer = setTimeout(updateCalendar, 80);
}

function mobSetWeek(day) {
	const btn = document.getElementById('week-start-btn');
	if (day === 'mon') {
		btn.textContent = 'Mon';
		btn.style.color = '';
	} else {
		btn.textContent = 'Sun';
		btn.style.color = '#C41E3A';
	}
	document.getElementById('mob-week-mon').classList.toggle('active', day === 'mon');
	document.getElementById('mob-week-sun').classList.toggle('active', day === 'sun');
	updateCalendar();
}

// ─── Roll length display ───
function _updateMobRollLen() {
	const el = document.getElementById('mob-roll-len');
	if (!el) return;
	if (currentPaper.w !== null) {
		el.textContent = '';
		return;
	}
	const firstPage = document.querySelector('#calendar .cal-page');
	if (firstPage) {
		const screenW = firstPage.getBoundingClientRect().width;
		const paperW_mm = screenW / (viewport.zoom * MM_PX) + 20;
		const meters = (paperW_mm / 1000).toFixed(1);
		el.textContent = '· ' + meters + ' m';
	} else {
		el.textContent = '';
	}
}

// ─── Sync year display ───
function _syncYearDisplay() {
	const yr = document.getElementById('tb-val-yr').value;
	const mo = document.getElementById('tb-val-mo').value;
	const label = yr + '\u2013' + '<br>' + mo;
	const tbRange = document.getElementById('tb-year-range');
	const mobRange = document.getElementById('mob-year-range');
	if (tbRange) tbRange.innerHTML = label;
	if (mobRange) mobRange.innerHTML = label;
	// Sync sheet inputs
	const sheetYr = document.getElementById('mob-sheet-yr');
	const sheetMo = document.getElementById('mob-sheet-mo');
	if (sheetYr) sheetYr.value = yr;
	if (sheetMo) sheetMo.value = mo;
}

function _syncMobileUI() {
	_syncYearDisplay();
	// Rows chips
	const rows = parseInt(document.getElementById('rows-slider').value) || 10;
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === rows);
	});
	setTimeout(_updateMobRollLen, 300);
}

// Helper: DD-MM-YYYY date string
function _exportDate() {
	const d = new Date();
	return pad2(d.getDate()) + '-' + pad2(d.getMonth() + 1) + '-' + d.getFullYear();
}

// Font cache for PDF — fetch once, register on every new doc
const _fontCache = []; // [{id, b64, name, style, weight}]
let _fontsFetched = false;

function _arrayBufferToBase64(buf) {
	const bytes = new Uint8Array(buf);
	const CHUNK = 8192;
	const parts = [];
	for (let i = 0; i < bytes.length; i += CHUNK) {
		parts.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK)));
	}
	return btoa(parts.join(''));
}

async function _loadPDFFonts(doc) {
	const fontName = 'IBM Plex Sans'; // must match SVG font-family

	// Fetch font files only once
	if (!_fontsFetched) {
		const weights = [
			{ file: 'IBMPlexSans-ExtraLight.ttf', style: 'normal', weight: 200 },
			{ file: 'IBMPlexSans-Light.ttf', style: 'normal', weight: 300 },
			{ file: 'IBMPlexSans-Regular.ttf', style: 'normal', weight: 400 },
			{ file: 'IBMPlexSans-Medium.ttf', style: 'normal', weight: 500 },
			{ file: 'IBMPlexSans-SemiBold.ttf', style: 'normal', weight: 600 },
			{ file: 'IBMPlexSans-Bold.ttf', style: 'normal', weight: 700 },
			{ file: 'IBMPlexSans-BoldItalic.ttf', style: 'italic', weight: 700 },
		];
		const results = await Promise.all(weights.map(async w => {
			try {
				const resp = await fetch('fonts/IBMPlexSans/' + w.file);
				const buf = await resp.arrayBuffer();
				return {
					id: 'IBMPlexSans-' + w.weight + (w.style === 'italic' ? 'i' : '') + '.ttf',
					b64: _arrayBufferToBase64(buf),
					name: fontName,
					style: w.style,
					weight: w.weight,
				};
			} catch (e) {
				console.warn('Font load failed:', w.file, e);
				return null;
			}
		}));
		_fontCache.push(...results.filter(Boolean));



		_fontsFetched = true;
	}

	// Register cached fonts on this doc
	for (const f of _fontCache) {
		doc.addFileToVFS(f.id, f.b64);
		doc.addFont(f.id, f.name, f.style, f.weight);
	}
	if (_fontCache.length) doc.setFont(fontName);
}

// ─── Lazy-load PDF libraries ───
let _pdfLibsLoaded = false;
let _pdfLibsLoading = false;

function _loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.head.appendChild(s);
	});
}

async function _ensurePDFLibs() {
	if (_pdfLibsLoaded) return true;
	if (_pdfLibsLoading) {
		// Wait for in-progress load
		while (_pdfLibsLoading) await new Promise(r => setTimeout(r, 50));
		return _pdfLibsLoaded;
	}
	_pdfLibsLoading = true;
	try {
		await _loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js');
		await _loadScript('https://cdn.jsdelivr.net/npm/svg2pdf.js@2.2.4/dist/svg2pdf.umd.min.js');
		_pdfLibsLoaded = true;
	} catch (e) {
		console.warn('Failed to load PDF libraries:', e);
	}
	_pdfLibsLoading = false;
	return _pdfLibsLoaded;
}

async function printPDF() {
	if (!await _ensurePDFLibs() || typeof jspdf === 'undefined') {
		window.print(); // fallback
		return;
	}

	const copies = currentPaper.copies || 1;
	const _cy = new Date().getFullYear();
	const past = _cy - (parseInt(document.getElementById('tb-val-yr').value) || (_cy - 30));
	const future = (parseInt(document.getElementById('tb-val-mo').value) || (_cy + 10)) - _cy;
	const curYear = new Date().getFullYear();
	const fileName = `Lifeline_${currentPaperKey}_${curYear - past}-${curYear + future}.pdf`;

	// Group pages by index
	const pageMap = {};
	_cachedPages.forEach(page => {
		const idx = parseInt(page.dataset.page) || 0;
		if (!pageMap[idx]) pageMap[idx] = [];
		pageMap[idx].push(page);
	});
	const pageIndices = Object.keys(pageMap).map(Number).sort((a, b) => a - b);

	// Determine PDF page size
	const first = _cachedPages[0];
	if (!first) return;
	const calW = first._calW || parseFloat(first.getAttribute('width'));
	const calH = first._calH || parseFloat(first.getAttribute('height'));

	let pdfW, pdfH;
	if (currentPaper.w !== null) {
		pdfW = currentPaper.w;
		pdfH = currentPaper.h;
	} else {
		const MARGIN_MM = 7;
		const copyH = currentPaper.h / copies;
		const printH = copyH - 2 * MARGIN_MM;
		const scale = printH / calH;
		const printW = calW * scale;
		pdfW = printW + 2 * MARGIN_MM;
		pdfH = currentPaper.h;
	}

	const orientation = pdfW > pdfH ? 'landscape' : 'portrait';
	const { jsPDF } = jspdf;
	const doc = new jsPDF({
		orientation,
		unit: 'mm',
		format: [Math.min(pdfW, pdfH), Math.max(pdfW, pdfH)],
	});

	// Load IBM Plex Sans into jsPDF
	await _loadPDFFonts(doc);

	for (let i = 0; i < pageIndices.length; i++) {
		const pi = pageIndices[i];
		const group = pageMap[pi];
		if (i > 0) doc.addPage([Math.min(pdfW, pdfH), Math.max(pdfW, pdfH)], orientation);

		const MARGIN = 7;
		const availW = pdfW - 2 * MARGIN;
		const availH = (pdfH / copies) - 2 * MARGIN;

		for (let c = 0; c < copies; c++) {
			const src = group[c] || group[0];
			const clone = src.cloneNode(true);
			clone.removeAttribute('style');
			clone.removeAttribute('class');
			clone.setAttribute('xmlns', SVG_NS);
			// Temporarily add to DOM for svg2pdf
			clone.style.position = 'absolute';
			clone.style.left = '-9999px';
			document.body.appendChild(clone);

			const yOffset = MARGIN + c * (pdfH / copies);
			await doc.svg(clone, {
				x: MARGIN,
				y: yOffset,
				width: availW,
				height: availH,
			});
			document.body.removeChild(clone);
		}
	}

	doc.save(fileName);
	if (typeof gtag === 'function') gtag('event', 'export_pdf', { paper: currentPaperKey });
}

// ─── SVG Download ───
function _preparePageSVG(page) {
	const clone = page.cloneNode(true);
	clone.removeAttribute('style');
	clone.removeAttribute('class');
	clone.setAttribute('xmlns', SVG_NS);
	return clone;
}

function _downloadBlob(svgNode, filename) {
	const serializer = new XMLSerializer();
	const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(svgNode);
	const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function downloadSVG() {
	if (typeof gtag === 'function') gtag('event', 'export_svg', { paper: currentPaperKey });
	const copies = currentPaper.copies || 1;
	const _cy = new Date().getFullYear();
	const past = _cy - (parseInt(document.getElementById('tb-val-yr').value) || (_cy - 30));
	const future = (parseInt(document.getElementById('tb-val-mo').value) || (_cy + 10)) - _cy;
	const curYear = new Date().getFullYear();
	const baseName = `Lifeline_${currentPaperKey}_${curYear - past}-${curYear + future}`;

	// Group pages by page index
	const pageMap = {};
	_cachedPages.forEach(page => {
		const idx = parseInt(page.dataset.page) || 0;
		if (!pageMap[idx]) pageMap[idx] = [];
		pageMap[idx].push(page);
	});

	const pageIndices = Object.keys(pageMap).map(Number).sort((a, b) => a - b);

	for (const pi of pageIndices) {
		const group = pageMap[pi];
		const first = group[0];
		if (!first) continue;

		if (copies <= 1) {
			// Single copy — export page as-is
			const clone = _preparePageSVG(first);
			const suffix = pageIndices.length > 1 ? `_page${pi + 1}` : '';
			_downloadBlob(clone, `${baseName}${suffix}.svg`);
		} else {
			// Multi-copy — combine into one tall SVG
			const calW = first._calW || parseFloat(first.getAttribute('width'));
			const calH = first._calH || parseFloat(first.getAttribute('height'));
			const totalCopyH = calH * copies;

			const wrapper = document.createElementNS(SVG_NS, 'svg');
			wrapper.setAttribute('xmlns', SVG_NS);
			wrapper.setAttribute('viewBox', `0 0 ${calW} ${totalCopyH}`);
			wrapper.setAttribute('width', calW);
			wrapper.setAttribute('height', totalCopyH);

			for (let c = 0; c < copies; c++) {
				const src = group[c] || first; // fallback to first if clone missing
				const clone = _preparePageSVG(src);
				const g = document.createElementNS(SVG_NS, 'g');
				g.setAttribute('transform', `translate(0,${c * calH})`);
				// Move all children into the group
				while (clone.firstChild) g.appendChild(clone.firstChild);
				wrapper.appendChild(g);
			}

			const suffix = pageIndices.length > 1 ? `_page${pi + 1}` : '';
			_downloadBlob(wrapper, `${baseName}${suffix}.svg`);
		}
	}
}

// ─── Custom confirm dialog ───
function confirmAction(message, onYes) {
	const overlay = document.getElementById('confirm-overlay');
	const msg = document.getElementById('confirm-msg');
	const yesBtn = document.getElementById('confirm-yes');
	const cancelBtn = document.getElementById('confirm-cancel');
	msg.textContent = message;
	overlay.style.display = 'flex';

	function close() {
		overlay.style.display = 'none';
		yesBtn.removeEventListener('click', onConfirm);
		cancelBtn.removeEventListener('click', close);
		overlay.removeEventListener('click', onOverlay);
	}
	function onConfirm() { close(); onYes(); }
	function onOverlay(e) { if (e.target === overlay) close(); }

	yesBtn.addEventListener('click', onConfirm);
	cancelBtn.addEventListener('click', close);
	overlay.addEventListener('click', onOverlay);
}

// ─── Init & event handlers ───
document.addEventListener('DOMContentLoaded', () => {
	init();

	// ── Year input handlers ──
	const valYr = document.getElementById('tb-val-yr');
	const valMo = document.getElementById('tb-val-mo');
	const hiddenInput = document.getElementById('months-input');
	let _dialTimer;

	function _onYearInputChange() {
		const total = Math.max(1, _totalFromDials());
		hiddenInput.value = total;
		_syncYearDisplay();
		updateCalendar();
	}

	function _onYearKeydown(e) {
		if (e.key === 'Enter') {
			e.target.blur();
		}
	}

	// Desktop year input listeners
	function _onYearWheel(e, inputEl, direction) {
		e.preventDefault();
		const step = direction * (e.deltaY < 0 ? 1 : -1);
		let cur = parseInt(inputEl.value) || new Date().getFullYear();
		cur = Math.max(1900, Math.min(2099, cur + step));
		inputEl.value = cur;
		_onYearInputChange();
	}

	if (valYr) {
		valYr.addEventListener('change', _onYearInputChange);
		valYr.addEventListener('keydown', _onYearKeydown);
		valYr.addEventListener('wheel', (e) => _onYearWheel(e, valYr, -1), { passive: false });
	}
	if (valMo) {
		valMo.addEventListener('change', _onYearInputChange);
		valMo.addEventListener('keydown', _onYearKeydown);
		valMo.addEventListener('wheel', (e) => _onYearWheel(e, valMo, 1), { passive: false });
	}

	// ── Sheet year input handlers ──
	function _onSheetYearChange(sheetEl, hiddenId) {
		document.getElementById(hiddenId).value = sheetEl.value;
		_onYearInputChange();
	}

	const sheetYr = document.getElementById('mob-sheet-yr');
	const sheetMo = document.getElementById('mob-sheet-mo');
	if (sheetYr) {
		sheetYr.addEventListener('change', () => _onSheetYearChange(sheetYr, 'tb-val-yr'));
		sheetYr.addEventListener('keydown', _onYearKeydown);
	}
	if (sheetMo) {
		sheetMo.addEventListener('change', () => _onSheetYearChange(sheetMo, 'tb-val-mo'));
		sheetMo.addEventListener('keydown', _onYearKeydown);
	}
	// Click corner to reset viewport
	document.querySelector('.ruler-corner').addEventListener('click', () => {
		const dp = document.getElementById('gantt-panel');
		if (dp) dp._dragged = false;
		autoFitViewport();
	});

	// Drag to pan
	let isPanning = false, panStartX, panStartY, panStartL, panStartT;
	let _rafId = 0;

	document.addEventListener('mousedown', (e) => {
		if (e.target.closest('.controls') || e.target.closest('.ruler') || e.target.closest('.ruler-corner') || e.target.closest('.confirm-overlay') || e.target.closest('.mob-bar') || e.target.closest('.mob-sheet') || e.target.closest('.entry-overlay')) return;
		isPanning = true;
		panStartX = e.clientX;
		panStartY = e.clientY;
		panStartL = viewport.left;
		panStartT = viewport.top;
		document.body.style.cursor = 'grabbing';
		e.preventDefault();
	});

	document.addEventListener('mousemove', (e) => {
		if (!isPanning) return;
		viewport.left = panStartL + (e.clientX - panStartX);
		viewport.top = panStartT + (e.clientY - panStartY);
		if (!_rafId) _rafId = requestAnimationFrame(() => { applyViewport(); _rafId = 0; });
	});

	document.addEventListener('mouseup', () => {
		if (isPanning) {
			isPanning = false;
			document.body.style.cursor = '';
			if (_rafId) { cancelAnimationFrame(_rafId); _rafId = 0; }
			applyViewport();
		}
	});

	// Ctrl + wheel to zoom (smooth animated)
	let _zoomTarget = null;
	let _zoomAnimId = 0;

	function _animateZoom() {
		if (!_zoomTarget) return;
		const t = _zoomTarget;
		const ease = 0.25;
		viewport.zoom += (t.zoom - viewport.zoom) * ease;
		viewport.left += (t.left - viewport.left) * ease;
		viewport.top += (t.top - viewport.top) * ease;
		applyViewport();
		if (Math.abs(viewport.zoom - t.zoom) > 0.0001) {
			_zoomAnimId = requestAnimationFrame(_animateZoom);
		} else {
			viewport.zoom = t.zoom;
			viewport.left = t.left;
			viewport.top = t.top;
			applyViewport();
			_zoomAnimId = 0;
			_zoomTarget = null;
		}
	}

	document.addEventListener('wheel', (e) => {
		if (!e.ctrlKey) return;
		e.preventDefault();
		const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
		const curZoom = _zoomTarget ? _zoomTarget.zoom : viewport.zoom;
		const curLeft = _zoomTarget ? _zoomTarget.left : viewport.left;
		const curTop = _zoomTarget ? _zoomTarget.top : viewport.top;
		const newZoom = Math.max(0.05, Math.min(10, curZoom * factor));
		const mouseX = e.clientX;
		const mouseY = e.clientY;
		const worldPxX = (mouseX - curLeft) / curZoom;
		const worldPxY = (mouseY - curTop) / curZoom;
		_zoomTarget = {
			zoom: newZoom,
			left: mouseX - worldPxX * newZoom,
			top: mouseY - worldPxY * newZoom,
		};
		if (!_zoomAnimId) _zoomAnimId = requestAnimationFrame(_animateZoom);
	}, { passive: false });

	// ─── Touch: pan + pinch-to-zoom ───
	let touchPanning = false, touchStartX, touchStartY, touchStartL, touchStartT;
	let pinching = false, pinchStartDist, pinchStartZoom, pinchCenterX, pinchCenterY;

	function _touchDist(t1, t2) {
		return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
	}

	window.addEventListener('touchstart', (e) => {
		if (e.target.closest('.controls') || e.target.closest('.ruler') || e.target.closest('.ruler-corner') || e.target.closest('.print-menu') || e.target.closest('.mob-bar') || e.target.closest('.mob-sheet') || e.target.closest('.mob-overlay') || e.target.closest('.mob-dl-popup') || e.target.closest('.confirm-overlay') || e.target.closest('.welcome-overlay')) return;
		if (e.touches.length === 1) {
			touchPanning = true;
			pinching = false;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchStartL = viewport.left;
			touchStartT = viewport.top;
			e.preventDefault();
		} else if (e.touches.length === 2) {
			touchPanning = false;
			pinching = true;
			pinchStartDist = _touchDist(e.touches[0], e.touches[1]);
			pinchStartZoom = viewport.zoom;
			pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
			pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			e.preventDefault();
		}
	}, { passive: false, capture: true });

	window.addEventListener('touchmove', (e) => {
		if (touchPanning && e.touches.length === 1) {
			viewport.left = touchStartL + (e.touches[0].clientX - touchStartX);
			viewport.top = touchStartT + (e.touches[0].clientY - touchStartY);
			if (!_rafId) _rafId = requestAnimationFrame(() => { applyViewport(); _rafId = 0; });
			e.preventDefault();
		} else if (pinching && e.touches.length === 2) {
			const dist = _touchDist(e.touches[0], e.touches[1]);
			const newZoom = Math.max(0.05, Math.min(10, pinchStartZoom * (dist / pinchStartDist)));
			const worldPxX = (pinchCenterX - viewport.left) / viewport.zoom;
			const worldPxY = (pinchCenterY - viewport.top) / viewport.zoom;
			viewport.zoom = newZoom;
			viewport.left = pinchCenterX - worldPxX * newZoom;
			viewport.top = pinchCenterY - worldPxY * newZoom;
			if (!_rafId) _rafId = requestAnimationFrame(() => { applyViewport(); _rafId = 0; });
			e.preventDefault();
		}
	}, { passive: false, capture: true });

	window.addEventListener('touchend', (e) => {
		if (e.touches.length === 0) {
			if (touchPanning || pinching) {
				if (_rafId) { cancelAnimationFrame(_rafId); _rafId = 0; }
				applyViewport();
			}
			touchPanning = false;
			pinching = false;
		} else if (e.touches.length === 1 && pinching) {
			// Transitioned from pinch to single finger — start pan
			pinching = false;
			touchPanning = true;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchStartL = viewport.left;
			touchStartT = viewport.top;
		}
	});

	// Window resize
	let _resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(_resizeTimer);
		_resizeTimer = setTimeout(applyViewport, 150);
	});

	// Draggable panels
	document.querySelectorAll('.controls').forEach(panel => {
		let isDraggingPanel = false, pStartX, pStartY, pStartL, pStartT;

		panel.addEventListener('mousedown', (e) => {
			const isGantt = panel.id === 'gantt-panel';
			if (!isGantt && (['INPUT', 'BUTTON', 'LABEL', 'SELECT'].includes(e.target.tagName) || e.target.closest('button'))) return;
			if (isGantt && e.target.tagName === 'INPUT') return;
			isDraggingPanel = true;
			if (panel.id === 'gantt-panel') panel._dragged = true;
			if (!panel.style.left) {
				panel.style.left = panel.offsetLeft + 'px';
				panel.style.right = 'auto';
			}
			pStartX = e.clientX;
			pStartY = e.clientY;
			pStartL = panel.offsetLeft;
			pStartT = panel.offsetTop;
			e.stopPropagation();
		});

		document.addEventListener('mousemove', (e) => {
			if (!isDraggingPanel) return;
			panel.style.left = (pStartL + e.clientX - pStartX) + 'px';
			panel.style.top = (pStartT + e.clientY - pStartY) + 'px';
		});

		document.addEventListener('mouseup', () => {
			isDraggingPanel = false;
		});
	});

	// ─── Welcome carousel (mobile only) ───
	if (window.innerWidth <= 768 && !localStorage.getItem('lifeline-welcome-seen')) {
		const overlay = document.getElementById('welcome-overlay');
		if (overlay) {
			overlay.style.display = 'flex';

			// i18n: replace text
			const s = slides => overlay.querySelectorAll('.welcome-slide');
			const h2s = overlay.querySelectorAll('.welcome-slide h2');
			const ps = overlay.querySelectorAll('.welcome-slide p');
			h2s[0].textContent = t('welcome1title');
			h2s[1].textContent = t('welcome2title');
			h2s[2].textContent = t('welcome3title');
			h2s[3].textContent = t('welcome4title');
			// Slide 1
			ps[0].textContent = t('welcome1a');
			ps[1].textContent = t('welcome1b');
			ps[2].textContent = t('welcome1hint');
			// Slide 2
			ps[3].textContent = t('welcome2a');
			// code elements stay as-is (examples)
			ps[6].textContent = t('welcome2b');
			// Slide 3
			ps[7].textContent = t('welcome3a');
			ps[8].textContent = t('welcome3b');
			// Slide 4
			ps[9].textContent = t('welcome4a');
			// Buttons
			overlay.querySelector('.welcome-skip').textContent = t('welcomeSkip');
			overlay.querySelector('.welcome-start').textContent = t('welcomeStart');

			const carousel = document.getElementById('welcome-carousel');
			const dots = document.querySelectorAll('#welcome-dots .welcome-dot');
			const startBtn = document.getElementById('welcome-start-btn');
			const slides2 = carousel.querySelectorAll('.welcome-slide');

			// IntersectionObserver for dot indicators
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const idx = Array.from(slides2).indexOf(entry.target);
						dots.forEach((d, i) => d.classList.toggle('active', i === idx));
						// Show Start button on last slide
						if (idx === slides2.length - 1) {
							startBtn.classList.add('visible');
						} else {
							startBtn.classList.remove('visible');
						}
					}
				});
			}, { root: carousel, threshold: 0.6 });

			slides2.forEach(s => observer.observe(s));

			// Mouse drag for desktop/emulator
			let _wDrag = false, _wStartX = 0, _wScrollL = 0;
			carousel.addEventListener('mousedown', (e) => {
				_wDrag = true;
				_wStartX = e.pageX;
				_wScrollL = carousel.scrollLeft;
				carousel.style.cursor = 'grabbing';
				carousel.style.scrollSnapType = 'none';
			});
			carousel.addEventListener('mousemove', (e) => {
				if (!_wDrag) return;
				e.preventDefault();
				carousel.scrollLeft = _wScrollL - (e.pageX - _wStartX);
			});
			const _wEnd = () => {
				if (!_wDrag) return;
				_wDrag = false;
				carousel.style.cursor = 'grab';
				carousel.style.scrollSnapType = 'x mandatory';
				// Snap to nearest slide
				const slideW = carousel.offsetWidth;
				const idx = Math.round(carousel.scrollLeft / slideW);
				carousel.scrollTo({ left: idx * slideW, behavior: 'smooth' });
			};
			carousel.addEventListener('mouseup', _wEnd);
			carousel.addEventListener('mouseleave', _wEnd);
		}
	}
});
