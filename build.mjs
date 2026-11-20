// Build script: node build.mjs
// Turns the source files (index.html, menu.js, app.js, img/, fonts/) into a fast, single-request page in dist/.
//  - pre-renders this week's menu into the HTML (fast first paint, works for search engines and AI agents)
//  - inlines CSS + JS (no render-blocking requests)
//  - writes llms.txt + menu.json (machine-readable menu) and Schema.org menu data
//  - checks performance budgets and fails the build if something is too big
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const SITE = "https://itsdarrylnorris.github.io/kind-loaf/";
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, "dist");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const problems = [];

// ---------- 1. Run menu.js + app.js in build mode to get the rendered HTML ----------
const menuSrc = read("menu.js");
const appSrc = read("app.js");
const ctx = { window: { SKL_BUILD: true }, navigator: { language: "en-US" }, Intl, Date, Math, JSON, console };
vm.createContext(ctx);
vm.runInContext(menuSrc, ctx);
vm.runInContext(appSrc, ctx);
const M = ctx.window.MENU;
const B = ctx.window.SKL_BUILD;
if (!B || !B.menuHtml) throw new Error("app.js did not expose SKL_BUILD");
B.setLang("en");
const html = B.menuHtml();
const T = B.T.en;

// ---------- 2. Fill the template ----------
let page = read("index.html");
const fill = (from, to) => {
  if (!page.includes(from)) problems.push("Template is missing: " + from);
  page = page.replace(from, to);
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

fill('<div class="grid" id="grid-bundle"></div>', '<div class="grid" id="grid-bundle">' + html.bundle + "</div>");
fill('<div class="grid" id="grid-bread"></div>', '<div class="grid" id="grid-bread">' + html.bread + "</div>");
fill('<div class="grid" id="grid-sweet"></div>', '<div class="grid" id="grid-sweet">' + html.sweet + "</div>");
if (!html.bundle) fill('<section aria-labelledby="h-bundle">', '<section aria-labelledby="h-bundle" hidden>');
fill('<ul id="guideList"></ul>', '<ul id="guideList">' + B.guideHtml() + "</ul>");
fill('<p id="guideKitchen"></p>', '<p id="guideKitchen">' + esc(M.kitchen ? M.kitchen.en : "") + "</p>");
fill('<p class="cottage" id="cottage"></p>', '<p class="cottage" id="cottage">' + esc(M.cottage ? M.cottage.en : "") + "</p>");
fill('<span id="when"></span>', '<span id="when">' + esc(B.whenText()) + "</span>");
fill('<p class="week" id="week"></p>', '<p class="week" id="week">' + esc(M.week.en) + "</p>");
fill('<p class="note" id="pickup"></p>', '<p class="note" id="pickup">' + esc(M.pickup ? M.pickup.en : "") + "</p>");
fill('<ul class="lines" id="lines"></ul>', '<ul class="lines" id="lines"><li class="empty">' + esc(T.empty) + "</li></ul>");
fill("<body>", "<body data-pre>");
const waDigits = String(M.whatsapp).replace(/\D/g, "");
page = page.replace(/https:\/\/wa\.me\/\d+"/g, "https://wa.me/" + waDigits + '"');

// Embed the tiny logo font (3 KB) so the logo never waits on a second request
fill("url(fonts/sacramento-logo.woff2)", "url(data:font/woff2;base64," + fs.readFileSync(path.join(root, "fonts", "sacramento-logo.woff2")).toString("base64") + ")");

// Inline the scripts (one request instead of three)
const safe = (js) => js.replace(/<\/script/gi, "<\\/script");
fill('<script src="menu.js"></script>\n<script src="app.js"></script>', "<script>\n" + safe(menuSrc) + "\n" + safe(appSrc) + "\n</script>");

// Minify the inline CSS (comments + whitespace)
page = page.replace(/<style>([\s\S]*?)<\/style>/, (_, css) =>
  "<style>" + css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*\n\s*/g, "").replace(/\s*([{};,>])\s*/g, "$1").replace(/;}/g, "}") + "</style>");

