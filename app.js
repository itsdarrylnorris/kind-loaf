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

  function img(i, eager) {
    var b = "img/" + i.img;
    return '<picture><source type="image/webp" srcset="' + b + '-480.webp 480w, ' + b + '-960.webp 960w" ' +
      'sizes="(min-width: 760px) 220px, 46vw">' +
      '<img src="' + b + '-480.jpg" width="' + i.w + '" height="' + i.h + '" ' +
      (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"') + ' alt="' + i.name[lang] + '"></picture>';
  }

  function renderMenu() {
    var t = T[lang], html = { bread: "", sweet: "" };
    items.forEach(function (i, n) {
      var q = cart[i.id] || 0;
      html[i.category] += '<article class="card' + (q ? " in" : "") + '" data-id="' + i.id + '">' +
        '<div class="frame"><div class="ph"><button type="button" class="zoom" data-zoom="' + i.id + '" aria-label="' + t.view + ': ' + i.name[lang] + '">' + img(i, n < 2) + '</button></div></div>' +
        '<div class="body"><h3>' + i.name[lang] + '</h3><div class="unit">' + i.unit[lang] + '</div>' +
        '<p class="desc">' + i.desc[lang] + '</p>' +
        '<div class="row"><span class="price">' + money(i.price) + '</span>' +
        '<div class="qty"><button type="button" data-d="-1" aria-label="' + t.remove + ': ' + i.name[lang] + '">−</button>' +
        '<output aria-live="polite">' + q + '</output>' +
        '<button type="button" data-d="1" aria-label="' + t.add + ': ' + i.name[lang] + '">+</button></div></div></div></article>';
    });
    $("grid-bread").innerHTML = html.bread;
    $("grid-sweet").innerHTML = html.sweet;
    $("h-bread").parentNode.hidden = !html.bread;
    $("h-sweet").parentNode.hidden = !html.sweet;
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
    ids.forEach(function (id) { has[byId[id].category] = true; });
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
    var i = byId[u.id];
    var head = u.kind === "bread" ? t.upBread : u.kind === "sweet" ? t.upSweet : t.upPair;
    box.innerHTML = '<button type="button" class="zoom" data-zoom="' + i.id + '" aria-label="' + t.view + ': ' + i.name[lang] + '"><picture><source type="image/webp" srcset="img/' + i.img + '-480.webp"><img src="img/' + i.img +
      '-480.jpg" alt="" width="64" height="64" loading="lazy" decoding="async"></picture></button>' +
      '<div class="ut"><div class="uh">' + head + '</div><div class="un">' + i.name[lang] + '</div>' +
      '<div class="up">' + i.unit[lang] + ' · ' + money(i.price) + '</div></div>' +
      '<button type="button" data-up="' + i.id + '">' + t.upAdd + '</button>';
    box.hidden = false;
  }

  function setQty(id, q) {
    q = Math.max(0, Math.min(99, q));
    if (q) cart[id] = q; else delete cart[id];
    var card = document.querySelector('.card[data-id="' + id + '"]');
    if (card) { card.querySelector("output").textContent = q; card.classList.toggle("in", q > 0); }
    save(); renderOrder();
    $("err").textContent = "";
  }

  function renderOrder() {
    var t = T[lang], ids = Object.keys(cart);
    $("lines").innerHTML = ids.length ? ids.map(function (id) {
      var i = byId[id];
      return "<li><span>" + cart[id] + " × " + i.name[lang] + "</span><span>" + money(cart[id] * i.price) + "</span></li>";
    }).join("") : '<li class="empty">' + t.empty + "</li>";
    var s = totals();
    $("total").textContent = money(s.sum);
    $("barText").textContent = t.items(s.n) + " · " + money(s.sum);
    $("bar").classList.toggle("show", s.n > 0 && isOpen());
    $("bar").setAttribute("aria-hidden", s.n > 0 ? "false" : "true");
    renderUpsell();
  }

  function renderText() {
    var t = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t[el.getAttribute("data-t")]; });
    document.querySelectorAll("[data-tp]").forEach(function (el) { el.placeholder = t[el.getAttribute("data-tp")]; });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    var when = new Intl.DateTimeFormat(lang === "es" ? "es-MX" : "en-US", {
      timeZone: TZ, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(deadline);
    $("when").textContent = " " + when + " (" + t.central + ")";
    $("week").textContent = M.week[lang];
    $("pickup").textContent = M.pickup ? M.pickup[lang] : "";
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
    document.querySelectorAll(".qty button, #form input, #form textarea, #send").forEach(function (el) { el.disabled = !open; });
    if (!open) $("bar").classList.remove("show");
  }

  function renderAll() { renderText(); renderMenu(); renderOrder(); tick(); }

  function save() { store(cartKey, JSON.stringify(cart)); }

  // Quantity buttons and upsell "Add"
  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zoom]");
    if (z) { openPhoto(z.getAttribute("data-zoom")); return; }
    if (!isOpen()) return;
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
      $("askImg").src = "img/" + i.img + "-480.webp";
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

  renderAll();
  setInterval(tick, 30000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
})();
