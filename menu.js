/*
  ===== THIS WEEK'S MENU =====
  This is the only file you need to edit each week.

  1. Change "week" and "deadline".
     The deadline format is YEAR-MONTH-DAYTHOUR:MIN:SEC-06:00
     Use -06:00 for Central Standard Time (Nov to mid March)
     Use -05:00 for Central Daylight Time (mid March to Nov)
  2. Set "active: false" to hide an item this week, or "true" to show it.
  3. Change prices. Photos live in the img/ folder (see README).
  4. "pairs" = what to suggest (upsell) when that item is in the cart, best first.
  5. "tags" = allergen / diet icons. PLEASE CHECK THESE AGAINST YOUR RECIPES.
     Allergens: "wheat" (gluten), "dairy", "eggs", "soy", "sesame", "nuts" (tree nuts), "peanuts"
     Diet:      "vegetarian", "vegan", "glutenfree", "dairyfree"
  6. "bundles" (at the bottom) = combo deals. Each lists the items it includes and a combo price.
     The page shows the regular price crossed out and how much they save automatically.
*/
window.MENU = {
  week: { en: "Week of Nov 16", es: "Semana del 16 de noviembre" },
  deadline: "2026-11-20T20:00:00-06:00",
  pickup: {
    en: "Pickup details will be confirmed on WhatsApp.",
    es: "Los detalles de entrega se confirman por WhatsApp."
  },
  // Shown in the allergen guide. Lists everything your kitchen handles, even if an item doesn't contain it.
  kitchen: {
    en: "Everything is made in a home kitchen that also handles wheat, milk, eggs, soy, sesame and tree nuts. Message us about allergies before ordering.",
    es: "Todo se prepara en una cocina casera donde también se usa trigo, leche, huevo, soya, ajonjolí y nueces. Escríbenos sobre alergias antes de ordenar."
  },
  // Texas Cottage Food Law disclosure (required for home bakeries selling in Texas)
  cottage: {
    en: "This food is made in a home kitchen and is not inspected by the Department of State Health Services or a local health department.",
    es: "Este alimento se prepara en una cocina casera y no es inspeccionado por el Departamento Estatal de Servicios de Salud ni por un departamento de salud local."
  },
  whatsapp: "14698359836", // bakery WhatsApp number, digits only with country code (1 for US)

  items: [
    // ---------- BREADS / PANES ----------
    {
      id: "regular-panecitos", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["strawberry", "cinnamon-panecitos"], category: "bread", img: "regular-panecitos", w: 430, h: 480,
      price: 8, active: true,
      name: { en: "Regular Panecitos", es: "Panecitos Regulares" },
      desc: { en: "Soft, golden homemade rolls.", es: "Panecitos caseros suaves y dorados." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },
    {
      id: "everything-panecitos", tags: ["wheat", "dairy", "eggs", "sesame", "vegetarian"], pairs: ["regular-panecitos", "double-chocolate"], category: "bread", img: "everything-panecitos", w: 480, h: 334,
      price: 9, active: true,
      name: { en: "Everything Bagel Panecitos", es: "Panecitos Everything Bagel" },
      desc: { en: "Topped with everything bagel seasoning.", es: "Con sazón everything bagel." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },
    {
      id: "cinnamon-panecitos", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["pumpkin", "vanilla"], category: "bread", img: "cinnamon-panecitos", w: 480, h: 360,
      price: 9, active: true,
      name: { en: "Cinnamon & Brown Sugar Panecitos", es: "Panecitos de Canela y Azúcar Morena" },
      desc: { en: "Sweet rolls with a cinnamon brown sugar swirl.", es: "Panecitos dulces rellenos de canela y azúcar morena." },
      unit: { en: "pack of 6", es: "paquete de 6" }
    },

    // ---------- WAFERS & SWEETS / GALLETAS Y DULCES ----------
    {
      id: "double-chocolate", tags: ["wheat", "dairy", "eggs", "soy", "vegetarian"], pairs: ["chocolate-chip", "cinnamon-panecitos"], category: "sweet", img: "cream-cheese-wafers", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Double Chocolate Chip Wafers", es: "Wafers Doble Chocolate" },
      desc: { en: "Rich chocolate dough with chocolate chips.", es: "Masa de chocolate con chispas de chocolate." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "chocolate-chip", tags: ["wheat", "dairy", "eggs", "soy", "vegetarian"], pairs: ["double-chocolate", "regular-panecitos"], category: "sweet", img: "cream-cheese-wafers", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Chocolate Chip Wafers", es: "Wafers de Chispas de Chocolate" },
      desc: { en: "A classic, loaded with chocolate chips.", es: "El clásico, lleno de chispas de chocolate." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "vanilla", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["strawberry", "cinnamon-panecitos"], category: "sweet", img: "vanilla-wafers", w: 480, h: 368,
      price: 10, active: true,
      name: { en: "Vanilla Wafers", es: "Wafers de Vainilla" },
      desc: { en: "Soft vanilla wafers with cream cheese.", es: "Wafers suaves de vainilla con queso crema." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "strawberry", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["berry-lime", "regular-panecitos"], category: "sweet", img: "strawberry-wafers", w: 360, h: 480,
      price: 12, active: true,
      name: { en: "Strawberry Wafers", es: "Wafers de Fresa" },
      desc: { en: "Sourdough wafers with strawberries and cream cheese.", es: "Wafers de masa madre con fresas y queso crema." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "berry-lime", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["strawberry", "everything-panecitos"], category: "sweet", img: "berry-lime-wafers", w: 360, h: 480,
      price: 12, active: true,
      name: { en: "Strawberry, Lime & Blueberry Wafers", es: "Wafers de Fresa, Limón y Arándano" },
      desc: { en: "Bright, fruity and a little tangy.", es: "Frutales, frescos y un poco ácidos." },
      unit: { en: "4 pieces", es: "4 piezas" }
    },
    {
      id: "pumpkin", tags: ["wheat", "dairy", "eggs", "vegetarian"], pairs: ["cinnamon-panecitos", "vanilla"], category: "sweet", img: "pumpkin-bites", w: 360, h: 480,
      price: 10, active: true,
      name: { en: "Pumpkin Spice Bites", es: "Bocaditos de Calabaza y Especias" },
      desc: { en: "Fall favorite with a sugar crust.", es: "El favorito de otoño con costra de azúcar." },
      unit: { en: "6 pieces", es: "6 piezas" }
    }
   ],

  // ---------- BUNDLES / COMBOS ----------
  // items: [item id, how many]. price: the combo price.
  bundles: [
    {
      id: "bread-lover", price: 23, active: true,
      name: { en: "Bread Lover Box", es: "Caja Amante del Pan" },
      desc: { en: "One pack of every panecito flavor.", es: "Un paquete de cada sabor de panecitos." },
      items: [["regular-panecitos", 1], ["everything-panecitos", 1], ["cinnamon-panecitos", 1]]
    },
    {
      id: "sweet-sampler", price: 38, active: true,
      name: { en: "Sweet Sampler", es: "Muestra Dulce" },
      desc: { en: "Four of our favorite wafers and bites.", es: "Cuatro de nuestros wafers y bocaditos favoritos." },
      items: [["strawberry", 1], ["berry-lime", 1], ["double-chocolate", 1], ["pumpkin", 1]]
    },
    {
      id: "family-weekend", price: 39, active: true,
      name: { en: "Family Weekend", es: "Fin de Semana Familiar" },
      desc: { en: "Bread for the week plus sweets for everyone.", es: "Pan para la semana y dulces para todos." },
      items: [["regular-panecitos", 2], ["cinnamon-panecitos", 1], ["vanilla", 1], ["pumpkin", 1]]
    }
  ]
};
