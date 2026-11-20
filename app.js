(function () {
  "use strict";
  var M = window.MENU;
  var TZ = "America/Chicago";
  var deadline = new Date(M.deadline).getTime();

  var T = {
    en: {
      headline: "Sweet deals are here!",
      lede: "Your favorite wafers and bread at a sweeter price!",
      ordersUntil: "Taking orders until",
      closedTitle: "Orders are closed",
      closedMsg: "Orders for this week are closed. Check back soon for next week's menu!",
      breads: "Breads", sweets: "Wafers & Sweets", yourOrder: "Your order", total: "Total",
      name: "Your name", phone: "Phone number", notes: "Notes (optional)",
      notesPh: "Allergies, pickup time, anything else...",
      send: "Send order on WhatsApp", review: "Review order", flyer: "See this week's flyer",
      empty: "Add items from the menu above.", central: "Central time",
      left: function (d, h, m) { return (d ? d + "d " : "") + h + "h " + m + "m left to order"; },
      items: function (n) { return n + (n === 1 ? " item" : " items"); },
      add: "Add one", remove: "Remove one",
      errEmpty: "Please add at least one item.", errName: "Please enter your name.",
      errPhone: "Please enter a valid phone number.", errClosed: "Sorry, orders for this week are closed.",
      upBread: "Add some fresh bread?", upSweet: "Add something sweet?", upPair: "Goes great with your order", upAdd: "+ Add",
      askTitle: "Before you send...", askText: function (n) { return "Are you sure you don't want to add " + n + "?"; },
      askYes: function (p) { return "Yes, add it (+" + p + ")"; }, askNo: "No thanks, send my order", view: "View photo", close: "Close",
      bundles: "Bundles & Deals", save: function (m) { return "Save " + m; }, includes: "Includes", contains: "Contains", diet: "Diet",
      rm: "Remove", allergenGuide: "Allergen & diet guide",
      shareTitle: "Share with friends", shareText: "Know someone who loves fresh bread? Send them this week's menu.",
      shareBtn: "Share", copy: "Copy link", copied: "Link copied!", email: "Email",
      shareMsg: "Check out this week's menu from Simply Kind Loaf! Homemade panecitos and wafers. Order before Friday 8pm:",
      tag: { wheat: "Wheat (gluten)", dairy: "Dairy", eggs: "Eggs", soy: "Soy", sesame: "Sesame", nuts: "Tree nuts", peanuts: "Peanuts",
        vegetarian: "Vegetarian", vegan: "Vegan", glutenfree: "Gluten-free", dairyfree: "Dairy-free" },
      msgTitle: "New order", msgName: "Name", msgPhone: "Phone", msgNotes: "Notes", msgSent: "Sent"
    },
    es: {
      headline: "¡Llegaron las ofertas dulces!",
      lede: "¡Tus wafers y panes favoritos a un precio más dulce!",
      ordersUntil: "Tomo órdenes hasta el",
      closedTitle: "Órdenes cerradas",
      closedMsg: "Las órdenes de esta semana están cerradas. ¡Vuelve pronto para ver el menú de la próxima semana!",
      breads: "Panes", sweets: "Galletas y dulces", yourOrder: "Tu orden", total: "Total",
      name: "Tu nombre", phone: "Número de teléfono", notes: "Notas (opcional)",
      notesPh: "Alergias, hora de recogida, algo más...",
      send: "Enviar orden por WhatsApp", review: "Ver orden", flyer: "Ver el flyer de esta semana",
      empty: "Agrega productos del menú.", central: "hora del Centro",
      left: function (d, h, m) { return "Quedan " + (d ? d + "d " : "") + h + "h " + m + "m para ordenar"; },
      items: function (n) { return n + (n === 1 ? " producto" : " productos"); },
      add: "Agregar uno", remove: "Quitar uno",
      errEmpty: "Agrega al menos un producto.", errName: "Escribe tu nombre.",
      errPhone: "Escribe un número de teléfono válido.", errClosed: "Lo sentimos, las órdenes de esta semana están cerradas.",
      upBread: "¿Le agregas pan fresco?", upSweet: "¿Algo dulce para acompañar?", upPair: "Va perfecto con tu orden", upAdd: "+ Agregar",
      askTitle: "Antes de enviar...", askText: function (n) { return "¿Seguro que no quieres agregar " + n + "?"; },
      askYes: function (p) { return "Sí, agrégalo (+" + p + ")"; }, askNo: "No, gracias, enviar mi orden", view: "Ver foto", close: "Cerrar",
      bundles: "Combos y ofertas", save: function (m) { return "Ahorra " + m; }, includes: "Incluye", contains: "Contiene", diet: "Dieta",
      rm: "Quitar", allergenGuide: "Guía de alérgenos y dietas",
      shareTitle: "Comparte con tus amigos", shareText: "¿Conoces a alguien que ama el pan fresco? Envíale el menú de esta semana.",
      shareBtn: "Compartir", copy: "Copiar enlace", copied: "¡Enlace copiado!", email: "Correo",
      shareMsg: "¡Mira el menú de esta semana de Simply Kind Loaf! Panecitos y wafers caseros. Ordena antes del viernes 8pm:",
      tag: { wheat: "Trigo (gluten)", dairy: "Lácteos", eggs: "Huevo", soy: "Soya", sesame: "Ajonjolí", nuts: "Nueces", peanuts: "Cacahuate",
        vegetarian: "Vegetariano", vegan: "Vegano", glutenfree: "Sin gluten", dairyfree: "Sin lácteos" },
      msgTitle: "Nueva orden", msgName: "Nombre", msgPhone: "Teléfono", msgNotes: "Notas", msgSent: "Enviada"
    }
  };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  var lang = store("skl-lang") || ((navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en");
  var items = M.items.filter(function (i) { return i.active; });
  var byId = {};
  items.forEach(function (i) { byId[i.id] = i; });

  // Bundles become regular cart items with category "bundle". A bundle is hidden if any item in it is inactive.
  var DIET = ["vegetarian", "vegan", "glutenfree", "dairyfree"];
  var bundles = (M.bundles || []).filter(function (b) {
    return b.active && b.items.every(function (x) { return byId[x[0]]; });
  }).map(function (b) {
    var parts = b.items.map(function (x) { return { item: byId[x[0]], qty: x[1] }; });
    var value = parts.reduce(function (a, p) { return a + p.item.price * p.qty; }, 0);
    var tags = [];
    parts.forEach(function (p) { (p.item.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });
    // a diet tag only applies to the bundle if every item has it
    tags = tags.filter(function (t) { return DIET.indexOf(t) < 0 || parts.every(function (p) { return (p.item.tags || []).indexOf(t) >= 0; }); });
    var ORDER = ["wheat", "dairy", "eggs", "soy", "sesame", "nuts", "peanuts"].concat(DIET);
    tags.sort(function (x, y) { return ORDER.indexOf(x) - ORDER.indexOf(y); });
    var list = function (l) { return parts.map(function (p) { return p.qty + "× " + p.item.name[l]; }).join(", "); };
    return { id: b.id, category: "bundle", bundle: true, price: b.price, value: value, parts: parts, tags: tags,
      img: parts[0].item.img, w: parts[0].item.w, h: parts[0].item.h, name: b.name, desc: b.desc,
      unit: { en: list("en"), es: list("es") } };
  });
  bundles.forEach(function (b) { byId[b.id] = b; });

  // Cart is tied to this week's deadline so old carts don't carry over
  var cartKey = "skl-cart-" + M.deadline;
  var cart = {};
  try { cart = JSON.parse(store(cartKey) || "{}") || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (id) { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) {
    return new Intl.NumberFormat(lang === "es" ? "es-US" : "en-US", { style: "currency", currency: "USD" }).format(n);
  };
  var isOpen = function () { return Date.now() < deadline; };

  var ICON = {
    wheat: '<path d="M12 21V8"/><path d="M12 8c-2.2-.8-3.4-2.8-3.4-5 2.2.8 3.4 2.8 3.4 5zm0 0c2.2-.8 3.4-2.8 3.4-5-2.2.8-3.4 2.8-3.4 5zM12 13.5c-2.2-.8-3.4-2.8-3.4-5 2.2.8 3.4 2.8 3.4 5zm0 0c2.2-.8 3.4-2.8 3.4-5-2.2.8-3.4 2.8-3.4 5zM12 19c-2.2-.8-3.4-2.8-3.4-5 2.2.8 3.4 2.8 3.4 5zm0 0c2.2-.8 3.4-2.8 3.4-5-2.2.8-3.4 2.8-3.4 5z"/>',
    dairy: '<path d="M9 3h6M9.5 3v3L7 10v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V10l-2.5-4V3"/><path d="M7 13h10"/>',
    eggs: '<path d="M12 3c3.6 0 6.5 6 6.5 10.5a6.5 6.5 0 0 1-13 0C5.5 9 8.4 3 12 3z"/>',
    soy: '<path d="M4.5 19.5c0-8.5 6.5-15 15-15 0 8.5-6.5 15-15 15z"/><circle cx="9.5" cy="14.5" r="1.6"/><circle cx="14.5" cy="9.5" r="1.6"/>',
    sesame: '<ellipse cx="7.5" cy="8" rx="2.2" ry="3.6" transform="rotate(-25 7.5 8)"/><ellipse cx="16.5" cy="8.5" rx="2.2" ry="3.6" transform="rotate(25 16.5 8.5)"/><ellipse cx="12" cy="16.5" rx="2.2" ry="3.6"/>',
    nuts: '<path d="M5 10.5h14c0 5.5-3.2 9.5-7 9.5s-7-4-7-9.5z"/><path d="M4 10.5C4 7.2 7.6 5 12 5s8 2.2 8 5.5M12 5V2.5"/>',
    peanuts: '<path d="M9 3.5a4.5 4.5 0 0 1 4.3 5.9c-.3 1 .3 2 1.2 2.4a4.5 4.5 0 1 1-6 5.3c-.2-1-1-1.7-2-1.8A4.5 4.5 0 0 1 9 3.5z"/>',
    vegetarian: '<path d="M5 19C5 10.5 10.5 5 19 5c0 8.5-5.5 14-14 14z"/><path d="M5 19l8.5-8.5"/>',
    vegan: '<path d="M5 19C5 10.5 10.5 5 19 5c0 8.5-5.5 14-14 14z"/><path d="M8 9l3 6 3-6"/>',
    glutenfree: '<path d="M12 21V9M12 9c-2-.7-3-2.5-3-4.5 2 .7 3 2.5 3 4.5zm0 0c2-.7 3-2.5 3-4.5-2 .7-3 2.5-3 4.5z"/><path d="M4 4l16 16"/>',
    dairyfree: '<path d="M9.5 3h5M10 3v3L8 10v10h8V10l-2-4V3"/><path d="M4 4l16 16"/>'
  };
  function tagIcon(tg) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[tg] || "") + "</svg>";
  }
  function tagList(i, cls) {
    var t = T[lang], tags = (i.tags || []).filter(function (x) { return ICON[x]; });
    if (!tags.length) return "";
    return '<ul class="' + (cls || "tags") + '">' + tags.map(function (tg) {
      return '<li class="tg' + (DIET.indexOf(tg) >= 0 ? " diet" : "") + '" title="' + t.tag[tg] + '">' + tagIcon(tg) + '<span class="sr">' + t.tag[tg] + "</span></li>";
    }).join("") + "</ul>";
  }
  function tagText(i) {
    var t = T[lang], c = [], d = [];
    (i.tags || []).forEach(function (tg) { if (!t.tag[tg]) return; (DIET.indexOf(tg) >= 0 ? d : c).push(t.tag[tg]); });
    return (c.length ? t.contains + ": " + c.join(", ") : "") + (c.length && d.length ? " · " : "") + (d.length ? d.join(", ") : "");
  }
  // Photos: square crops (sq160/sq320/sq480) for cards and thumbnails, -960 for the enlarged view
  function sqSet(i) { return "img/" + i.img + "-sq160.webp 160w, img/" + i.img + "-sq320.webp 320w, img/" + i.img + "-sq480.webp 480w"; }
  function thumb(i, size) {
    return '<img src="img/' + i.img + '-sq160.webp" alt="" width="' + size + '" height="' + size + '" loading="lazy" decoding="async">';
  }
  function img(i, eager, sizes, alt) {
    return '<img src="img/' + i.img + '-sq320.webp" srcset="' + sqSet(i) + '" sizes="' + (sizes || "(min-width: 760px) 190px, calc(50vw - 45px)") +
      '" width="320" height="320" ' + (eager ? (eager === 2 ? 'fetchpriority="high"' : "") : 'loading="lazy"') + ' decoding="async" alt="' + (alt === undefined ? i.name[lang] : alt) + '">';
  }

  function menuHtml() {
    var t = T[lang], html = { bread: "", sweet: "", bundle: "" };
    bundles.forEach(function (b, bn) {
      var q = cart[b.id] || 0;
      html.bundle += '<article class="card bundle' + (q ? " in" : "") + '" data-id="' + b.id + '">' +
        '<div class="frame"><button type="button" class="zoom collage n' + Math.min(b.parts.length, 4) + '" data-zoom="' + b.id + '" aria-label="' + t.view + ': ' + b.name[lang] + '">' +
        b.parts.slice(0, 4).map(function (p, k) {
          var big = b.parts.length === 3 && k === 0;
          return '<span>' + img(p.item, 0, big ? "(min-width: 760px) 95px, calc(25vw - 23px)" : "(min-width: 760px) 95px, calc(25vw - 23px)", "") + '</span>';
        }).join("") + '</button>' +
        '<span class="save">' + t.save(money(b.value - b.price)) + '</span></div>' +
        '<div class="body"><h3>' + b.name[lang] + '</h3><div class="unit">' + t.includes + ': ' + b.unit[lang] + '</div>' +
        '<p class="desc">' + b.desc[lang] + '</p>' + tagList(b) +
        '<div class="row"><span class="price"><s>' + money(b.value) + '</s> ' + money(b.price) + '</span>' +
        '<div class="qty"><button type="button" data-d="-1" aria-label="' + t.remove + ': ' + b.name[lang] + '">−</button>' +
        '<output aria-live="polite">' + q + '</output>' +
        '<button type="button" data-d="1" aria-label="' + t.add + ': ' + b.name[lang] + '">+</button></div></div></div></article>';
    });
    items.forEach(function (i, n) {
      var q = cart[i.id] || 0;
      html[i.category] += '<article class="card' + (q ? " in" : "") + '" data-id="' + i.id + '">' +
        '<div class="frame"><div class="ph"><button type="button" class="zoom" data-zoom="' + i.id + '" aria-label="' + t.view + ': ' + i.name[lang] + '">' + img(i, 0) + '</button></div></div>' +
        '<div class="body"><h3>' + i.name[lang] + '</h3><div class="unit">' + i.unit[lang] + '</div>' +
        '<p class="desc">' + i.desc[lang] + '</p>' + tagList(i) +
        '<div class="row"><span class="price">' + money(i.price) + '</span>' +
        '<div class="qty"><button type="button" data-d="-1" aria-label="' + t.remove + ': ' + i.name[lang] + '">−</button>' +
        '<output aria-live="polite">' + q + '</output>' +
        '<button type="button" data-d="1" aria-label="' + t.add + ': ' + i.name[lang] + '">+</button></div></div></div></article>';
    });
    return html;
  }

  function renderMenu() {
    var html = menuHtml();
    $("grid-bread").innerHTML = html.bread;
    $("grid-sweet").innerHTML = html.sweet;
    $("grid-bundle").innerHTML = html.bundle;
    $("h-bundle").parentNode.hidden = !html.bundle;
    renderGuide();
    $("h-bread").parentNode.hidden = !html.bread;
    $("h-sweet").parentNode.hidden = !html.sweet;
  }

  function renderGuide() { renderGuideText(); }
  function guideHtml() {
    var t = T[lang], used = [];
    items.forEach(function (i) { (i.tags || []).forEach(function (tg) { if (ICON[tg] && used.indexOf(tg) < 0) used.push(tg); }); });
    var order = ["wheat", "dairy", "eggs", "soy", "sesame", "nuts", "peanuts"].concat(DIET);
    used.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    return used.map(function (tg) {
      return '<li><span class="tg' + (DIET.indexOf(tg) >= 0 ? " diet" : "") + '">' + tagIcon(tg) + "</span>" + t.tag[tg] + "</li>";
    }).join("");
  }
  function renderGuideText() {
    var t = T[lang];
    $("guideTitle").textContent = t.allergenGuide;
    $("guideList").innerHTML = guideHtml();
    $("guideKitchen").textContent = M.kitchen ? M.kitchen[lang] : "";
    $("cottage").textContent = M.cottage ? M.cottage[lang] : "";
  }

  function totals() {
    var n = 0, sum = 0;
    Object.keys(cart).forEach(function (id) { n += cart[id]; sum += cart[id] * byId[id].price; });
    return { n: n, sum: sum };
  }

  // Upsell: suggest one item based on what's in the cart.
  // 1) If the cart has only bread (or only sweets), suggest something from the other category.
  // 2) Otherwise suggest the best "pairs" match (from menu.js) of the items they bought the most of.
  function pickUpsell() {
    var ids = Object.keys(cart);
    if (!ids.length) return null;
    ids.sort(function (a, b) { return cart[b] - cart[a]; });
    var cands = [];
    ids.forEach(function (id) {
      (byId[id].pairs || []).forEach(function (p) { if (byId[p] && !cart[p] && cands.indexOf(p) < 0) cands.push(p); });
    });
    var has = {};
    ids.forEach(function (id) {
      var i = byId[id];
      if (i.bundle) i.parts.forEach(function (p) { has[p.item.category] = true; }); else has[i.category] = true;
    });
    var missing = !has.bread ? "bread" : !has.sweet ? "sweet" : null;
    if (missing) {
      var m = cands.filter(function (id) { return byId[id].category === missing; })[0] ||
        items.filter(function (i) { return i.category === missing && !cart[i.id]; }).map(function (i) { return i.id; })[0];
      if (m) return { id: m, kind: missing };
    }
    var c = cands[0] || items.filter(function (i) { return !cart[i.id]; }).map(function (i) { return i.id; })[0];
    return c ? { id: c, kind: "pair" } : null;
  }

  function renderUpsell() {
    var box = $("upsell"), u = pickUpsell(), t = T[lang];
    if (!u) { box.hidden = true; box.innerHTML = ""; return; }
    box.innerHTML = upsellHtml(u);
    box.hidden = false;
  }

  function upsellHtml(u) {
    var t = T[lang], i = byId[u.id];
    var head = u.kind === "bread" ? t.upBread : u.kind === "sweet" ? t.upSweet : t.upPair;
    return '<button type="button" class="zoom" data-zoom="' + i.id + '" aria-label="' + t.view + ': ' + i.name[lang] + '">' + thumb(i, 64) + '</button>' +
      '<div class="ut"><div class="uh">' + head + '</div><div class="un">' + i.name[lang] + '</div>' +
      '<div class="up">' + i.unit[lang] + ' · ' + money(i.price) + '</div></div>' +
      '<button type="button" class="upadd" data-up="' + i.id + '">' + t.upAdd + '</button>';
  }

  function setQty(id, q) {
    q = Math.max(0, Math.min(99, q));
    if (q) cart[id] = q; else delete cart[id];
    var card = document.querySelector('.card[data-id="' + id + '"]');
    if (card) { card.querySelector("output").textContent = q; card.classList.toggle("in", q > 0); }
    save(); renderOrder();
    $("err").textContent = "";
  }

  function linesHtml(c) {
    var t = T[lang], ids = Object.keys(c);
    return ids.length ? ids.map(function (id) {
      var i = byId[id];
      var trash = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
      var one = c[id] === 1;
      return '<li><div class="lt"><span class="ln">' + i.name[lang] + '</span>' +
        '<span class="lp">' + money(c[id] * i.price) + '</span>' +
        '<div class="lq"><button type="button" data-lq="-1" data-id="' + id + '" aria-label="' + (one ? t.rm : t.remove) + ": " + i.name[lang] + '">' + (one ? trash : "−") + '</button>' +
        '<output aria-label="' + i.name[lang] + '">' + c[id] + '</output>' +
        '<button type="button" data-lq="1" data-id="' + id + '" aria-label="' + t.add + ": " + i.name[lang] + '">+</button></div></div>' +
        '<button type="button" class="zoom lthumb" data-zoom="' + id + '" aria-label="' + t.view + ": " + i.name[lang] + '">' + thumb(i, 56) + "</button></li>";
    }).join("") : '<li class="empty">' + t.empty + "</li>";
  }

  function renderOrder() {
    var t = T[lang];
    $("lines").innerHTML = linesHtml(cart);
    var s = totals();
    $("total").textContent = money(s.sum);
    $("barText").textContent = t.items(s.n) + " · " + money(s.sum);
    setBar(s.n > 0 && isOpen());
    renderUpsell();
  }

  function whenText() {
    return " " + new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", {
      timeZone: TZ, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(deadline) + " (" + T[lang].central + ")";
  }

  function renderText() {
    var t = T[lang];
    document.documentElement.lang = lang;
    // only touch text that actually changes, so the pre-rendered page is not repainted on load
    var setText = function (el, v) { if (el.textContent !== v) el.textContent = v; };
    document.querySelectorAll("[data-t]").forEach(function (el) { setText(el, t[el.getAttribute("data-t")]); });
    document.querySelectorAll("[data-tp]").forEach(function (el) { el.placeholder = t[el.getAttribute("data-tp")]; });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    setText($("when"), whenText());
    setText($("week"), M.week[lang]);
    setText($("pickup"), M.pickup ? M.pickup[lang] : "");
  }

  function tick() {
    var t = T[lang], open = isOpen(), left = deadline - Date.now();
    document.body.classList.toggle("closed", !open);
    if (open) {
      var d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
      $("count").textContent = t.left(d, h, m);
    } else {
      $("count").textContent = t.closedTitle;
    }
    document.querySelectorAll(".qty button, .lq button, .upsell button[data-up], #form input, #form textarea, #send").forEach(function (el) { el.disabled = !open; });
    if (!open) setBar(false);
  }

  function setBar(show) {
    var bar = $("bar");
    bar.classList.toggle("show", show);
    if (show) bar.removeAttribute("inert"); else bar.setAttribute("inert", "");
  }

  var first = true;
  function renderAll() {
    renderText(); renderShare();
    // The HTML is pre-rendered in English with an empty cart; skip re-drawing it on first load if nothing differs
    var pre = first && document.body.hasAttribute("data-pre") && lang === "en" && !Object.keys(cart).length;
    if (!pre) renderMenu();
    first = false;
    renderOrder(); tick();
  }

  // Build step (build.mjs) uses these to pre-render the page
  if (window.SKL_BUILD) {
    window.SKL_BUILD = { menuHtml: menuHtml, guideHtml: guideHtml, upsellHtml: upsellHtml, linesHtml: linesHtml, whenText: whenText, items: items, bundles: bundles, T: T,
      setLang: function (l) { lang = l; } };
    return;
  }

  function save() { store(cartKey, JSON.stringify(cart)); }

  // Quantity buttons and upsell "Add"
  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zoom]");
    if (z) { openPhoto(z.getAttribute("data-zoom")); return; }
    if (!isOpen()) return;
    var lq = e.target.closest("[data-lq]");
    if (lq) {
      var lid = lq.getAttribute("data-id");
      setQty(lid, (cart[lid] || 0) + Number(lq.getAttribute("data-lq")));
      var again = document.querySelector('[data-lq="' + lq.getAttribute("data-lq") + '"][data-id="' + lid + '"]');
      if (again) again.focus(); // keep keyboard focus on the same button after the list redraws
      return;
    }
    var up = e.target.closest("[data-up]");
    if (up) { var uid = up.getAttribute("data-up"); setQty(uid, (cart[uid] || 0) + 1); return; }
    var b = e.target.closest(".qty button");
    if (!b) return;
    var id = b.closest(".card").getAttribute("data-id");
    setQty(id, (cart[id] || 0) + Number(b.getAttribute("data-d")));
  });

  // Language toggle
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.getAttribute("data-lang"); store("skl-lang", lang); renderAll();
    });
  });

  // Photo viewer
  function openPhoto(id) {
    var i = byId[id], d = $("lb");
    $("lbImg").src = "img/" + i.img + "-960.webp";
    $("lbImg").alt = i.name[lang];
    $("lbName").textContent = i.name[lang];
    $("lbPrice").textContent = money(i.price);
    $("lbInfo").textContent = i.bundle ? T[lang].includes + ": " + i.unit[lang] + "." : i.desc[lang];
    var tags = (i.tags || []).filter(function (tg) { return ICON[tg]; });
    $("lbTags").innerHTML = tags.map(function (tg) {
      return '<li><span class="tg' + (DIET.indexOf(tg) >= 0 ? " diet" : "") + '">' + tagIcon(tg) + "</span>" + T[lang].tag[tg] + "</li>";
    }).join("");
    $("lbTags").hidden = !tags.length;
    d.querySelector(".x").setAttribute("aria-label", T[lang].close);
    d.showModal();
  }
  ["lb", "ask"].forEach(function (id) {
    var d = $(id);
    d.addEventListener("click", function (e) { if (e.target === d || e.target.hasAttribute("data-close")) d.close(); });
  });

  // Send order
  var asked = false; // only ask once, so it never gets annoying

  function sendOrder() {
    var t = T[lang], s = totals();
    var name = $("name").value.trim(), phone = $("phone").value.trim(), notes = $("notes").value.trim();
    var sent = new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", {
      timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(Date.now());
    var lines = [t.msgTitle + " - Simply Kind Loaf (" + M.week[lang] + ")", "",
      t.msgName + ": " + name, t.msgPhone + ": " + phone, ""];
    Object.keys(cart).forEach(function (id) {
      var i = byId[id];
      lines.push("- " + cart[id] + " x " + i.name[lang] + " (" + i.unit[lang] + ") = " + money(cart[id] * i.price));
    });
    lines.push("", t.total + ": " + money(s.sum));
    if (notes) lines.push(t.msgNotes + ": " + notes);
    lines.push("", t.msgSent + ": " + sent + " (" + t.central + ")");

    var url = "https://wa.me/" + String(M.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(lines.join("\n"));
    // Cart is kept so nothing is lost if WhatsApp doesn't open; it resets automatically next week
    window.SKL_LAST_URL = url;
    if (!window.SKL_TEST) window.location.href = url;
  }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = T[lang], err = $("err");
    var name = $("name").value.trim(), phone = $("phone").value.trim();
    if (!isOpen()) { tick(); err.textContent = t.errClosed; return; }
    if (!totals().n) { err.textContent = t.errEmpty; return; }
    if (!name) { err.textContent = t.errName; $("name").focus(); return; }
    if (phone.replace(/\D/g, "").length < 10) { err.textContent = t.errPhone; $("phone").focus(); return; }
    err.textContent = "";

    // Last-chance upsell
    var u = pickUpsell();
    if (u && !asked) {
      asked = true;
      var i = byId[u.id];
      $("askImg").src = "img/" + i.img + "-sq320.webp";
      $("askTitle").textContent = t.askTitle;
      $("askText").textContent = t.askText(i.name[lang]);
      $("askYes").textContent = t.askYes(money(i.price));
      $("askNo").textContent = t.askNo;
      $("askYes").onclick = function () { setQty(i.id, (cart[i.id] || 0) + 1); $("ask").close(); sendOrder(); };
      $("askNo").onclick = function () { $("ask").close(); sendOrder(); };
      $("ask").showModal();
      return;
    }
    sendOrder();
  });

  // Share buttons
  var pageUrl = (document.querySelector('link[rel="canonical"]') || {}).href || location.href.split(/[?#]/)[0];
  function renderShare() {
    var t = T[lang], text = t.shareMsg + " " + pageUrl;
    $("shWa").href = "https://wa.me/?text=" + encodeURIComponent(text);
    $("shFb").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
    $("shMail").href = "mailto:?subject=" + encodeURIComponent("Simply Kind Loaf") + "&body=" + encodeURIComponent(text);
    $("shCopy").querySelector("span").textContent = t.copy;
    $("shNative").querySelector("span").textContent = t.shareBtn;
    $("shMail").querySelector("span").textContent = t.email;
  }
  if (navigator.share) $("shNative").hidden = false;
  $("shNative").addEventListener("click", function () {
    navigator.share({ title: "Simply Kind Loaf", text: T[lang].shareMsg, url: pageUrl }).catch(function () {});
  });
  $("shCopy").addEventListener("click", function () {
    var b = $("shCopy"), done = function () {
      b.querySelector("span").textContent = T[lang].copied;
      setTimeout(function () { b.querySelector("span").textContent = T[lang].copy; }, 2000);
    };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(pageUrl).then(done, function () {}); return; }
    var ta = document.createElement("textarea"); ta.value = pageUrl; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove();
  });

  // Body font: loaded after the page has painted, so it never delays the first view
  function loadBodyFont() {
    if (!window.FontFace || !document.fonts || !window.fetch) return;
    // fetched as low-priority data (not a font request), so it never competes with the first view
    fetch("fonts/montserrat.woff2", { priority: "low" }).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      return new FontFace("Montserrat", buf, { weight: "400 700" }).load();
    }).then(function (f) { document.fonts.add(f); }, function () {});
  }
  if (document.readyState === "complete") loadBodyFont(); else window.addEventListener("load", loadBodyFont);

  renderAll();
  setInterval(tick, 30000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
})();
