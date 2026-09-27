// Phuket — top 20 hotels. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
// Booking.com / Agoda slugs come from each hotel's real page on those sites.
(window.DESTINATIONS = window.DESTINATIONS || {}).phuket = {
  name: "Phuket",
  title: "Phuket",
  agodaCity: "phuket-th",
  color: "#2f5d8a",
  // Andaman Sea: high season Nov–Apr with a Christmas peak; monsoon low season May–Oct.
  season: [1.30, 1.30, 1.20, 1.05, 0.75, 0.70, 0.80, 0.80, 0.70, 0.75, 1.05, 1.40],
  hotels: [
    { name: "Amanpuri", area: "Surin (Pansea)", rooms: 70, category: "Luxury", restaurant: true, base: 1100, booking: "amanpuri", agodaSlug: "amanpuri-phuket" },
    { name: "Trisara", area: "Nai Thon", rooms: 48, category: "Luxury", restaurant: true, base: 850, booking: "trisara", agodaSlug: "trisara-phuket-villas-residences" },
    { name: "Rosewood Phuket", area: "Patong (Emerald Bay)", rooms: 71, category: "Luxury", restaurant: true, base: 800, booking: "rosewood-phuket", agodaSlug: "rosewood-phuket_3" },
    { name: "Banyan Tree Phuket", area: "Bang Tao", rooms: 173, category: "Luxury", restaurant: true, base: 550, booking: "banyan-tree-phuket", agodaSlug: "banyan-tree-phuket" },
    { name: "Keemala", area: "Kamala", rooms: 38, category: "Luxury", restaurant: true, base: 600, booking: "keemala", agodaSlug: "keemala" },
    { name: "The Surin Phuket", area: "Surin (Pansea)", rooms: 103, category: "Upper upscale", restaurant: true, base: 250, booking: "the-surin-phuket", agodaSlug: "the-surin-phuket" },
    { name: "Sri Panwa Phuket", area: "Cape Panwa", rooms: 90, category: "Luxury", restaurant: true, base: 450, booking: "sri-panwa-phuket", agodaSlug: "sri-panwa-phuket-luxury-pool-villa-hotel" },
    { name: "Anantara Layan Phuket Resort", area: "Layan", rooms: 92, category: "Luxury", restaurant: true, base: 450, booking: "anantara-phuket-layan-resort-and-spa", agodaSlug: "anantara-layan-phuket-resort" },
    { name: "Kata Rocks", area: "Kata", rooms: 34, category: "Luxury", restaurant: true, base: 600, booking: "kata-rocks", agodaSlug: "kata-rocks" },
    { name: "The Shore at Katathani (Adults Only)", area: "Kata Noi", rooms: 81, category: "Luxury", restaurant: true, base: 400, booking: "the-shore-at-katathani", agodaSlug: "the-shore-at-katathani-adults-only" },
    { name: "Katathani Phuket Beach Resort", area: "Kata Noi", rooms: 479, category: "Upscale", restaurant: true, base: 170, booking: "katathani-phuket-beach-resort", agodaSlug: "katathani-phuket-beach-resort" },
    { name: "Twinpalms Surin Beach Phuket", area: "Surin", rooms: 97, category: "Upper upscale", restaurant: true, base: 220, booking: "twinpalms-phuket", agodaSlug: "twinpalms-phuket-hotel" },
    { name: "InterContinental Phuket Resort", area: "Kamala", rooms: 221, category: "Upper upscale", restaurant: true, base: 280, booking: "intercontinental-hotels-phuket-resort", agodaSlug: "intercontinental-phuket-resort" },
    { name: "COMO Point Yamu, Phuket", area: "Cape Yamu", rooms: 106, category: "Luxury", restaurant: true, base: 350, booking: "point-yamu-by-como", agodaSlug: "como-point-yamu-phuket" },
    { name: "JW Marriott Phuket Resort & Spa", area: "Mai Khao", rooms: 265, category: "Upper upscale", restaurant: true, base: 300, booking: "jw-marriott-phuket-resort-and-spa", agodaSlug: "jw-marriott-phuket-resort-spa" },
    { name: "Pullman Phuket Panwa Beach Resort", area: "Cape Panwa", rooms: 190, category: "Upscale", restaurant: true, base: 150, booking: "pullman-phuket-panwa-beach", agodaSlug: "pullman-phuket-panwa-beach-resort" },
    { name: "The Nai Harn", area: "Nai Harn", rooms: 120, category: "Upper upscale", restaurant: true, base: 260, booking: "the-nai-harn", agodaSlug: "the-nai-harn" },
    { name: "Hyatt Regency Phuket Resort", area: "Kamala", rooms: 201, category: "Upper upscale", restaurant: true, base: 180, booking: "hyatt-regency-phuket-resort", agodaSlug: "hyatt-regency-phuket-resort" },
    { name: "Holiday Inn Resort Phuket", area: "Patong", rooms: 400, category: "Mid-range", restaurant: true, base: 110, booking: "holiday-inn-resort-phuket", agodaSlug: "holiday-inn-resort-phuket" },
    { name: "Avista Hideaway Phuket Patong - MGallery", area: "Patong", rooms: 171, category: "Upscale", restaurant: true, base: 130, booking: "avista-hideaway-resort-amp-spa-phuket", agodaSlug: "avista-hideaway-phuket-patong-mgallery-by-sofitel" },
  ],
};
