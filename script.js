// One die per destination. Hotel data lives in data/<key>.js and registers
// itself on window.DESTINATIONS.
const ORDER = ['samui', 'phangan', 'bangkok', 'phuket'];
const DESTS = window.DESTINATIONS || {};
const ACTIVITIES = window.ACTIVITIES || {};

// Where "Request this place" submissions are sent. Leave empty for draft
// mode (the form works but nothing is sent). For example a Formspree form:
// 'https://formspree.io/f/xxxxxxx' — it accepts JSON and emails you each request.
const FORM_ENDPOINT = '';

// ---------- Language (English, German, Thai) ----------
const LANGS = ['en', 'de', 'th'];
const I18N = window.I18N || { en: {} };
const ACT_I18N = window.ACT_I18N || {};
let LANG = (() => {
  try { const l = localStorage.getItem('thd-lang'); if (LANGS.includes(l)) return l; } catch {}
  const nav = (navigator.language || 'en').slice(0, 2);
  return LANGS.includes(nav) ? nav : 'en';
})();
const LOCALE = { en: 'en-GB', de: 'de-DE', th: 'th-TH' };

function t(key, vars = {}) {
  const str = (I18N[LANG] && I18N[LANG][key]) ?? I18N.en[key] ?? key;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}
const place = (name) => ((window.PLACE_I18N || {})[LANG] || {})[name] || name;
const monthName = (m) => new Date(2024, m, 1).toLocaleDateString(LOCALE[LANG], { month: 'short' }).replace('.', '');
const actInfo = (info) => (ACT_I18N[LANG] && ACT_I18N[LANG][info]) || info;

function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
}

const slug = (name) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const eur = (v) => '€' + Math.round(v / 5) * 5;

// Tonight's stay in the visitor's local time zone: check in today, check out tomorrow.
function tonight() {
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return { checkin: iso(today), checkout: iso(tomorrow), month: today.getMonth() };
}

// Direct hotel pages. With dates filled in, both sites open the hotel with
// tonight's available rooms and their live prices.
function bookingUrl(h, { checkin, checkout }) {
  const q = new URLSearchParams({ checkin, checkout, group_adults: 2, group_children: 0, no_rooms: 1 });
  return `https://www.booking.com/hotel/th/${h.booking}.html?${q}`;
}

function agodaUrl(h, d, { checkin }) {
  if (!h.agodaSlug) return null;
  const q = new URLSearchParams({ checkIn: checkin, los: 1, adults: 2, children: 0, rooms: 1 });
  return `https://www.agoda.com/${h.agodaSlug}/hotel/${h.agodaCity || d.agodaCity}.html?${q}`;
}

const monthPrices = (h, d) => d.season.map((f, m) => [monthName(m), h.base * f]);
const yearAvg = (h, d) => monthPrices(h, d).reduce((s, [, p]) => s + p, 0) / 12;

const $ = (id) => document.getElementById(id);
const die = $('die');
const dieValue = $('dieValue');
const rollBtn = $('roll');

let current = null; // destination key
let shown = -1;     // hotel index currently shown

function setLink(el, href) {
  el.hidden = !href;
  if (href) el.href = href;
}

