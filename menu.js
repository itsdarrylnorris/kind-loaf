/*
  ===== THIS WEEK'S MENU =====
  This is the only file you need to edit each week.

  1. Change "week" and "deadline".
     The deadline format is YEAR-MONTH-DAYTHOUR:MIN:SEC-06:00
     Use -06:00 for Central Standard Time (Nov to mid March)
     Use -05:00 for Central Daylight Time (mid March to Nov)
  2. Set "active: false" to hide an item this week, or "true" to show it.
  3. Change prices. Photos live in the img/ folder (see README).
*/
window.MENU = {
  week: { en: "Week of Nov 16", es: "Semana del 16 de noviembre" },
  deadline: "2026-11-20T20:00:00-06:00",
  pickup: {
    en: "Pickup details will be confirmed on WhatsApp.",
    es: "Los detalles de entrega se confirman por WhatsApp."
  },
  whatsapp: "15555555555", // bakery WhatsApp number, digits only with country code (1 for US)
  hero: "panecitos-bag",

  items: [
    // ---------- BREADS / PANES ----------
    {
      id: "regular-panecitos", category: "bread", img: "regular-panecitos", w: 430, h: 480,
      price: 8, active: true,
      name: { en: "Regular Panecitos", es: "Panecitos Regulares" },
      desc: { en: "Soft, golden homemade rolls.", es: "Panecitos caseros suaves y dorados." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },
    {
      id: "everything-panecitos", category: "bread", img: "everything-panecitos", w: 480, h: 334,
      price: 9, active: true,
      name: { en: "Everything Bagel Panecitos", es: "Panecitos Everything Bagel" },
      desc: { en: "Topped with everything bagel seasoning.", es: "Con sazón everything bagel." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },
    {
      id: "cinnamon-panecitos", category: "bread", img: "cinnamon-panecitos", w: 480, h: 360,
      price: 9, active: true,
      name: { en: "Cinnamon & Brown Sugar Panecitos", es: "Panecitos de Canela y Azúcar Morena" },
      desc: { en: "Sweet rolls with a cinnamon brown sugar swirl.", es: "Panecitos dulces rellenos de canela y azúcar morena." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },

    // ---------- WAFERS & SWEETS / GALLETAS Y DULCES ----------
    {
      id: "double-chocolate", category: "sweet", img: "cream-cheese-wafers", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Double Chocolate Chip Wafers", es: "Wafers Doble Chocolate" },
      desc: { en: "Rich chocolate dough with chocolate chips.", es: "Masa de chocolate con chispas de chocolate." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "chocolate-chip", category: "sweet", img: "cream-cheese-wafers", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Chocolate Chip Wafers", es: "Wafers de Chispas de Chocolate" },
      desc: { en: "A classic, loaded with chocolate chips.", es: "El clásico, lleno de chispas de chocolate." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "vanilla", category: "sweet", img: "vanilla-wafers", w: 480, h: 368,
      price: 10, active: true,
      name: { en: "Vanilla Wafers", es: "Wafers de Vainilla" },
      desc: { en: "Soft vanilla wafers with cream cheese.", es: "Wafers suaves de vainilla con queso crema." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "strawberry", category: "sweet", img: "strawberry-wafers", w: 360, h: 480,
      price: 12, active: true,
      name: { en: "Strawberry Wafers", es: "Wafers de Fresa" },
      desc: { en: "Sourdough wafers with strawberries and cream cheese.", es: "Wafers de masa madre con fresas y queso crema." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "berry-lime", category: "sweet", img: "berry-lime-wafers", w: 360, h: 480,
      price: 12, active: true,
      name: { en: "Strawberry, Lime & Blueberry Wafers", es: "Wafers de Fresa, Limón y Arándano" },
      desc: { en: "Bright, fruity and a little tangy.", es: "Frutales, frescos y un poco ácidos." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "pumpkin", category: "sweet", img: "pumpkin-bites", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Pumpkin Spice Bites", es: "Bocaditos de Calabaza y Especias" },
      desc: { en: "Fall favorite with a sugar crust.", es: "El favorito de otoño con costra de azúcar." },
      unit: { en: "6 pieces", es: "6 piezas" }
    }
  ]
};
