// Koh Phangan — top 20 hotels. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
// Booking.com / Agoda slugs come from each hotel's real page on those sites.
(window.DESTINATIONS = window.DESTINATIONS || {}).phangan = {
  name: "Koh Phangan",
  title: "Phangan",
  agodaCity: "koh-phangan-th",
  color: "#12a38a",
  // Gulf of Thailand: peak at Christmas, high Jan–Apr and Jul–Aug, rainy Oct–Nov.
  season: [1.20, 1.20, 1.10, 1.10, 0.85, 0.90, 1.05, 1.10, 0.85, 0.75, 0.75, 1.30],
  hotels: [
    { name: "Anantara Rasananda Koh Phangan Villas", area: "Thong Nai Pan Noi", rooms: 64, category: "Luxury", restaurant: true, base: 420, booking: "rasananda", agodaSlug: "anantara-rasananda-koh-phangan-villas" },
    { name: "Kupu Kupu Phangan Beach Villas & Spa", area: "Nai Wok (Thong Sala)", rooms: 37, category: "Luxury", restaurant: true, base: 300, booking: "kupu-kupu-koh-phangan", agodaSlug: "kupu-kupu-phangan-beach-villas-spa-by-l-occitane" },
    { name: "Santhiya Koh Phangan Resort & Spa", area: "Thong Nai Pan Noi", rooms: 99, category: "Upper upscale", restaurant: true, base: 170, booking: "santhiya-resort-and-spa", agodaSlug: "santhiya-koh-phangan-resort-spa" },
    { name: "Panviman Resort Koh Phangan", area: "Thong Nai Pan Noi", rooms: 80, category: "Upper upscale", restaurant: true, base: 150, booking: "panviman-koh-phangan", agodaSlug: "panviman-resort-koh-phangan" },
    { name: "Explorar Koh Phangan - Adults Only Resort and Spa", area: "Ban Tai / Haad Rin Nai", rooms: 72, category: "Upper upscale", restaurant: true, base: 150, booking: "the-coast-resort-koh-phangan", agodaSlug: "the-coast-resort-koh-phangan_7" },
    { name: "Buri Rasa Village Phangan", area: "Thong Nai Pan Noi", rooms: 63, category: "Upscale", restaurant: true, base: 150, booking: "buri-rasa-koh-phangan", agodaSlug: "buri-rasa-koh-phangan" },
    { name: "Cocohut Beach Resort Koh Phangan", area: "Haad Rin (Leela Beach)", rooms: 120, category: "Upscale", restaurant: true, base: 110, booking: "cocohut-village-beach-resort-spa", agodaSlug: "cocohut-village-beach-resort-spa" },
    { name: "Salad Beach Resort", area: "Haad Salad", rooms: 54, category: "Upscale", restaurant: true, base: 120, booking: "salad-beach-resort", agodaSlug: "salad-beach-resort" },
    { name: "Amara Beach Resort Koh Phangan", area: "Haad Yao", rooms: 21, category: "Upscale", restaurant: true, base: 140, booking: "amara-beach-resort-koh-phangan", agodaSlug: "amara-beach-resort-koh-phangan", agodaCity: "ko-pangan-th" },
    { name: "Villa Cha-Cha Salad Beach Koh Phangan", area: "Haad Salad", rooms: 64, category: "Upscale", restaurant: true, base: 110, booking: "villa-cha-cha-koh-phangan", agodaSlug: "villa-cha-cha-salad-beach-koh-phangan" },
    { name: "The Hideaway Pariya Haad Yuan Ko Pha-ngan", area: "Haad Yuan", rooms: 40, category: "Upscale", restaurant: true, base: 110, booking: "centara-pariya-resort-villas-koh-pha-ngan", agodaSlug: "pariya-haad-yuan-resort-koh-phangan" },
    { name: "Phangan Bayshore Resort Koh Phangan", area: "Haad Rin (Sunrise Beach)", rooms: 80, category: "Upscale", restaurant: true, base: 100, booking: "phangan-bayshore-resort", agodaSlug: "phangan-bayshore-resort" },
    { name: "Haadson Resort & Koh Raham", area: "Haad Son (Secret Beach)", rooms: 57, category: "Mid-range", restaurant: true, base: 90, booking: "haad-son-resort", agodaSlug: "haad-son-resort" },
    { name: "Sarikantang Resort & Spa", area: "Haad Rin (Leela Beach)", rooms: 49, category: "Mid-range", restaurant: true, base: 80, booking: "sarikantang-resort-and-spa", agodaSlug: "sarikantang-resort-spa" },
    { name: "Salad Hut", area: "Haad Salad", rooms: 12, category: "Mid-range", restaurant: true, base: 90, booking: "salad-hut", agodaSlug: "salad-hut-resort" },
    { name: "Phangan Cove Beach Resort", area: "Srithanu", rooms: 30, category: "Mid-range", restaurant: true, base: 90, booking: "phangan-cove-resort-amp-restaurant-koh-phangang", agodaSlug: "phangan-cove-resort" },
    { name: "Milky Bay Resort", area: "Ban Tai", rooms: 39, category: "Mid-range", restaurant: true, base: 75, booking: "milky-bay-resort", agodaSlug: "milky-bay-resort" },
    { name: "Longtail Beach Resort", area: "Thong Nai Pan Yai", rooms: 33, category: "Mid-range", restaurant: true, base: 70, booking: "longtail-beach-resort", agodaSlug: "longtail-beach-resort" },
    { name: "Loyfa-Holina Natural Resort", area: "Srithanu", rooms: 40, category: "Mid-range", restaurant: true, base: 60, booking: "loyfa-natural-resort", agodaSlug: "loyfa-natural-resort" },
    { name: "Rin Beach Resort", area: "Haad Rin (Haad Rin Nai)", rooms: 72, category: "Mid-range", restaurant: true, base: 55, booking: "rin-beach-resort", agodaSlug: "rin-beach-resort" },
  ],
};
