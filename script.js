// One die per destination. Hotel data lives in data/<key>.js and registers
// itself on window.DESTINATIONS.
const ORDER = ['samui', 'phangan', 'bangkok', 'phuket'];
const DESTS = window.DESTINATIONS || {};
const ACTIVITIES = window.ACTIVITIES || {};

// Where "Request this place" submissions are sent. Leave empty for draft
// mode (the form works but nothing is sent). For example a Formspree form:
// 'https://formspree.io/f/xxxxxxx' — it accepts JSON and emails you each request.
const FORM_ENDPOINT = '';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

const monthPrices = (h, d) => d.season.map((f, m) => [MONTHS[m], h.base * f]);
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

  $('rRank').textContent = `Face ${i + 1} of ${d.hotels.length}`;
  $('rName').textContent = h.name;
  $('rArea').textContent = `${h.area}, ${d.name}`;
  $('rRooms').textContent = `approx. ${h.rooms}`;
  $('rCategory').textContent = h.category;
  $('rRestaurant').textContent = h.restaurant ? 'Yes' : 'No';
  $('rAvg').textContent = eur(yearAvg(h, d));

  const stay = tonight();
  const dateLabel = new Date(stay.checkin + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  $('rTonight').textContent = `${dateLabel} → 1 night, 2 adults`;
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
      dieValue.textContent = target + 1;
      die.classList.remove('rolling');
      rollBtn.disabled = false;
      try {
        showHotel(target);
      } finally {
        $('result').hidden = false;
        $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 70);
}

function renderTable(d) {
  const stay = tonight();
  $('hotelTable').replaceChildren(...d.hotels.map((h, i) => {
    const tr = document.createElement('tr');
    [i + 1, h.name, h.area, h.rooms, h.category, h.restaurant ? 'Yes' : 'No', eur(yearAvg(h, d))]
      .forEach((v) => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
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
    return tr;
  }));
}

function selectDestination(key, { scroll = false } = {}) {
  if (!DESTS[key]) key = ORDER.find((k) => DESTS[k]);
  const d = DESTS[key];
  current = key;
  shown = -1;

  document.documentElement.style.setProperty('--accent', d.color);
  document.title = `${d.title} Dice · Thailand Hotel Dice`;
  $('heroTitle').textContent = d.title;
  $('menuCurrent').textContent = `${d.title} Dice`;
  $('heroCta').textContent = `Start with ${d.title} Dice`;
  $('tagline').textContent = `One die. ${d.hotels.length} top hotels in ${d.name}. Roll to find your stay.`;
  $('hint').textContent = `One die with ${d.hotels.length} faces — every face is one hotel.`;
  $('listTitle').textContent = `All ${d.hotels.length} hotels in ${d.name}`;
  dieValue.textContent = '?';
  $('result').hidden = true;
  renderTable(d);

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
    `<span><span class="m-name">${d.title} Dice</span><span class="m-sub">${d.hotels.length} hotels · ${d.name}</span></span>`;
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
  return w >= 900 ? 3 : w >= 560 ? 2 : 1;
}

function nbLayout(animate) {
  const n = nb.items.length;
  if (!n) return;
  nb.perView = nbPerView();
  const gap = 16;
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

function renderNearby(items) {
  nb.items = items;
  $('nearby').hidden = !items.length;
  if (!items.length) return;
  const card = (a) => {
    const el = document.createElement('article');
    el.className = 'nb-card';
    el.innerHTML = '<span class="nb-type"></span><h4 class="nb-name"></h4><p class="nb-info"></p><span class="nb-dist"></span>';
    el.querySelector('.nb-type').textContent = a.type || 'Nearby';
    el.querySelector('.nb-name').textContent = a.name;
    el.querySelector('.nb-info').textContent = a.info;
    el.querySelector('.nb-dist').textContent = `≈ ${Number(a.km).toLocaleString(undefined, { maximumFractionDigits: 1 })} km away`;
    return el;
  };
  nbTrack.replaceChildren(...[...items, ...items, ...items].map(card));
  $('nbDots').replaceChildren(...items.map(() => document.createElement('span')));
  nb.index = items.length;
  requestAnimationFrame(() => nbLayout(false));
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
  $('reqEyebrow').textContent = h ? 'Request this place' : 'Contact';
  $('reqTitle').textContent = h ? h.name : 'Get in touch';
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
  if (!name) return fail('Please enter your name.', form.name);
  if (!form.email.checkValidity() || !email) return fail('Please enter a valid email address.', form.email);
  if (form.email_confirm.value.trim().toLowerCase() !== email.toLowerCase()) return fail('The two email addresses do not match.', form.email_confirm);
  if (!form.consent.checked) return fail('Please confirm that we may notify you by email.', form.consent);
  if (form.company.value) return; // spam trap

  const payload = {
    name,
    email,
    age_group: form.age_group.value || 'not given',
    hotel: form.hotel.value || '(general enquiry)',
    destination: form.destination.value,
    consent: true,
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
    fail('Sorry, the request could not be sent. Please try again in a moment.');
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
selectDestination(location.hash.slice(1));