function showHotel(i) {
  const d = DESTS[current];
  const h = d.hotels[i];
  shown = i;

  $('rRank').textContent = t('r.rank', { i: i + 1, n: d.hotels.length });
  $('rName').textContent = h.name;
  $('rArea').textContent = `${h.area}, ${place(d.name)}`;
  $('rRooms').textContent = t('f.approx', { n: h.rooms });
  $('rCategory').textContent = t(`cat.${h.category}`);
  $('rRestaurant').textContent = h.restaurant ? t('yes') : t('no');
  $('rAvg').textContent = eur(yearAvg(h, d));

  const stay = tonight();
  const dateLabel = new Date(stay.checkin + 'T12:00').toLocaleDateString(LOCALE[LANG], { weekday: 'short', day: 'numeric', month: 'short' });
  $('rTonight').textContent = t('tonight.line', { date: dateLabel });
  setLink($('rBooking'), bookingUrl(h, stay));
  setLink($('rAgoda'), agodaUrl(h, d, stay));

  // Hotel photo from images/<slug>.jpg if it exists; otherwise the link
  // cards show only the Booking.com / Agoda logo.
  const src = `images/${slug(h.name)}.jpg`;
  const photos = [$('rPhoto'), ...document.querySelectorAll('.deal-photo')];
  const setPhoto = (ok) => {
    $('rPhotoWrap').hidden = !ok;
    photos.forEach((img) => {
      img.hidden = !ok;
      img.closest('.deal')?.classList.toggle('has-photo', ok);
      if (ok) { img.src = src; img.alt = h.name; }
    });
  };
  setPhoto(false);
  const probe = new Image();
  const key = current;
  probe.onload = () => { if (shown === i && current === key) setPhoto(true); };
  probe.src = src;

  $('rMap').src = `https://maps.google.com/maps?q=${encodeURIComponent(`${h.name}, ${d.name}, Thailand`)}&t=k&z=16&output=embed`;

  const prices = monthPrices(h, d);
  const max = Math.max(...prices.map(([, p]) => p));
  $('rMonths').replaceChildren(...prices.map(([m, p], idx) => {
    const cell = document.createElement('div');
    cell.className = idx === stay.month ? 'month now' : 'month';
    cell.innerHTML = `<span class="bar" style="height:${Math.round((p / max) * 70)}%"></span>` +
      `<strong>${eur(p)}</strong><span>${m}</span>`;
    return cell;
  }));

  document.querySelectorAll('#hotelTable tr').forEach((tr, j) => tr.classList.toggle('picked', j === i));
  renderNearby((ACTIVITIES[current] || {})[h.name] || []);
}

// Show hotel i (from a roll or from the list) and bring the result into view.
function pickHotel(i) {
  dieValue.textContent = i + 1;
  try {
    showHotel(i);
  } finally {
    $('result').hidden = false;
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function roll() {
  if (rollBtn.disabled) return;
  const count = DESTS[current].hotels.length;
  const target = Math.floor(Math.random() * count);
  rollBtn.disabled = true;
  die.classList.add('rolling');

  let ticks = 0;
  const timer = setInterval(() => {
    dieValue.textContent = Math.floor(Math.random() * count) + 1;
    if (++ticks >= 12) {
      clearInterval(timer);
      die.classList.remove('rolling');
      rollBtn.disabled = false;
      pickHotel(target);
    }
  }, 70);
}

function renderTable(d) {
  const stay = tonight();
  $('hotelTable').replaceChildren(...d.hotels.map((h, i) => {
    const tr = document.createElement('tr');
    tr.className = 'pickable';
    tr.tabIndex = 0;
    tr.setAttribute('aria-label', h.name);
    [i + 1, h.name, h.area, h.rooms, t(`cat.${h.category}`), h.restaurant ? t('yes') : t('no'), eur(yearAvg(h, d))]
      .forEach((v) => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
    tr.cells[1].insertAdjacentHTML('beforeend', '<span class="row-go" aria-hidden="true">→</span>');
    tr.addEventListener('click', (e) => { if (!e.target.closest('a')) pickHotel(i); });
    tr.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === tr) { e.preventDefault(); pickHotel(i); }
    });
    const links = document.createElement('td');
    links.className = 'links';
    [['Booking', bookingUrl(h, stay)], ['Agoda', agodaUrl(h, d, stay)]].forEach(([label, href]) => {
      if (!href) return;
      const a = document.createElement('a');
      Object.assign(a, { href, textContent: label, target: '_blank', rel: 'noopener' });
      a.className = label.toLowerCase();
      links.append(a);
    });
    tr.append(links);
    if (i === shown) tr.classList.add('picked');
    return tr;
  }));
}

