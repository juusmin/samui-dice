// Top 21 hotels on Koh Samui. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
const hotels = [
  { name: 'Four Seasons Resort Koh Samui',            area: 'Laem Yai',        rooms: 74,  category: 'Luxury',        restaurant: true, base: 900, booking: 'four-seasons-resort-koh-samui', agoda: 'four-seasons-resort-koh-samui-thailand' },
  { name: 'Six Senses Samui',                         area: 'Choeng Mon',      rooms: 66,  category: 'Luxury',        restaurant: true, base: 600, booking: 'six-senses-hideaway-samui-a-sala-property', agoda: 'six-senses-samui' },
  { name: 'The Ritz-Carlton, Koh Samui',              area: 'Choeng Mon',      rooms: 175, category: 'Luxury',        restaurant: true, base: 600, booking: 'the-ritz-carlton-koh-samui', agoda: 'the-ritz-carlton-koh-samui' },
  { name: 'Banyan Tree Samui',                        area: 'Lamai',           rooms: 88,  category: 'Luxury',        restaurant: true, base: 550, booking: 'banyan-tree-samui', agoda: 'banyan-tree-samui' },
  { name: 'Conrad Koh Samui',                         area: 'Taling Ngam',     rooms: 81,  category: 'Luxury',        restaurant: true, base: 500, booking: 'conrad-koh-samui', agoda: 'conrad-koh-samui' },
  { name: 'W Koh Samui',                              area: 'Mae Nam',         rooms: 75,  category: 'Luxury',        restaurant: true, base: 450, booking: 'w-retreat-koh-samui', agoda: 'w-koh-samui' },
  { name: 'Vana Belle, a Luxury Collection Resort',   area: 'Chaweng Noi',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350, booking: 'vana-belle-a-luxury-collection-resort-koh-samui', agoda: 'vana-belle-a-luxury-collection-resort-koh-samui' },
  { name: 'InterContinental Koh Samui Resort',        area: 'Taling Ngam',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350, booking: 'intercontinental-samui-baan-taling-ngam-resort', agoda: 'intercontinental-koh-samui-resort' },
  { name: 'Garrya Tongsai Bay Samui',                 area: 'Choeng Mon',      rooms: 83,  category: 'Upper upscale', restaurant: true, base: 350, booking: 'the-tongsai-bay', agoda: 'the-tongsai-bay-hotel' },
  { name: 'Santiburi Koh Samui',                      area: 'Mae Nam',         rooms: 96,  category: 'Upper upscale', restaurant: true, base: 300, booking: 'santiburi-beach-resort-golf-and-spa', agoda: 'santiburi-beach-resort-golf-spa' },
  { name: 'Kimpton Kitalay Samui',                    area: 'Choeng Mon',      rooms: 138, category: 'Upper upscale', restaurant: true, base: 300, booking: 'kimpton-kitalay-samui-an-ihg', agoda: 'kimpton-kitalay-samui' },
  { name: 'Melati Beach Resort & Spa',                area: 'Choeng Mon',      rooms: 77,  category: 'Upscale',       restaurant: true, base: 250, booking: 'melati-beach-resort-spa', agoda: 'melati-beach-resort-spa' },
  { name: 'SALA Samui Chaweng Beach Resort',          area: 'Chaweng',         rooms: 69,  category: 'Upscale',       restaurant: true, base: 220, booking: 'sala-samui-chaweng-beach-resort-samui', agoda: 'sala-samui-chaweng-beach' },
  { name: 'Silavadee Pool Spa Resort',                area: 'Lamai',           rooms: 80,  category: 'Upscale',       restaurant: true, base: 200, booking: 'silavadee-pool-spa-resort', agoda: 'silavadee-pool-spa-resort' },
  { name: 'Anantara Bophut Koh Samui Resort',         area: 'Bophut',          rooms: 106, category: 'Upscale',       restaurant: true, base: 200, booking: 'anantara-resort-koh-samui', agoda: 'anantara-bophut-koh-samui-resort' },
  { name: 'Hansar Samui Resort & Spa',                area: 'Bophut',          rooms: 74,  category: 'Upscale',       restaurant: true, base: 200, booking: 'hansar-samui-resort-spa', agoda: 'hansar-samui-resort' },
  { name: "Rocky's Boutique Resort",                  area: 'Lamai',           rooms: 58,  category: 'Upscale',       restaurant: true, base: 200, booking: 'rockysboutiqueresort', agoda: 'rocky-s-boutique-resort' },
  { name: 'Centara Reserve Samui',                     area: 'Chaweng',         rooms: 203, category: 'Luxury',        restaurant: true, base: 250, booking: 'grand-beach-resort-samui', agoda: 'centara-reserve-samui' },
  { name: 'Nora Buri Resort & Spa',                   area: 'Chaweng Noi',     rooms: 118, category: 'Mid-range',     restaurant: true, base: 140, booking: 'nora-buri-resort-spa', agoda: 'nora-buri-resort-spa' },
  { name: 'Amari Koh Samui',                          area: 'Chaweng',         rooms: 197, category: 'Mid-range',     restaurant: true, base: 120, booking: 'amari-palm-reef-resort', agoda: 'amari-koh-samui' },
  { name: 'Hyatt Regency Koh Samui',                  area: 'Chaweng',         rooms: 140, category: 'Upscale',       restaurant: true, base: 160, booking: 'hyatt-regency-koh-samui', agoda: 'hyatt-regency-koh-samui' },
];

