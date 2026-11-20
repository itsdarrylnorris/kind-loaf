# Simply Kind Loaf

Weekly menu and order page. Customers pick items, see the total, and send the order to the bakery on WhatsApp. Ordering locks automatically after the deadline.

Live: https://itsdarrylnorris.github.io/kind-loaf/

## Every week (5 minutes)
Open `menu.js` and change:
1. `week`: the label in English and Spanish.
2. `deadline`: for example `"2026-11-27T20:00:00-06:00"` means Friday Nov 27 at 8pm Central.
   Use `-06:00` from November to mid March and `-05:00` from mid March to November (daylight time).
3. `active: true/false` to show or hide items. Change `price` if needed.
4. Check the allergen `tags` and the `bundles` at the bottom of the file.

Then commit (you can edit the file directly on github.com and click "Commit changes").
GitHub builds, checks and publishes the site in about 2 minutes. Watch it under the repo's **Actions** tab.

## Before going live
- Replace the placeholder prices and check the allergen tags against the real recipes.

## Adding a new photo (Mac)
```sh
./compress.sh ~/Desktop/new-photo.jpeg new-item
```
This makes small WebP versions in `img/` (square crops for the cards and a larger one for the enlarged view).
In `menu.js`, add an item with `img: "new-item"`.

## How the site stays fast (and how it's protected)
`build.mjs` turns the source files into the published page in `dist/`:
- pre-renders the menu into the HTML, so it shows instantly and works for search engines and AI agents
- inlines all CSS and JavaScript and uses self-hosted fonts, so nothing blocks the first paint
- writes `llms.txt`, `menu.json` and Schema.org menu data so AI agents can read the menu and prices

Every push runs `.github/workflows/deploy.yml`:
1. **Budgets** (`node build.mjs`) fail the build if a photo is over 100 KB (cards over 40 KB), a font is over 40 KB,
   the page is over 45 KB gzipped, an image is missing size or alt text, or an external render-blocking file sneaks in.
2. **Lighthouse** (`lighthouserc.json`, mobile, 3 runs) fails if Accessibility, Best Practices or SEO drop below 100,
   and warns if Performance drops below 95. Reports are saved as a download on each Actions run.
3. The site is only published if both pass, so a slow or inaccessible change never goes live.

## Preview locally
```sh
node build.mjs
python3 -m http.server 8765 -d dist
```
Then open http://localhost:8765

## Files
- `menu.js`: this week's menu (the only file you edit weekly)
- `index.html`: page layout and styles (template)
- `app.js`: cart, language switch, deadline lock, upsell, WhatsApp message
- `build.mjs`: builds `dist/` and checks budgets
- `img/`, `fonts/`: compressed photos and self-hosted fonts

## Note
The deadline lock runs in the visitor's browser. Each WhatsApp order includes the time it was sent, so a late order is easy to spot.
