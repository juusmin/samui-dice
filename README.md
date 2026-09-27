# Samui Dice

Roll one die to pick one of the top 21 hotels on Koh Samui. The result shows:

- the approximate number of rooms or villas
- the price category
- whether the hotel has a restaurant
- a rough average price per night for each month, plus the average for the whole year
- buttons that open the hotel's own page on Booking.com and Agoda for tonight (1 night, 2 adults), where the live prices are shown
- a hotel photo and a satellite map

It's plain HTML, CSS and JavaScript with no build step. The hotel data is in `script.js`.

> All room counts and prices are rough estimates, not live rates.

## Hotel photos

Put a photo for each hotel in `images/`, named after the hotel in lowercase with dashes,
for example `images/hyatt-regency-koh-samui.jpg` or `images/four-seasons-resort-koh-samui.jpg`.
Only use photos you're allowed to publish, such as a hotel's press kit with permission or your own.
A hotel with no photo shows a free Koh Samui beach photo from Wikimedia Commons instead.

## Live site (GitHub Pages)

https://juusmin.github.io/samui-dice/

To turn it on once: open **Settings → Pages**, set **Source** to *Deploy from a branch*,
choose `claude/samui-dice-website-7m14bh` and `/ (root)`, then click **Save**.