// ---------- 3. Structured data: bakery + this week's menu with prices ----------
const deadlineISO = new Date(M.deadline).toISOString();
const offer = (price) => ({ "@type": "Offer", price: price.toFixed(2), priceCurrency: "USD", availabilityEnds: deadlineISO, availability: "https://schema.org/PreOrder" });
const menuItem = (i) => ({
  "@type": "MenuItem", name: i.name.en, description: (i.bundle ? "Includes " + i.unit.en + ". " : "") + i.desc.en,
  image: SITE + "img/" + i.img + "-960.webp", offers: offer(i.price),
  ...(i.tags && i.tags.length ? { suitableForDiet: i.tags.filter((t) => t === "vegetarian" || t === "vegan" || t === "glutenfree").map((t) =>
    "https://schema.org/" + { vegetarian: "VegetarianDiet", vegan: "VeganDiet", glutenfree: "GlutenFreeDiet" }[t]) } : {}),
});
const section = (name, list) => ({ "@type": "MenuSection", name, hasMenuItem: list.map(menuItem) });
const items = B.items, bundles = B.bundles;
const ld = {
  "@context": "https://schema.org", "@type": "Bakery", name: "Simply Kind Loaf", alternateName: "SKL", url: SITE,
  image: SITE + "img/og.jpg", logo: SITE + "apple-touch-icon.png",
  description: "Homemade panecitos, sourdough wafers and sweet bites, baked fresh every week and ordered on WhatsApp.",
  telephone: "+" + waDigits, servesCuisine: ["Bakery", "Bread", "Cookies"], priceRange: "$", knowsLanguage: ["en", "es"],
  hasMenu: { "@type": "Menu", name: "This week's menu (" + M.week.en + ")", hasMenuSection: [
    section("Bundles & Deals", bundles), section("Breads", items.filter((i) => i.category === "bread")),
    section("Wafers & Sweets", items.filter((i) => i.category === "sweet"))].filter((s) => s.hasMenuItem.length) },
  potentialAction: { "@type": "OrderAction", target: SITE + "#order" },
};
page = page.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, "\\u003c") + "</script>");

// ---------- 4. Write dist/ ----------
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), page);
for (const f of ["favicon.svg", "apple-touch-icon.png", "robots.txt", ".nojekyll"]) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, "img"), path.join(out, "img"), { recursive: true });
fs.cpSync(path.join(root, "fonts"), path.join(out, "fonts"), { recursive: true });

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>
</urlset>
`);

// Machine-readable menu for agents and integrations
const money = (n) => "$" + n.toFixed(2);
const tagNames = (i) => (i.tags || []).map((t) => T.tag[t] || t);
const json = {
  name: "Simply Kind Loaf", url: SITE, week: M.week.en, orderDeadline: M.deadline, timezone: "America/Chicago", currency: "USD",
  howToOrder: { channel: "WhatsApp", whatsapp: "+" + waDigits, link: "https://wa.me/" + waDigits,
    message: "Send your name, phone number, and each item with its quantity. The bakery confirms pickup details on WhatsApp." },
  bundles: bundles.map((b) => ({ id: b.id, name: b.name.en, nameEs: b.name.es, price: b.price, regularPrice: b.value,
    includes: b.parts.map((p) => ({ id: p.item.id, qty: p.qty })), contains: tagNames(b) })),
  items: items.map((i) => ({ id: i.id, category: i.category, name: i.name.en, nameEs: i.name.es, description: i.desc.en,
    size: i.unit.en, price: i.price, tags: tagNames(i), image: SITE + "img/" + i.img + "-960.webp" })),
  allergenNote: M.kitchen ? M.kitchen.en : "",
};
fs.writeFileSync(path.join(out, "menu.json"), JSON.stringify(json, null, 2) + "\n");

const deadlineText = B.whenText().trim();
fs.writeFileSync(path.join(out, "llms.txt"), `# Simply Kind Loaf

> Small home bakery selling homemade panecitos (bread rolls), sourdough wafers and sweet bites. The menu changes weekly. Orders are placed on WhatsApp before the weekly deadline. The website is in English and Spanish.

- Website: ${SITE}
- Machine-readable menu (JSON): ${SITE}menu.json
- Order deadline: ${deadlineText}
- Order by WhatsApp: https://wa.me/${waDigits} (+${waDigits})

## How to order (for people and AI agents)
1. Open ${SITE} and use the + buttons on the items you want, or note item names and quantities from menu.json.
2. Fill in "Your name" and "Phone number" in the "Your order" section, then press "Send order on WhatsApp".
   This opens WhatsApp with the order already written. The order is only placed once that WhatsApp message is sent.
3. Or send a WhatsApp message directly with your name, phone number, and each item with its quantity.
Ordering closes automatically after the deadline.

