// ─── Lifeline Calendar — SVG Renderer ───

// ─── i18n ───
let _currentLang = 'RU';

const I18N = {
	RU: {
		decades: { 1900: 'ДЕВЯТИСОТЫЕ', 1910: 'ДЕСЯТЫЕ', 1920: 'ДВАДЦАТЫЕ', 1930: 'ТРИДЦАТЫЕ', 1940: 'СОРОКОВЫЕ', 1950: 'ПЯТИДЕСЯТЫЕ', 1960: 'ШЕСТИДЕСЯТЫЕ', 1970: 'СЕМИДЕСЯТЫЕ', 1980: 'ВОСЬМИДЕСЯТЫЕ', 1990: 'ДЕВЯНОСТЫЕ', 2000: 'ДВУХТЫСЯЧНЫЕ', 2010: 'ДЕСЯТЫЕ', 2020: 'ДВАДЦАТЫЕ', 2030: 'ТРИДЦАТЫЕ', 2040: 'СОРОКОВЫЕ', 2050: 'ПЯТИДЕСЯТЫЕ', 2060: 'ШЕСТИДЕСЯТЫЕ', 2070: 'СЕМИДЕСЯТЫЕ', 2080: 'ВОСЬМИДЕСЯТЫЕ', 2090: 'ДЕВЯНОСТЫЕ' },
		sticky: ['😊 Счастье', '♡ Личные отношения', '👶 Дети', '🎓 Образование', '🏢 Работа', '💰 Доходы', '⛺ Путешествия', '✏ Хобби', '🏃 Спорт', '🏥 Здоровье', '💀 Смерть близких, конфликты'],
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
	},
	EN: {
		decades: { 1900: 'NINETEEN-HUNDREDS', 1910: 'TENS', 1920: 'TWENTIES', 1930: 'THIRTIES', 1940: 'FORTIES', 1950: 'FIFTIES', 1960: 'SIXTIES', 1970: 'SEVENTIES', 1980: 'EIGHTIES', 1990: 'NINETIES', 2000: 'TWO-THOUSANDS', 2010: 'TWENTY-TENS', 2020: 'TWENTY-TWENTIES', 2030: 'TWENTY-THIRTIES', 2040: 'TWENTY-FORTIES', 2050: 'TWENTY-FIFTIES', 2060: 'TWENTY-SIXTIES', 2070: 'TWENTY-SEVENTIES', 2080: 'TWENTY-EIGHTIES', 2090: 'TWENTY-NINETIES' },
		sticky: ['😊 Happiness', '♡ Relationships', '👶 Children', '🎓 Education', '🏢 Career', '💰 Income', '⛺ Travel', '✏ Hobbies', '🏃 Sport', '🏥 Health', '💀 Loss & Conflicts'],
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
const customEntries = JSON.parse(localStorage.getItem('lifeline-entries') || '[]'); // {row, text, year, yearly}

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
	ink: '#2C2C2C',
	inkLight: '#5A5A5A',
	red: '#C41E3A',
	border: '#C8B89A',
	cellLine: '#999999',
};

// ─── SVG Calendar Generator (year-based) ───
function generateCalendarSVG(startYear, endYear, emptyRows, pageW, totalH, alignRight, hasLegend) {
	const L = LAYOUT;
	const numYears = endYear - startYear + 1;
	const MM = 96 / 25.4;
	const mW = 10 * MM;    // 10mm past years
	const mW2 = 20 * MM;   // 20mm future years (from currentYear+1 onward)
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
		.decade-label { fill: #cccccc; font-style: italic; font-weight: 700; }
	`;

	let pathGray = '';

	// ── Decade names ──


	// ── Render year columns ──
	let xCursor = xYearsStart;
	for (let yi = 0; yi < numYears; yi++) {
		const year = startYear + yi;
		const colW = yearW(year);
		const isDecade = (year % 10 === 0);
		const isCurrentYear = (year === currentYear);

		if (isCurrentYear) {
			svgEl('rect', {
				x: xCursor, y: 0, width: colW, height: totalH,
				fill: '#e8d2d0', opacity: '0.6',
			}, svg);
		}

		let bw = L.monthBorderW;
		let bc = COLORS.cellLine;
		if (isDecade) { bw = L.yearBorderW; bc = COLORS.ink; }

		svgEl('line', {
			x1: xCursor, y1: 0, x2: xCursor, y2: totalH,
			'stroke-width': bw, stroke: bc,
		}, svg);

		const ya = {
			x: xCursor + colW / 2, 'font-size': '12', 'text-anchor': 'middle',
			'font-weight': '300', class: 'year-num',
			fill: isCurrentYear ? COLORS.ink : undefined,
		};
		svgEl('text', { ...ya, y: r0H + r1H - 3 }, svg).textContent = year;
		const midY = headerH + (totalH - headerH) / 2;
		svgEl('text', { ...ya, y: midY + 4 }, svg).textContent = year;
		svgEl('text', { ...ya, y: totalH - 3 }, svg).textContent = year;

		pathGray += `M${xCursor} ${yGantt}V${totalH}`;
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
			'font-size': '40', 'text-anchor': 'middle',
			class: 'decade-label',
		}, svg).textContent = name;
	}

	// Right border
	svgEl('line', {
		x1: xYearsEnd, y1: 0, x2: xYearsEnd, y2: totalH,
		'stroke-width': '0.75', stroke: COLORS.ink,
	}, svg);

	// ── Horizontal grid lines (content start → years end) ──
	for (let ri = 0; ri <= emptyRows; ri++) {
		const lineY = yGantt + ri * ganttRowH;
		pathGray += `M${xContentStart} ${lineY}H${xYearsEnd}`;
	}

	if (pathGray) svgEl('path', {
		d: pathGray, fill: 'none', 'stroke-width': '0.15', stroke: COLORS.cellLine,
	}, svg);



	// ── Custom entry labels ──
	for (const e of customEntries) {
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

	svg._calW = pageW;
	svg._calH = totalH;
	return svg;
}

// ─── Duration helpers ───
function _syncDialsFromTotal() {
	const yrEl = document.getElementById('tb-val-yr');
	const moEl = document.getElementById('tb-val-mo');
	const past = parseInt(yrEl.textContent) || 30;
	const future = parseInt(moEl.textContent) || 10;
	document.getElementById('months-input').value = past + future;
}

function _totalFromDials() {
	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 0;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 0;
	return past + future;
}

// ─── Page building (year-based) ───
let _cachedPages = [];
let _cachedRollW = 0;
function buildPages() {
	const rows = parseInt(document.getElementById('rows-slider').value) || 10;
	const clampedRows = Math.max(6, Math.min(14, rows));

	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 30;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 10;
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - past;
	const endYear = currentYear + future;

	const MARGIN_MM = 7;
	const MM = 96 / 25.4;
	const PAST_W_MM = 10;
	// 914×4 → all years 10mm; otherwise future = 20mm
	const FUTURE_W_MM = 20;

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
		pageW = yppPast * PAST_W_MM * MM;
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
			position: 'fixed', zIndex: '100',
			width: '189px', minHeight: '189px',
			background: '#fff9b1', padding: '12px 10px 8px',
			boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
			fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px',
			lineHeight: '1.45', color: '#333',
			borderBottom: '3px solid #f0e68c',
			cursor: 'grab', userSelect: 'none',
		});
		// Drag (mouse + touch)
		let dragging = false, dx, dy;
		function startDrag(cx, cy) {
			dragging = true;
			dx = cx - note.offsetLeft;
			dy = cy - note.offsetTop;
			note.style.cursor = 'grabbing';
		}
		function moveDrag(cx, cy) {
			if (!dragging) return;
			note.style.left = (cx - dx) + 'px';
			note.style.top = (cy - dy) + 'px';
			note._dragged = true;
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

	// Position left of first page (unless user dragged it)
	if (!note._dragged) {
		const firstPage = document.querySelector('#calendar .cal-page');
		if (firstPage) {
			const r = firstPage.getBoundingClientRect();
			note.style.left = (r.left - 200) + 'px';
			note.style.top = r.top + 'px';
		}
	}
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

	// Entry modal
	const modalTitle = document.querySelector('#entry-overlay .confirm-msg');
	const addBtn = document.querySelector('#entry-overlay .confirm-yes');
	const cancelBtns = document.querySelectorAll('.confirm-cancel');
	if (modalTitle) modalTitle.textContent = t('addEntry');
	if (addBtn) addBtn.textContent = t('add');
	cancelBtns.forEach(b => b.textContent = t('cancel'));

	// Yearly checkbox label
	const yearlyEl = document.getElementById('entry-yearly');
	if (yearlyEl && yearlyEl.parentElement) {
		yearlyEl.parentElement.childNodes.forEach(n => {
			if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + t('repeatYearly');
		});
	}

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

	if (emptyRows < 5 || emptyRows > 15) emptyRows = 10;

	const yrEl = document.getElementById('tb-val-yr');
	const moEl = document.getElementById('tb-val-mo');
	const rowsSlider = document.getElementById('rows-slider');
	const rowsValue = document.getElementById('rows-value');

	if (yrEl) yrEl.textContent = past;
	if (moEl) moEl.textContent = future;
	document.getElementById('months-input').value = past + future;

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
}

function updateCalendar() {
	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 30;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 10;
	const url = new URL(window.location);
	url.searchParams.set('p', past);
	url.searchParams.set('f', future);
	url.searchParams.set('g', parseInt(document.getElementById('rows-slider').value) || 10);
	window.history.replaceState({}, '', url);
	buildPages();
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
	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 30;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 10;
	const totalYears = past + future + 1;

	const MARGIN_MM = 7;
	const YEAR_WIDTH_MM = 10;

	function _pagesFor(paper) {
		if (paper.w === null) return 1;
		const printW_mm = paper.w - 2 * MARGIN_MM;
		const ypp = Math.max(1, Math.floor(printW_mm / YEAR_WIDTH_MM));
		return Math.max(1, Math.ceil(totalYears / ypp));
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

	if (el) el.textContent = '';
}

function setPaperSize(key) {
	currentPaper = PAPER_SIZES[key] || PAPER_SIZES.a4;
	currentPaperKey = key;
	// Highlight desktop top-bar + dropdown
	_ui.sizeChips.forEach(b => {
		b.classList.toggle('active', b.dataset.size === key);
	});
	// Sync mobile UI
	const mobFmt = document.getElementById('mob-format');
	if (mobFmt) {
		const labels = { a4: 'A4', a3: 'A3', '914mm': '914', '914x2': '914×2', '914x4': '914×4' };
		mobFmt.textContent = labels[key] || key;
	}
	_ui.mobSizeChips.forEach(b => {
		b.classList.toggle('active', b.dataset.size === key);
	});
	updateCalendar();
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
	const scaleScreen = (availableH - screenMargin) / (currentPaper.h * MM_PX);
	viewport.zoom = Math.min(scaleScreen, 1);

	const paperScreenH = currentPaper.h * viewport.zoom * MM_PX;
	viewport.top = (availableH - paperScreenH) / 2;

	if (currentPaper.w !== null) {
		const paperScreenW = currentPaper.w * viewport.zoom * MM_PX;
		const leftGap = isMobile ? 10 : RULER_W;
		viewport.left = leftGap + (window.innerWidth - leftGap - paperScreenW) / 2;
	} else {
		viewport.left = (isMobile ? 10 : RULER_W) + screenMargin;
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
		extra.style.background = '#FDF6E3';
		extra.style.borderRadius = '8px';
		extra.style.boxShadow = '1px 1px 4px rgba(60,40,20,.15), 3px 3px 12px rgba(60,40,20,.1)';
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

	// Guides
	document.getElementById('guide-h').style.top = (paperBottomY - marginPx) + 'px';
	document.getElementById('guide-v').style.left = originScreenX + 'px';
	const guideH = document.getElementById('guide-h-a4');
	guideH.style.top = (paperTopY + marginPx) + 'px';

	const guideVA4 = document.getElementById('guide-v-a4');
	guideVA4.style.display = 'none';

	let guideIdx = 0;
	for (let p = 0; p < totalPages; p++) {
		const pageLeft = originScreenX + p * (paperW + pageGap);
		const gL = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-v guide-page-v', document.body);
		gL.style.left = (pageLeft + marginPx) + 'px';

		if (currentPaper.w !== null) {
			const gR = _getPooledDiv(_guidePool, guideIdx++, 'guide guide-v guide-page-v', document.body);
			gR.style.left = (pageLeft + paperW - marginPx) + 'px';
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

	drawRulers();
}

// ─── Rulers ───
let _rulerLeft, _rulerBottom;
function drawRulers() {
	const tickColor = '#8B7D6B';
	const textColor = '#6B5D4B';
	const bgColor = '#F5ECD7';
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
	document.getElementById('entry-text').value = '';
	document.getElementById('entry-year').value = '';
	document.getElementById('entry-yearly').checked = false;
	document.getElementById('entry-overlay').style.display = 'flex';
	setTimeout(() => document.getElementById('entry-text').focus(), 50);

	document.getElementById('entry-text').onkeydown = (e) => {
		if (e.key === 'Enter') { e.preventDefault(); document.getElementById('entry-year').focus(); }
	};
	document.getElementById('entry-year').onkeydown = (e) => {
		if (e.key === 'Enter') { e.preventDefault(); addCustomEntry(); }
	};
}

function closeEntryModal() {
	document.getElementById('entry-overlay').style.display = 'none';
}

function addCustomEntry() {
	const raw = document.getElementById('entry-text').value.trim();
	const yearStr = document.getElementById('entry-year').value.trim();
	const year = parseInt(yearStr);

	// Parse "N, text" — first chars before comma = row number
	const commaIdx = raw.indexOf(',');
	if (commaIdx < 1) { document.getElementById('entry-text').focus(); return; }
	const row = parseInt(raw.substring(0, commaIdx).trim());
	const text = raw.substring(commaIdx + 1).trim();

	if (!row || row < 1 || row > 14) { document.getElementById('entry-text').focus(); return; }
	if (!text) { document.getElementById('entry-text').focus(); return; }
	if (!year || yearStr.length !== 4) { document.getElementById('entry-year').focus(); return; }

	const yearly = document.getElementById('entry-yearly').checked;
	customEntries.push({ row, text, year, yearly });
	localStorage.setItem('lifeline-entries', JSON.stringify(customEntries));
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

function mobSetPaper(key) {
	setPaperSize(key);
	setTimeout(_updateMobRollLen, 200);
}

// ─── Scroll wheels ───
let _wheelTimer;

function _initMobWheels() {
	const yrEl = document.getElementById('mob-wheel-yr');
	const moEl = document.getElementById('mob-wheel-mo');
	if (!yrEl || !moEl) return;

	const pastVal = parseInt(document.getElementById('tb-val-yr').textContent) || 35;
	const futureVal = parseInt(document.getElementById('tb-val-mo').textContent) || 25;

	_buildWheel(yrEl, 1, 99, pastVal);
	_buildWheel(moEl, 1, 99, futureVal);

	// Scroll to initial values after layout
	requestAnimationFrame(() => {
		_scrollWheelTo(yrEl, pastVal, false);
		_scrollWheelTo(moEl, futureVal, false);
	});

	// Scroll listeners
	yrEl.onscroll = () => _onWheelScroll(yrEl, 'yr');
	moEl.onscroll = () => _onWheelScroll(moEl, 'mo');
}

function _buildWheel(el, min, max, activeVal) {
	el.innerHTML = '';
	const padTop = document.createElement('div');
	padTop.className = 'mob-wheel-pad';
	el.appendChild(padTop);

	for (let i = min; i <= max; i++) {
		const d = document.createElement('div');
		d.className = 'mob-wheel-item' + (i === activeVal ? ' active' : '');
		d.textContent = i;
		d.dataset.v = i;
		d.addEventListener('click', () => _scrollWheelTo(el, i));
		el.appendChild(d);
	}

	const padBot = document.createElement('div');
	padBot.className = 'mob-wheel-pad';
	el.appendChild(padBot);
}

function _scrollWheelTo(el, val, smooth = true) {
	const items = el.querySelectorAll('.mob-wheel-item');
	const target = Array.from(items).find(d => parseInt(d.dataset.v) === val);
	if (!target) return;
	el.scrollTo({ top: target.offsetTop - 40, behavior: smooth ? 'smooth' : 'auto' });
}

function _onWheelScroll(el, type) {
	const items = el.querySelectorAll('.mob-wheel-item');
	const viewCenter = el.scrollTop + 60;
	let closest = null, closestDist = Infinity;
	items.forEach(d => {
		const itemCenter = d.offsetTop + 20;
		const dist = Math.abs(itemCenter - viewCenter);
		if (dist < closestDist) { closestDist = dist; closest = d; }
	});
	if (!closest) return;
	const val = parseInt(closest.dataset.v);

	items.forEach(d => d.classList.toggle('active', d === closest));

	if (type === 'yr') {
		document.getElementById('tb-val-yr').textContent = val;
	} else {
		document.getElementById('tb-val-mo').textContent = val;
	}

	// Debounce update
	clearTimeout(_wheelTimer);
	_wheelTimer = setTimeout(() => {
		const past = parseInt(document.getElementById('tb-val-yr').textContent) || 35;
		const future = parseInt(document.getElementById('tb-val-mo').textContent) || 25;
		document.getElementById('mob-months').textContent = past;
		document.getElementById('mob-rows').textContent = future;
		updateCalendar();
	}, 150);
}

// ─── Rows chips ───
function mobSetRows(val) {
	document.getElementById('rows-slider').value = val;
	document.getElementById('rows-value').textContent = val;
	document.getElementById('mob-rows').textContent = val;
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

// ─── Smart toolbar label ───
function _updateMobMonthsLabel(months) {
	const mobMonths = document.getElementById('mob-months');
	const mobLabel = document.getElementById('mob-months-label');
	if (!mobMonths || !mobLabel) return;
	if (months >= 12 && months % 12 === 0) {
		mobMonths.textContent = months / 12;
		mobLabel.textContent = 'yr';
	} else {
		mobMonths.textContent = months;
		mobLabel.textContent = 'mo';
	}
}

let _wheelsInit = false;
function _syncMobileUI() {
	const months = parseInt(document.getElementById('months-input').value) || 12;
	_updateMobMonthsLabel(months);
	const rows = parseInt(document.getElementById('rows-slider').value) || 10;
	const mobRows = document.getElementById('mob-rows');
	if (mobRows) mobRows.textContent = rows;
	// Highlight active rows chips (desktop + mobile)
	_ui.rowsChips.forEach(b => {
		b.classList.toggle('active', parseInt(b.dataset.rows) === rows);
	});
	// Set wheel values
	_wheelYr = Math.floor(months / 12);
	_wheelMo = months % 12;
	if (!_wheelsInit) {
		_initMobWheels();
		_wheelsInit = true;
	} else {
		// Just scroll to correct position
		const yrEl = document.getElementById('mob-wheel-yr');
		const moEl = document.getElementById('mob-wheel-mo');
		if (yrEl) _scrollWheelTo(yrEl, _wheelYr, false);
		if (moEl) _scrollWheelTo(moEl, _wheelMo, false);
	}
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
	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 30;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 10;
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
	const copies = currentPaper.copies || 1;
	const past = parseInt(document.getElementById('tb-val-yr').textContent) || 30;
	const future = parseInt(document.getElementById('tb-val-mo').textContent) || 10;
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

	// ── Dual dial wheel handlers ──
	const dialYr = document.getElementById('tb-dial-yr');
	const dialMo = document.getElementById('tb-dial-mo');
	const valYr = document.getElementById('tb-val-yr');
	const valMo = document.getElementById('tb-val-mo');
	const hiddenInput = document.getElementById('months-input');
	let _dialTimer;

	function _onDialWheel(e, valEl, min, max) {
		e.preventDefault();
		const step = e.deltaY < 0 ? 1 : -1;
		let cur = parseInt(valEl.textContent) || 0;
		cur = Math.max(min, Math.min(max, cur + step));
		valEl.textContent = cur;
		// Sync total
		const total = Math.max(1, _totalFromDials());
		hiddenInput.value = total;
		clearTimeout(_dialTimer);
		_dialTimer = setTimeout(updateCalendar, 120);
	}

	if (dialYr) {
		dialYr.addEventListener('wheel', (e) => _onDialWheel(e, valYr, 1, 100), { passive: false });
	}
	if (dialMo) {
		dialMo.addEventListener('wheel', (e) => _onDialWheel(e, valMo, 1, 50), { passive: false });
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
		if (e.target.closest('.controls') || e.target.closest('.ruler') || e.target.closest('.ruler-corner') || e.target.closest('.confirm-overlay')) return;
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
		if (e.target.closest('.controls') || e.target.closest('.ruler') || e.target.closest('.ruler-corner') || e.target.closest('.print-menu') || e.target.closest('.mob-bar') || e.target.closest('.mob-sheet') || e.target.closest('.mob-overlay') || e.target.closest('.mob-dl-popup') || e.target.closest('.confirm-overlay')) return;
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
});
