// Top 21 hotels on Koh Samui. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
const hotels = [
  { name: 'Four Seasons Resort Koh Samui',            area: 'Laem Yai',        rooms: 74,  category: 'Luxury',        restaurant: true, base: 900 },
  { name: 'Six Senses Samui',                         area: 'Choeng Mon',      rooms: 66,  category: 'Luxury',        restaurant: true, base: 600 },
  { name: 'The Ritz-Carlton, Koh Samui',              area: 'Choeng Mon',      rooms: 175, category: 'Luxury',        restaurant: true, base: 600 },
  { name: 'Banyan Tree Samui',                        area: 'Lamai',           rooms: 88,  category: 'Luxury',        restaurant: true, base: 550 },
  { name: 'Conrad Koh Samui',                         area: 'Taling Ngam',     rooms: 81,  category: 'Luxury',        restaurant: true, base: 500 },
  { name: 'W Koh Samui',                              area: 'Mae Nam',         rooms: 75,  category: 'Luxury',        restaurant: true, base: 450 },
  { name: 'Vana Belle, a Luxury Collection Resort',   area: 'Chaweng Noi',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350 },
  { name: 'InterContinental Koh Samui Resort',        area: 'Taling Ngam',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350 },
  { name: 'Garrya Tongsai Bay Samui',                 area: 'Choeng Mon',      rooms: 83,  category: 'Upper upscale', restaurant: true, base: 350 },
  { name: 'Santiburi Koh Samui',                      area: 'Mae Nam',         rooms: 96,  category: 'Upper upscale', restaurant: true, base: 300 },
  { name: 'Kimpton Kitalay Samui',                    area: 'Choeng Mon',      rooms: 138, category: 'Upper upscale', restaurant: true, base: 300 },
  { name: 'Melati Beach Resort & Spa',                area: 'Choeng Mon',      rooms: 77,  category: 'Upscale',       restaurant: true, base: 250 },
  { name: 'SALA Samui Chaweng Beach Resort',          area: 'Chaweng',         rooms: 69,  category: 'Upscale',       restaurant: true, base: 220 },
  { name: 'Silavadee Pool Spa Resort',                area: 'Lamai',           rooms: 80,  category: 'Upscale',       restaurant: true, base: 200 },
  { name: 'Anantara Bophut Koh Samui Resort',         area: 'Bophut',          rooms: 106, category: 'Upscale',       restaurant: true, base: 200 },
  { name: 'Hansar Samui Resort & Spa',                area: 'Bophut',          rooms: 74,  category: 'Upscale',       restaurant: true, base: 200 },
  { name: "Rocky's Boutique Resort",                  area: 'Lamai',           rooms: 58,  category: 'Upscale',       restaurant: true, base: 200 },
  { name: 'Centara Grand Beach Resort Samui',         area: 'Chaweng',         rooms: 203, category: 'Upscale',       restaurant: true, base: 180 },
  { name: 'Nora Buri Resort & Spa',                   area: 'Chaweng Noi',     rooms: 118, category: 'Mid-range',     restaurant: true, base: 140 },
  { name: 'Amari Koh Samui',                          area: 'Chaweng',         rooms: 197, category: 'Mid-range',     restaurant: true, base: 120 },
  { name: 'Hyatt Regency Koh Samui',                  area: 'Bophut',          rooms: 140, category: 'Upscale',       restaurant: true, base: 160 },
];

// Fallback photo (free licence, Wikimedia Commons) used when a hotel has no
// photo in images/<slug>.jpg.
const FALLBACK_PHOTO = 'https://commons.wikimedia.org/wiki/Special:FilePath/Koh_Samui_banner.jpg?width=1200';
const FALLBACK_CREDIT = 'https://commons.wikimedia.org/wiki/File:Koh_Samui_banner.jpg';

const slug = (name) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Tonight's stay in the visitor's local time zone: check in today, check out tomorrow.
function tonight() {
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return { checkin: iso(today), checkout: iso(tomorrow), month: today.getMonth() };
}

const searchText = (h) => /samui/i.test(h.name) ? h.name : `${h.name}, Koh Samui`;

function bookingUrl(h, { checkin, checkout }) {
  const q = new URLSearchParams({
    ss: searchText(h), checkin, checkout,
    group_adults: 2, group_children: 0, no_rooms: 1, order: 'price',
  });
  return `https://www.booking.com/searchresults.html?${q}`;
}

function agodaUrl(h, { checkin, checkout }) {
  const q = new URLSearchParams({
    textToSearch: searchText(h), checkIn: checkin, checkOut: checkout,
    rooms: 1, adults: 2, children: 0, sort: 'priceLowToHigh',
  });
  return `https://www.agoda.com/search?${q}`;
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

function showHotel(i) {
  const h = hotels[i];
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
  $('rTonightEst').textContent = eur(h.base * months[stay.month][1]);
  $('rBooking').href = bookingUrl(h, stay);
  $('rAgoda').href = agodaUrl(h, stay);

  const photo = $('rPhoto');
  photo.alt = h.name;
  photo.onerror = () => {
    photo.onerror = null;
    photo.src = FALLBACK_PHOTO;
    photo.alt = 'Beach on Koh Samui';
    $('rPhotoCredit').innerHTML = `Island photo — <a href="${FALLBACK_CREDIT}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
  };
  $('rPhotoCredit').textContent = '';
  photo.src = `images/${slug(h.name)}.jpg`;
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
      showHotel(target);
      $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