## This week's menu (${M.week.en})
### Bundles & Deals
${bundles.map((b) => `- ${b.name.en}: ${money(b.price)} (regular ${money(b.value)}). Includes ${b.unit.en}.`).join("\n") || "- None this week"}

### Breads
${items.filter((i) => i.category === "bread").map((i) => `- ${i.name.en} (${i.unit.en}): ${money(i.price)}. ${i.desc.en} Contains: ${tagNames(i).join(", ")}.`).join("\n")}

### Wafers & Sweets
${items.filter((i) => i.category === "sweet").map((i) => `- ${i.name.en} (${i.unit.en}): ${money(i.price)}. ${i.desc.en} Contains: ${tagNames(i).join(", ")}.`).join("\n")}

## Allergens
${M.kitchen ? M.kitchen.en : ""}
${M.cottage ? M.cottage.en : ""}
`);

// ---------- 5. Budgets: fail the build if the page would get slow ----------
const kb = (n) => Math.round(n / 1024) + " KB";
const gz = zlib.gzipSync(page).length;
if (gz > 45 * 1024) problems.push(`index.html is ${kb(gz)} gzipped (budget 45 KB)`);
if (/<link[^>]+rel="stylesheet"[^>]+href="https?:/i.test(page)) problems.push("External stylesheet found (render-blocking). Self-host it instead.");
if (/<script[^>]+src=/i.test(page.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ""))) problems.push("External <script src> found. Inline it instead.");
for (const tag of page.replace(/<script[\s\S]*?<\/script>/g, "").match(/<img\b[^>]*>/g) || []) {
  if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) problems.push("Image without width/height: " + tag.slice(0, 80));
  if (!/\balt="/.test(tag)) problems.push("Image without alt text: " + tag.slice(0, 80));
}
const LIMITS = { "og.jpg": 300 * 1024, "flyer.webp": 120 * 1024 };
for (const f of fs.readdirSync(path.join(root, "img"))) {
  const size = fs.statSync(path.join(root, "img", f)).size;
  const limit = LIMITS[f] || (/-sq\d+\.webp$/.test(f) ? 40 * 1024 : 100 * 1024);
  if (size > limit) problems.push(`img/${f} is ${kb(size)} (budget ${kb(limit)}). Re-run ./compress.sh`);
  if (/\.(jpe?g|png)$/i.test(f) && f !== "og.jpg") problems.push(`img/${f}: use WebP (./compress.sh) instead of ${path.extname(f)}`);
}
for (const f of fs.readdirSync(path.join(root, "fonts"))) {
  const size = fs.statSync(path.join(root, "fonts", f)).size;
  if (size > 40 * 1024) problems.push(`fonts/${f} is ${kb(size)} (budget 40 KB)`);
}
for (const i of [...items, ...bundles.flatMap((b) => b.parts.map((p) => p.item))]) {
  for (const v of ["sq160", "sq320", "sq480", "960"]) {
    if (!fs.existsSync(path.join(root, "img", `${i.img}-${v}.webp`))) problems.push(`Missing photo img/${i.img}-${v}.webp for "${i.name.en}". Run ./compress.sh <photo> ${i.img}`);
  }
}

// Every image path the page can show (menu, cart lines, upsell, enlarged view, "are you sure" popup) must exist
{
  const all = [...items, ...bundles];
  const everyCart = Object.fromEntries(all.map((i) => [i.id, 2]));
  const m = B.menuHtml();
  let shown = m.bundle + m.bread + m.sweet + B.linesHtml(everyCart);
  for (const i of all) shown += B.upsellHtml({ id: i.id, kind: "pair" }) + ` img/${i.img}-960.webp img/${i.img}-sq320.webp`;
  for (const ref of new Set(shown.match(/img\/[\w.-]+/g) || [])) {
    if (!fs.existsSync(path.join(root, ref))) problems.push(`The page links to ${ref}, but that file does not exist`);
  }
}
// Catch photo names from before the image change (-480 / .jpg) anywhere in the app code
if (/-480\.(webp|jpg)|\.jpg["']/.test(appSrc)) problems.push("app.js still references old photo names (-480 / .jpg). Use thumb() or img().");

if (problems.length) {
  console.error("\nBuild failed:\n - " + [...new Set(problems)].join("\n - ") + "\n");
  process.exit(1);
}
console.log(`Built dist/ : index.html ${kb(page.length)} (${kb(gz)} gzipped), ${items.length} items, ${bundles.length} bundles, deadline ${deadlineText}`);
