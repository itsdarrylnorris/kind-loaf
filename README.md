# Simply Kind Loaf

Weekly menu and order page. Customers pick items, see the total, and send the order to the bakery on WhatsApp. Ordering locks automatically after the deadline.

## Every week (5 minutes)
Open `menu.js` and change:
1. `week`: the label in English and Spanish.
2. `deadline`: for example `"2026-11-27T20:00:00-06:00"` means Friday Nov 27 at 8pm Central.
   Use `-06:00` from November to mid March and `-05:00` from mid March to November (daylight time).
3. `active: true/false` to show or hide items. Change `price` if needed.
4. Check the allergen `tags` and the `bundles` at the bottom of the file.

Then save and push (or edit the file directly on github.com and click "Commit changes").
The site updates in about a minute.

## Before going live
- In `menu.js`, set `whatsapp` to the bakery's real number (digits only, starting with 1 for US).
- Replace the placeholder prices.

## Adding a new photo
```sh
./compress.sh ~/Desktop/new-photo.jpeg new-item
```
This creates `img/new-item-480.webp`, `img/new-item-960.webp` and `img/new-item-480.jpg`, each well under 100 KB.
The script prints the width and height. In `menu.js`, add an item with `img: "new-item"` and those numbers as `w` and `h`.

## Files
- `index.html`: page layout and styles
- `menu.js`: this week's menu (the only file you edit weekly)
- `app.js`: cart, language switch, deadline lock, WhatsApp message
- `img/`: compressed photos

## Preview locally
```sh
python3 -m http.server 8765
```
Then open http://localhost:8765

## Note
The deadline lock runs in the visitor's browser. Each WhatsApp order includes the time it was sent, so a late order is easy to spot.
