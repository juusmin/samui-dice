// Top 20 hotels on Koh Samui. Room counts and prices are rough public estimates.
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
];

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

$('hotelTable').replaceChildren(...hotels.map((h, i) => {
  const tr = document.createElement('tr');
  [i + 1, h.name, h.area, h.rooms, h.category, h.restaurant ? 'Yes' : 'No', eur(yearAvg(h))]
    .forEach((v) => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
  return tr;
}));

rollBtn.addEventListener('click', roll);
die.addEventListener('click', roll);
