# Samui Dice — Thailand Hotel Dice

The page opens with a short introduction. A menu at the top holds the four dice. Pick a destination — **Koh Samui** (21 hotels), **Koh Phangan**, **Bangkok** or **Phuket** (20 each) —
and roll one die to pick a top hotel there. The result shows:

- the approximate number of rooms or villas
- the price category
- whether the hotel has a restaurant
- a rough average price per night for each month, plus the average for the whole year
- buttons that open the hotel's own page on Booking.com and Agoda for tonight (1 night, 2 adults), where the live prices are shown
- the hotel photo (if one exists) on the result and on the Booking.com / Agoda cards, otherwise just the site logos
- a satellite map
- **Nearby:** five activities close to the hotel with one sentence each and an approximate distance, in a compact carousel you can swipe left and right (it loops). Each card shows a freely licensed photo of the place from Wikipedia/Wikimedia (credited and linked), or a plain placeholder if none is found
- **Request this place:** a form (name, email, email confirmation, optional age group, consent) — also reachable via **Contact**

It's plain HTML, CSS and JavaScript with no build step. Each destination's hotels are in
`data/<destination>.js`; `script.js` runs the page. Direct links: `#samui`, `#phangan`, `#bangkok`, `#phuket`.

> All room counts and prices are rough estimates, not live rates.

## Hotel photos

Put a photo for each hotel in `images/`, named after the hotel in lowercase with dashes,
for example `images/hyatt-regency-koh-samui.jpg` or `images/four-seasons-resort-koh-samui.jpg`.
Only use photos you're allowed to publish, such as a hotel's press kit with permission or your own.
A hotel with no photo shows just the Booking.com and Agoda logos.

## Request form

The form runs in draft mode until a form service is connected: set `FORM_ENDPOINT` at the top of
`script.js` (for example a free Formspree form URL). Each request then arrives by email with the hotel,
destination, name, email, age group and consent.

## Draft typeface switch

The small panel at the bottom lets you compare three font pairings (Classic, Editorial, Swiss).
Remove the `.type-switch` block from `index.html` once a pairing is chosen.

## Updating the site

When you change `script.js`, `style.css` or a `data/` file, raise the `?v=` number where `index.html` loads them
so browsers don't keep using an old copy.

## Live site (GitHub Pages)

https://juusmin.github.io/samui-dice/

To turn it on once: open **Settings → Pages**, set **Source** to *Deploy from a branch*,
choose `claude/samui-dice-website-7m14bh` and `/ (root)`, then click **Save**.