function updateDestTexts() {
  const d = DESTS[current];
  const n = d.hotels.length;
  $('heroTitle').textContent = d.title;
  $('menuCurrent').textContent = `${d.title} Dice`;
  $('heroCta').textContent = t('hero.cta', { dice: `${d.title} Dice` });
  $('tagline').textContent = t('play.tagline', { n, place: place(d.name) });
  $('hint').textContent = t('play.hint', { n });
  $('listTitle').textContent = t('list.title', { n, place: place(d.name) });
  document.querySelectorAll('#destMenu a').forEach((a) => {
    const dd = DESTS[a.dataset.key];
    a.querySelector('.m-sub').textContent = t('m.sub', { n: dd.hotels.length, place: place(dd.name) });
  });
  renderTable(d);
}

function selectDestination(key, { scroll = false } = {}) {
  if (!DESTS[key]) key = ORDER.find((k) => DESTS[k]);
  const d = DESTS[key];
  current = key;
  shown = -1;

  document.documentElement.style.setProperty('--accent', d.color);
  document.title = `${d.title} Dice · Thailand Hotel Dice`;
  dieValue.textContent = '?';
  $('result').hidden = true;
  updateDestTexts();

  document.querySelectorAll('#destMenu a').forEach((a) => a.setAttribute('aria-current', String(a.dataset.key === key)));
  if (location.hash.slice(1) !== key) history.replaceState(null, '', `#${key}`);
  if (scroll) $('play').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Menu: the four dice sit under the main heading as a dropdown.
const menu = document.querySelector('.menu');
const menuToggle = $('menuToggle');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}
menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
document.addEventListener('click', (e) => { if (!menu.contains(e.target)) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

$('destMenu').replaceChildren(...ORDER.filter((k) => DESTS[k]).map((k) => {
  const d = DESTS[k];
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `#${k}`;
  a.dataset.key = k;
  a.style.setProperty('--c', d.color);
  a.innerHTML = `<span class="hex" aria-hidden="true">${d.hotels.length}</span>` +
    `<span><span class="m-name">${d.title} Dice</span><span class="m-sub"></span></span>`;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    setMenu(false);
    selectDestination(k, { scroll: true });
  });
  li.append(a);
  return li;
}));

// ---------- Nearby carousel (loops in both directions, swipeable) ----------
const nb = { items: [], index: 0, perView: 1 };
const nbTrack = $('nbTrack');
const nbViewport = $('nbViewport');

function nbPerView() {
  const w = nbViewport.clientWidth;
  return w >= 860 ? 4 : w >= 600 ? 3 : 1.6; // phones: next card peeks in
}

function nbLayout(animate) {
  const n = nb.items.length;
  if (!n) return;
  nb.perView = nbPerView();
  const gap = 12;
  const cardW = (nbViewport.clientWidth - gap * (nb.perView - 1)) / nb.perView;
  nbTrack.querySelectorAll('.nb-card').forEach((c) => { c.style.width = `${cardW}px`; c.style.marginRight = `${gap}px`; });
  nbTrack.classList.toggle('animate', animate);
  nbTrack.style.transform = `translateX(${-nb.index * (cardW + gap)}px)`;
  const active = ((nb.index % n) + n) % n;
  $('nbDots').querySelectorAll('span').forEach((dot, k) => dot.classList.toggle('on', k === active));
}

function nbGo(delta) {
  if (!nb.items.length) return;
  nb.index += delta;
  nbLayout(true);
}

// After an animated move, jump silently back into the middle copy so the
// list can repeat forever in either direction.
nbTrack.addEventListener('transitionend', () => {
  const n = nb.items.length;
  if (nb.index < n || nb.index >= 2 * n) {
    nb.index = (((nb.index % n) + n) % n) + n;
    nbLayout(false);
  }
});

// Photos for nearby places come from Wikipedia's lead image for the place.
// The API only returns freely licensed images (pilicense=free); each photo
// links to its file page for credit. No match → a plain placeholder.
const photoCache = new Map();
const GENERIC = new Set(('the of and a at on in to beach bay temple wat market night island islands viewpoint view point ' +
  'waterfall falls park bar club koh ko phuket samui phangan bangkok thailand thai shrine road street pier walking mall ' +
  'center centre national museum garden gardens house village old town cape hill').split(' '));

