// Bangkok — top 20 hotels. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
// Booking.com / Agoda slugs come from each hotel's real page on those sites.
(window.DESTINATIONS = window.DESTINATIONS || {}).bangkok = {
  name: "Bangkok",
  title: "Bangkok",
  agodaCity: "bangkok-th",
  color: "#8a3b52",
  // Bangkok: cool, busy season Nov–Feb; quieter and cheaper in the rainy months May–Oct.
  season: [1.15, 1.10, 1.05, 1.00, 0.90, 0.90, 0.95, 0.95, 0.90, 0.95, 1.05, 1.20],
  hotels: [
    { name: "Mandarin Oriental, Bangkok", area: "Riverside", rooms: 331, category: "Luxury", restaurant: true, base: 550, booking: "mandarin-oriental-bangkok", agodaSlug: "mandarin-oriental-bangkok_12" },
    { name: "The Peninsula Bangkok", area: "Riverside", rooms: 370, category: "Luxury", restaurant: true, base: 380, booking: "the-peninsula-bangkok", agodaSlug: "the-peninsula-bangkok" },
    { name: "Capella Bangkok", area: "Riverside", rooms: 101, category: "Luxury", restaurant: true, base: 1100, booking: "capella-bangkok", agodaSlug: "capella-bangkok" },
    { name: "Four Seasons Hotel Bangkok at Chao Phraya River", area: "Riverside", rooms: 299, category: "Luxury", restaurant: true, base: 650, booking: "four-seasons-bangkok-at-chao-phraya-river", agodaSlug: "four-seasons-hotel-bangkok-at-chao-praya-river" },
    { name: "Rosewood Bangkok", area: "Ploenchit", rooms: 159, category: "Luxury", restaurant: true, base: 450, booking: "rosewood-bangkok", agodaSlug: "rosewood-bangkok" },
    { name: "The Siam", area: "Dusit", rooms: 39, category: "Luxury", restaurant: true, base: 600, booking: "the-siam", agodaSlug: "the-siam-hotel" },
    { name: "Park Hyatt Bangkok", area: "Ploenchit", rooms: 222, category: "Luxury", restaurant: true, base: 380, booking: "park-hyatt-bangkok", agodaSlug: "park-hyatt-bangkok" },
    { name: "The St. Regis Bangkok", area: "Pathumwan", rooms: 227, category: "Luxury", restaurant: true, base: 300, booking: "the-st-regis-bangkok", agodaSlug: "the-st-regis-bangkok_15" },
    { name: "The Sukhothai Bangkok", area: "Sathorn", rooms: 210, category: "Luxury", restaurant: true, base: 270, booking: "the-sukhothai", agodaSlug: "the-sukhothai-bangkok" },
    { name: "Waldorf Astoria Bangkok", area: "Pathumwan", rooms: 171, category: "Luxury", restaurant: true, base: 330, booking: "waldorf-astoria-bangkok", agodaSlug: "waldorf-astoria-bangkok_4" },
    { name: "Sindhorn Kempinski Hotel Bangkok", area: "Lumphini", rooms: 274, category: "Luxury", restaurant: true, base: 300, booking: "sindhorn-kempinski-bangkok", agodaSlug: "sindhorn-kempinski-bangkok" },
    { name: "137 Pillars Suites Bangkok", area: "Sukhumvit", rooms: 34, category: "Luxury", restaurant: true, base: 330, booking: "137-pillars-suites-bangkok-bangkok2", agodaSlug: "137-pillars-suites-bangkok" },
    { name: "Kimpton Maa-Lai Bangkok", area: "Ploenchit", rooms: 362, category: "Upper upscale", restaurant: true, base: 220, booking: "kimpton-maa-lai-bangkok", agodaSlug: "kimpton-maa-lai-bangkok" },
    { name: "Shangri-La Bangkok", area: "Riverside", rooms: 802, category: "Upper upscale", restaurant: true, base: 190, booking: "shangri-la-bangkok", agodaSlug: "shangri-la-hotel-bangkok" },
    { name: "Banyan Tree Bangkok", area: "Sathorn", rooms: 327, category: "Upper upscale", restaurant: true, base: 190, booking: "banyan-tree-bangkok", agodaSlug: "banyan-tree-bangkok" },
    { name: "Anantara Siam Bangkok Hotel", area: "Pathumwan", rooms: 354, category: "Upper upscale", restaurant: true, base: 220, booking: "anantara-siam-bangkok-hotell", agodaSlug: "anantara-siam-bangkok-hotel" },
    { name: "SO/ Bangkok", area: "Silom", rooms: 237, category: "Upper upscale", restaurant: true, base: 140, booking: "so-sofitel-bangkok", agodaSlug: "so-sofitel-bangkok" },
    { name: "Hyatt Regency Bangkok Sukhumvit", area: "Sukhumvit", rooms: 273, category: "Upper upscale", restaurant: true, base: 140, booking: "hyatt-regency-bangkok-sukhumvit", agodaSlug: "hyatt-regency-bangkok-sukhumvit" },
    { name: "Chatrium Hotel Riverside Bangkok", area: "Riverside", rooms: 396, category: "Upscale", restaurant: true, base: 120, booking: "chatrium-hotel-riverside-bangkok", agodaSlug: "chatrium-hotel-riverside-bangkok" },
    { name: "Avani+ Riverside Bangkok Hotel", area: "Riverside", rooms: 248, category: "Upscale", restaurant: true, base: 110, booking: "avani-riverside-bangkok-bangkok", agodaSlug: "avani-riverside-bangkok-hotel" },
  ],
};
