// Koh Samui — top 21 hotels. Room counts and prices are rough public estimates.
// `base` is the approximate year-round average price per night in EUR.
// Booking.com / Agoda slugs come from each hotel's real page on those sites.
(window.DESTINATIONS = window.DESTINATIONS || {}).samui = {
  name: 'Koh Samui',
  title: 'Samui',
  agodaCity: 'koh-samui-th',
  color: '#b5653f',
  // Gulf of Thailand: peak at Christmas, high Jan–Apr and Jul–Aug, rainy Oct–Nov.
  season: [1.20, 1.20, 1.10, 1.10, 0.85, 0.90, 1.05, 1.10, 0.85, 0.75, 0.75, 1.30],
  hotels: [
  { name: 'Four Seasons Resort Koh Samui',            area: 'Laem Yai',        rooms: 74,  category: 'Luxury',        restaurant: true, base: 900, booking: 'four-seasons-resort-koh-samui', agodaSlug: 'four-seasons-resort-koh-samui-thailand' },
  { name: 'Six Senses Samui',                         area: 'Choeng Mon',      rooms: 66,  category: 'Luxury',        restaurant: true, base: 600, booking: 'six-senses-hideaway-samui-a-sala-property', agodaSlug: 'six-senses-samui' },
  { name: 'The Ritz-Carlton, Koh Samui',              area: 'Choeng Mon',      rooms: 175, category: 'Luxury',        restaurant: true, base: 600, booking: 'the-ritz-carlton-koh-samui', agodaSlug: 'the-ritz-carlton-koh-samui' },
  { name: 'Banyan Tree Samui',                        area: 'Lamai',           rooms: 88,  category: 'Luxury',        restaurant: true, base: 550, booking: 'banyan-tree-samui', agodaSlug: 'banyan-tree-samui' },
  { name: 'Conrad Koh Samui',                         area: 'Taling Ngam',     rooms: 81,  category: 'Luxury',        restaurant: true, base: 500, booking: 'conrad-koh-samui', agodaSlug: 'conrad-koh-samui' },
  { name: 'W Koh Samui',                              area: 'Mae Nam',         rooms: 75,  category: 'Luxury',        restaurant: true, base: 450, booking: 'w-retreat-koh-samui', agodaSlug: 'w-koh-samui' },
  { name: 'Vana Belle, a Luxury Collection Resort',   area: 'Chaweng Noi',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350, booking: 'vana-belle-a-luxury-collection-resort-koh-samui', agodaSlug: 'vana-belle-a-luxury-collection-resort-koh-samui' },
  { name: 'InterContinental Koh Samui Resort',        area: 'Taling Ngam',     rooms: 79,  category: 'Luxury',        restaurant: true, base: 350, booking: 'intercontinental-samui-baan-taling-ngam-resort', agodaSlug: 'intercontinental-koh-samui-resort' },
  { name: 'Garrya Tongsai Bay Samui',                 area: 'Choeng Mon',      rooms: 83,  category: 'Upper upscale', restaurant: true, base: 350, booking: 'the-tongsai-bay', agodaSlug: 'the-tongsai-bay-hotel' },
  { name: 'Santiburi Koh Samui',                      area: 'Mae Nam',         rooms: 96,  category: 'Upper upscale', restaurant: true, base: 300, booking: 'santiburi-beach-resort-golf-and-spa', agodaSlug: 'santiburi-beach-resort-golf-spa' },
  { name: 'Kimpton Kitalay Samui',                    area: 'Choeng Mon',      rooms: 138, category: 'Upper upscale', restaurant: true, base: 300, booking: 'kimpton-kitalay-samui-an-ihg', agodaSlug: 'kimpton-kitalay-samui' },
  { name: 'Melati Beach Resort & Spa',                area: 'Choeng Mon',      rooms: 77,  category: 'Upscale',       restaurant: true, base: 250, booking: 'melati-beach-resort-spa', agodaSlug: 'melati-beach-resort-spa' },
  { name: 'SALA Samui Chaweng Beach Resort',          area: 'Chaweng',         rooms: 69,  category: 'Upscale',       restaurant: true, base: 220, booking: 'sala-samui-chaweng-beach-resort-samui', agodaSlug: 'sala-samui-chaweng-beach' },
  { name: 'Silavadee Pool Spa Resort',                area: 'Lamai',           rooms: 80,  category: 'Upscale',       restaurant: true, base: 200, booking: 'silavadee-pool-spa-resort', agodaSlug: 'silavadee-pool-spa-resort' },
  { name: 'Anantara Bophut Koh Samui Resort',         area: 'Bophut',          rooms: 106, category: 'Upscale',       restaurant: true, base: 200, booking: 'anantara-resort-koh-samui', agodaSlug: 'anantara-bophut-koh-samui-resort' },
  { name: 'Hansar Samui Resort & Spa',                area: 'Bophut',          rooms: 74,  category: 'Upscale',       restaurant: true, base: 200, booking: 'hansar-samui-resort-spa', agodaSlug: 'hansar-samui-resort' },
  { name: "Rocky's Boutique Resort",                  area: 'Lamai',           rooms: 58,  category: 'Upscale',       restaurant: true, base: 200, booking: 'rockysboutiqueresort', agodaSlug: 'rocky-s-boutique-resort' },
  { name: 'Centara Reserve Samui',                     area: 'Chaweng',         rooms: 203, category: 'Luxury',        restaurant: true, base: 250, booking: 'grand-beach-resort-samui', agodaSlug: 'centara-reserve-samui' },
  { name: 'Nora Buri Resort & Spa',                   area: 'Chaweng',         rooms: 118, category: 'Mid-range',     restaurant: true, base: 140, booking: 'nora-buri-resort-spa', agodaSlug: 'nora-buri-resort-spa' },
  { name: 'Amari Koh Samui',                          area: 'Chaweng',         rooms: 197, category: 'Mid-range',     restaurant: true, base: 120, booking: 'amari-palm-reef-resort', agodaSlug: 'amari-koh-samui' },
  { name: 'Hyatt Regency Koh Samui',                  area: 'Chaweng',         rooms: 140, category: 'Upscale',       restaurant: true, base: 160, booking: 'hyatt-regency-koh-samui', agodaSlug: 'hyatt-regency-koh-samui' },
],
};
