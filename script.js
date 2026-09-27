// One die per destination. Hotel data lives in data/<key>.js and registers
// itself on window.DESTINATIONS.
const ORDER = ['samui', 'phangan', 'bangkok', 'phuket'];
const DESTS = window.DESTINATIONS || {};
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
  $('rMonths').replaceChildren(...prices.map(([m, p]) => {
    const cell = document.createElement('div');
    cell.className = 'month';
    cell.innerHTML = `<span class="bar" style="height:${Math.round((p / max) * 70)}%"></span>` +
      `<strong>${eur(p)}</strong><span>${m}</span>`;
    return cell;
  }));

  document.querySelectorAll('#hotelTable tr').forEach((tr, j) => tr.classList.toggle('picked', j === i));
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
  document.title = `${d.title} Dice`;
  $('heroTitle').textContent = d.title;
  $('tagline').textContent = `One die. ${d.hotels.length} top hotels in ${d.name}. Roll to find your stay.`;
  $('hint').textContent = `One die with ${d.hotels.length} faces — every face is one hotel.`;
  $('listTitle').textContent = `All ${d.hotels.length} hotels in ${d.name}`;
  $('footerName').textContent = `${d.title} Dice`;
  dieValue.textContent = '?';
  $('result').hidden = true;
  renderTable(d);

  document.querySelectorAll('.dest').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.key === key)));
  if (location.hash.slice(1) !== key) history.replaceState(null, '', `#${key}`);
  if (scroll) $('play').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Destination picker cards.
$('destList').replaceChildren(...ORDER.filter((k) => DESTS[k]).map((k) => {
  const d = DESTS[k];
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'dest';
  b.dataset.key = k;
  b.style.setProperty('--c', d.color);
  b.innerHTML = `<span class="dest-die" aria-hidden="true">${d.hotels.length}</span>` +
    `<span class="dest-name">${d.title} Dice</span><span class="dest-sub">${d.hotels.length} hotels · ${d.name}</span>`;
  b.addEventListener('click', () => selectDestination(k, { scroll: true }));
  return b;
}));

rollBtn.addEventListener('click', roll);
die.addEventListener('click', roll);
window.addEventListener('hashchange', () => {
  const key = location.hash.slice(1);
  if (key !== current && DESTS[key]) selectDestination(key);
});
selectDestination(location.hash.slice(1));