const slug = (name) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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

function agodaUrl(h, { checkin }) {
  const q = new URLSearchParams({ checkIn: checkin, los: 1, adults: 2, children: 0, rooms: 1 });
  return `https://www.agoda.com/${h.agoda}/hotel/koh-samui-th.html?${q}`;
}

// Seasonal factors: peak around Christmas/New Year, high season Jan–Apr and
// Jul–Aug, cheapest in the rainy months Oct–Nov.
const months = [
  ['Jan', 1.20], ['Feb', 1.20], ['Mar', 1.10], ['Apr', 1.10],
  ['May', 0.85], ['Jun', 0.90], ['Jul', 1.05], ['Aug', 1.10],
  ['Sep', 0.85], ['Oct', 0.75], ['Nov', 0.75], ['Dec', 1.30],
];

const eur = (v) => '€' + Math.round(v / 5) * 5;
const monthPrices = (h) => months.map(([m, f]) => [m, h.base * f]);
const yearAvg = (h) => monthPrices(h).reduce((s, [, p]) => s + p, 0) / months.length;

const $ = (id) => document.getElementById(id);
const die = $('die');
const dieValue = $('dieValue');
const rollBtn = $('roll');

let shown = -1;

function showHotel(i) {
  const h = hotels[i];
  shown = i;
  $('rRank').textContent = `Face ${i + 1} of ${hotels.length}`;
  $('rName').textContent = h.name;
  $('rArea').textContent = h.area + ', Koh Samui';
  $('rRooms').textContent = `approx. ${h.rooms}`;
  $('rCategory').textContent = h.category;
  $('rRestaurant').textContent = h.restaurant ? 'Yes' : 'No';
  $('rAvg').textContent = eur(yearAvg(h));

  const stay = tonight();
  const dateLabel = new Date(stay.checkin + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  $('rTonight').textContent = `${dateLabel} → 1 night, 2 adults`;
  $('rBooking').href = bookingUrl(h, stay);
  $('rAgoda').href = agodaUrl(h, stay);

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
  probe.onload = () => { if (shown === i) setPhoto(true); };
  probe.src = src;
  $('rMap').src = `https://maps.google.com/maps?q=${encodeURIComponent(h.name + ', Koh Samui, Thailand')}&t=k&z=16&output=embed`;

  const prices = monthPrices(h);
  const max = Math.max(...prices.map(([, p]) => p));
  $('rMonths').replaceChildren(...prices.map(([m, p]) => {
    const cell = document.createElement('div');
    cell.className = 'month';
    cell.innerHTML = `<span class="bar" style="height:${Math.round((p / max) * 70)}%"></span>` +
      `<strong>${eur(p)}</strong><span>${m}</span>`;
    return cell;
  }));

  document.querySelectorAll('#hotelTable tr').forEach((tr, j) => tr.classList.toggle('picked', j === i));
  $('result').hidden = false;
}

function roll() {
  if (rollBtn.disabled) return;
  const target = Math.floor(Math.random() * hotels.length);
  rollBtn.disabled = true;
  die.classList.add('rolling');

  let ticks = 0;
  const timer = setInterval(() => {
    dieValue.textContent = Math.floor(Math.random() * hotels.length) + 1;
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

const stayForTable = tonight();
$('hotelTable').replaceChildren(...hotels.map((h, i) => {
  const tr = document.createElement('tr');
  [i + 1, h.name, h.area, h.rooms, h.category, h.restaurant ? 'Yes' : 'No', eur(yearAvg(h))]
    .forEach((v) => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
  const links = document.createElement('td');
  links.className = 'links';
  [['Booking', bookingUrl(h, stayForTable)], ['Agoda', agodaUrl(h, stayForTable)]].forEach(([label, href]) => {
    const a = document.createElement('a');
    Object.assign(a, { href, textContent: label, target: '_blank', rel: 'noopener' });
    a.className = label.toLowerCase();
    links.append(a);
  });
  tr.append(links);
  return tr;
}));

rollBtn.addEventListener('click', roll);
die.addEventListener('click', roll);