const words = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !GENERIC.has(w));

async function findPhoto(name, where) {
  const key = `${name}|${where}`;
  if (photoCache.has(key)) return photoCache.get(key);
  const job = (async () => {
    const want = words(name);
    if (!want.length) return null;
    const queries = [name.replace(/\s*\(.*?\)\s*/g, ' ').trim(), (name.match(/\((.+?)\)/) || [])[1]].filter(Boolean);
    for (const q of queries) {
      const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
        action: 'query', format: 'json', origin: '*', generator: 'search', gsrsearch: `${q} ${where}`, gsrlimit: '3',
        prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: '480', pilicense: 'free',
      });
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const pages = Object.values((await res.json()).query?.pages || {}).sort((a, b) => a.index - b.index);
        const hit = pages.find((pg) => pg.thumbnail && words(pg.title).some((w) => want.includes(w)));
        if (hit) return { src: hit.thumbnail.source, credit: `https://en.wikipedia.org/wiki/File:${encodeURIComponent(hit.pageimage)}` };
      } catch { /* offline or blocked: fall through to placeholder */ }
    }
    return null;
  })();
  photoCache.set(key, job);
  return job;
}

function renderNearby(items) {
  nb.items = items;
  $('nearby').hidden = !items.length;
  if (!items.length) return;
  const where = DESTS[current].name;
  const card = (a, k) => {
    const el = document.createElement('article');
    el.className = 'nb-card';
    el.dataset.k = k;
    el.innerHTML = '<div class="nb-media"><span class="nb-ph" aria-hidden="true"></span></div>' +
      '<div class="nb-body"><span class="nb-type"></span><h4 class="nb-name"></h4><p class="nb-info"></p><span class="nb-dist"></span></div>';
    const type = a.type ? t(`type.${a.type}`) : t('nb.title');
    el.querySelector('.nb-ph').textContent = type.slice(0, 1);
    el.querySelector('.nb-type').textContent = type;
    el.querySelector('.nb-name').textContent = a.name;
    el.querySelector('.nb-info').textContent = actInfo(a.info);
    el.querySelector('.nb-dist').textContent = t('nb.km', { km: Number(a.km).toLocaleString(LOCALE[LANG], { maximumFractionDigits: 1 }) });
    return el;
  };
  nbTrack.replaceChildren(...[...items, ...items, ...items].map((a, j) => card(a, j % items.length)));
  $('nbDots').replaceChildren(...items.map(() => document.createElement('span')));
  nb.index = items.length;
  requestAnimationFrame(() => nbLayout(false));

  const token = nb.items;
  items.forEach((a, k) => {
    findPhoto(a.name, where).then((photo) => {
      if (!photo || nb.items !== token) return;
      nbTrack.querySelectorAll(`.nb-card[data-k="${k}"] .nb-media`).forEach((m) => {
        const img = new Image();
        img.alt = a.name;
        img.loading = 'lazy';
        img.draggable = false;
        img.onload = () => m.classList.add('loaded');
        img.src = photo.src;
        const credit = document.createElement('a');
        Object.assign(credit, { href: photo.credit, target: '_blank', rel: 'noopener', className: 'nb-credit', textContent: 'Photo · Wikimedia' });
        m.append(img, credit);
      });
    });
  });
}

$('nbPrev').addEventListener('click', () => nbGo(-1));
$('nbNext').addEventListener('click', () => nbGo(1));
nbViewport.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') nbGo(-1);
  if (e.key === 'ArrowRight') nbGo(1);
});
window.addEventListener('resize', () => nbLayout(false));

let drag = null;
nbViewport.addEventListener('pointerdown', (e) => {
  if (!nb.items.length) return;
  drag = { x: e.clientX, base: new DOMMatrix(getComputedStyle(nbTrack).transform).m41 };
  nbTrack.classList.remove('animate');
  nbViewport.setPointerCapture(e.pointerId);
});
nbViewport.addEventListener('pointermove', (e) => {
  if (!drag) return;
  nbTrack.style.transform = `translateX(${drag.base + e.clientX - drag.x}px)`;
});
const endDrag = (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  drag = null;
  if (Math.abs(dx) > 40) nbGo(dx < 0 ? 1 : -1);
  else nbLayout(true);
};
nbViewport.addEventListener('pointerup', endDrag);
nbViewport.addEventListener('pointercancel', endDrag);

// ---------- Request / contact dialog ----------
const dialog = $('requestDialog');
const form = $('requestForm');

function openRequest(forHotel) {
  const d = DESTS[current];
  const h = forHotel && shown >= 0 ? d.hotels[shown] : null;
  form.reset();
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  $('reqError').hidden = true;
  $('reqBody').hidden = false;
  $('reqDone').hidden = true;
  $('reqDemo').hidden = Boolean(FORM_ENDPOINT);
  $('reqEyebrow').textContent = h ? t('req.eyebrow.hotel') : t('req.eyebrow.contact');
  $('reqTitle').textContent = h ? h.name : t('req.title.contact');
  form.hotel.value = h ? h.name : '';
  form.destination.value = d.name;
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  form.name.focus();
}

function closeRequest() {
  if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
}

document.querySelectorAll('[data-request]').forEach((b) => b.addEventListener('click', () => openRequest(b.dataset.request === 'hotel')));
$('reqClose').addEventListener('click', closeRequest);
$('reqDoneClose').addEventListener('click', closeRequest);
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeRequest(); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('reqError');
  const fail = (msg, field) => {
    err.textContent = msg;
    err.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  };
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  err.hidden = true;

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  if (!name) return fail(t('req.err.name'), form.name);
  if (!form.email.checkValidity() || !email) return fail(t('req.err.email'), form.email);
  if (form.email_confirm.value.trim().toLowerCase() !== email.toLowerCase()) return fail(t('req.err.match'), form.email_confirm);
  if (!form.consent.checked) return fail(t('req.err.consent'), form.consent);
  if (form.company.value) return; // spam trap

  const payload = {
    name,
    email,
    age_group: form.age_group.value || 'not given',
    hotel: form.hotel.value || '(general enquiry)',
    destination: form.destination.value,
    consent: true,
    language: LANG,
    page: location.href,
  };

  const submit = $('reqSubmit');
  submit.disabled = true;
  try {
    if (FORM_ENDPOINT) {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
    }
    $('reqBody').hidden = true;
    $('reqDone').hidden = false;
  } catch {
    fail(t('req.err.send'));
  } finally {
    submit.disabled = false;
  }
});

// ---------- Draft: typeface comparison ----------
function setType(t) {
  document.documentElement.dataset.type = t;
  document.querySelectorAll('.type-switch button[data-type]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === t)));
  try { localStorage.setItem('thd-type', t); } catch {}
}
document.querySelectorAll('.type-switch button[data-type]').forEach((b) => b.addEventListener('click', () => setType(b.dataset.type)));
$('typeClose').addEventListener('click', () => { document.querySelector('.type-switch').hidden = true; });
try { const t = localStorage.getItem('thd-type'); if (t) setType(t); } catch {}

rollBtn.addEventListener('click', roll);
die.addEventListener('click', roll);
window.addEventListener('hashchange', () => {
  const key = location.hash.slice(1);
  if (key !== current && DESTS[key]) selectDestination(key);
});
function setLang(l) {
  if (!LANGS.includes(l)) return;
  LANG = l;
  try { localStorage.setItem('thd-lang', l); } catch {}
  applyStaticI18n();
  if (current) {
    updateDestTexts();
    if (shown >= 0 && !$('result').hidden) showHotel(shown);
  }
}
document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

applyStaticI18n();
selectDestination(location.hash.slice(1));
