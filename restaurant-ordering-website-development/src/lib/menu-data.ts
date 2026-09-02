// ─────────────────────────────────────────────────────────────
// RIB HOUSE - full menu dataset & kiosk dish models
// ─────────────────────────────────────────────────────────────

export const RESTAURANT = {
  name: "Rib House",
  tagline: "Best Quality Grilled Meat",
  phone: "0724 594 204",
  phoneIntl: "+254724594204",
  email: "ribhouseke@gmail.com",
  hours: "Mon - Sat: 5:30 AM - 11:00 PM · Sun: 5:30 AM - 10:00 PM",
  town: "Nairobi, Kenya",
  mapsUrl: "https://maps.app.goo.gl/8LANeu4XzatDjyBr9",
} as const;

export const DELIVERY_FEE = 0;

export type CategoryId =
  | "choma"
  | "mains"
  | "chicken"
  | "fish"
  | "extras"
  | "snacks"
  | "drinks";

export interface DishAccompaniment {
  slug: string;
  name: string;
  price: number;
  popular?: boolean;
}

export interface DishPairing {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface MenuDish {
  slug: string;
  name: string;
  category: CategoryId;
  groupKey: string;
  groupLabel: string;
  basePrice: number;
  description?: string;
  tag?: string;
  popular?: boolean;
  image: string;
  /** If the dish has KFC-style accompaniment options */
  accompaniments?: DishAccompaniment[];
  /** For KG items (Choma, Chemsha, Tumbukiza) */
  isKgPricing?: boolean;
  perKgPrice?: number;
  /** For items with simple variants (e.g. Single vs Double shot, 500ml vs 1L) */
  variants?: { slug: string; name: string; price: number }[];
  side?: string | null;
}

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "choma",
    label: "Choma Zone",
    short: "Choma",
    blurb: "Charcoal-grilled beef & goat, sold by the kilo, the house fire signature.",
    image: "/images/choma.jpg",
  },
  {
    id: "mains",
    label: "Signature Mains",
    short: "Mains",
    blurb: "Slow-simmered stews, fry and steak served with your choice of side.",
    image: "/images/stew.jpg",
  },
  {
    id: "chicken",
    label: "Chicken",
    short: "Chicken",
    blurb: "Kienyeji quarter & crispy deep fried chicken, done the Rib House way.",
    image: "/images/chicken.jpg",
  },
  {
    id: "fish",
    label: "Fish",
    short: "Fish",
    blurb: "Whole tilapia (wet stew or dry fry) and golden fish fillet.",
    image: "/images/fish.jpg",
  },
  {
    id: "extras",
    label: "Sides & Extras",
    short: "Sides",
    blurb: "Plain & special plates to build your meal exactly how you like it.",
    image: "/images/pilau.jpg",
  },
  {
    id: "snacks",
    label: "Snacks & Soups",
    short: "Snacks",
    blurb: "Quick bites fresh off the fryer and soul-warming soups.",
    image: "/images/snacks.jpg",
  },
  {
    id: "drinks",
    label: "Drinks & Barista",
    short: "Drinks",
    blurb: "Fresh juices, thick shakes, coffee bar classics and dawa specials.",
    image: "/images/drinks.jpg",
  },
];

/** Standard 5-accompaniment builder for Mains, Chicken, and Fish */
function createAccompaniments(prices: [number, number, number, number, number]): DishAccompaniment[] {
  return [
    { slug: "ugali", name: "Ugali / Chapati", price: prices[0] },
    { slug: "rice", name: "Rice / Mukimo", price: prices[1] },
    { slug: "pilau", name: "Pilau", price: prices[2] },
    { slug: "chips", name: "Chips (Fries)", price: prices[3], popular: true },
    { slug: "chips-masala", name: "Chips Masala", price: prices[4], popular: true },
  ];
}

/** Unified list of dishes across all categories */
export const MENU_DISHES: MenuDish[] = [
  // ── CHOMA ZONE ─────────────────────────────────────────────
  {
    slug: "choma-beef",
    name: "Beef Choma",
    category: "choma",
    groupKey: "choma-zone",
    groupLabel: "Choma (Charcoal Grill)",
    basePrice: 1100,
    perKgPrice: 1100,
    isKgPricing: true,
    popular: true,
    image: "/images/CHOMA_BEEF_1_KG.png",
    description: "Char-grilled over open fire with crispy skin and juicy tenderness, served with kachumbari.",
  },
  {
    slug: "choma-goat",
    name: "Goat Choma",
    category: "choma",
    groupKey: "choma-zone",
    groupLabel: "Choma (Charcoal Grill)",
    basePrice: 1200,
    perKgPrice: 1200,
    isKgPricing: true,
    popular: true,
    image: "/images/Goatchoma1kg.png",
    description: "Tender mountain goat, flame-kissed with rich Kenyan seasoning, house favourite.",
  },
  {
    slug: "chemsha-beef",
    name: "Beef Chemsha",
    category: "choma",
    groupKey: "chemsha-zone",
    groupLabel: "Chemsha Zone",
    basePrice: 1200,
    perKgPrice: 1200,
    isKgPricing: true,
    image: "/images/CHEMSHA_BEEF_1_KG.png",
    description: "Slow-boiled till tender, finished with house herbal broth and spices.",
  },
  {
    slug: "chemsha-goat",
    name: "Goat Chemsha",
    category: "choma",
    groupKey: "chemsha-zone",
    groupLabel: "Chemsha Zone",
    basePrice: 1300,
    perKgPrice: 1300,
    isKgPricing: true,
    image: "/images/Chemshagoat.png",
    description: "Slow-simmered tender goat in a rich, soul-warming natural herb broth.",
  },
  {
    slug: "tumbukiza-beef",
    name: "Tumbukiza Beef",
    category: "choma",
    groupKey: "tumbukiza",
    groupLabel: "Fry / Tumbukiza",
    basePrice: 1300,
    perKgPrice: 1300,
    isKgPricing: true,
    tag: "On Order",
    image: "/images/BEEF FRY TUMBUKIZA.jpeg",
    description: "Rich one-pot rustic stew loaded with potatoes, spinach and prime beef, allow extra time.",
  },
  {
    slug: "tumbukiza-goat",
    name: "Tumbukiza Goat",
    category: "choma",
    groupKey: "tumbukiza",
    groupLabel: "Fry / Tumbukiza",
    basePrice: 1400,
    perKgPrice: 1400,
    isKgPricing: true,
    tag: "On Order",
    image: "/images/GOAT_FRY___TUMBUKIZA_1_KG.png",
    description: "Slow-braised one-pot goat hotpot simmered fresh to your order.",
  },
  {
    slug: "chicken-platter-4",
    name: "Chicken Platter (Feeds 4)",
    category: "choma",
    groupKey: "platters",
    groupLabel: "Sharing Platters",
    basePrice: 1900,
    tag: "Feeds 4",
    popular: true,
    image: "/images/CHICKEN PLATTER FOR 4.png",
    description: "2 portions chicken wet fry · 2 beef fry · 2 chips · 2 ugali/chapati · veggies + spinach · 4 glasses of juice",
  },

  // ── SIGNATURE MAINS (KFC-STYLE WITH ACCOMPANIMENTS) ───────
  {
    slug: "beef-stew",
    name: "Beef Stew / Fry",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 440,
    popular: true,
    image: "/images/BEEF UGALI.jpeg",
    description: "Succulent prime beef simmered in rich gravy or flash-fried with onions & sweet peppers.",
    accompaniments: createAccompaniments([440, 450, 540, 590, 630]),
  },
  {
    slug: "goat-stew",
    name: "Goat Stew / Fry",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 470,
    popular: true,
    image: "/images/GOAT CHEMSHA.jpeg",
    description: "Tender local goat stewed slow in garden tomatoes or sizzled dry with red onions.",
    accompaniments: createAccompaniments([470, 480, 570, 620, 670]),
  },
  {
    slug: "matumbo",
    name: "Matumbo Fry",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 400,
    image: "/images/matumboplainwetfry.png",
    description: "Tender tripe simmered in aromatic house broth and stir-fried with sweet onions and fresh cilantro.",
    accompaniments: createAccompaniments([400, 410, 500, 540, 600]),
  },
  {
    slug: "chicken-wet",
    name: "Chicken Wet Fry",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 450,
    popular: true,
    image: "/images/chicken.jpg",
    description: "Juicy bone-in chicken braised with tomatoes, onions, garlic and Rib House signature spice blend.",
    accompaniments: createAccompaniments([450, 460, 550, 580, 630]),
  },
  {
    slug: "liver",
    name: "Liver",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 450,
    image: "/images/Liverrice.png",
    description: "Fresh beef liver gently pan-seared to juicy perfection with caramelized red onions.",
    accompaniments: createAccompaniments([450, 460, 550, 630, 680]),
  },
  {
    slug: "beef-steak",
    name: "Beef Steak",
    category: "mains",
    groupKey: "mains",
    groupLabel: "Signature Mains",
    basePrice: 590,
    image: "/images/Steakbeaf.png",
    description: "Premium hand-cut beef fillet steak grilled to order with savoury house pan juices.",
    accompaniments: createAccompaniments([590, 600, 690, 740, 800]),
  },

  // ── CHICKEN (KFC-STYLE WITH ACCOMPANIMENTS) ────────────────
  {
    slug: "deep-fried-chicken",
    name: "Deep Fried Chicken",
    category: "chicken",
    groupKey: "chicken",
    groupLabel: "Chicken Specials",
    basePrice: 390,
    popular: true,
    image: "/images/DEEP FRIED CHICKEN WITH CHIPS.png",
    description: "Crispy golden coating, juicy inside, spiced and fried fresh to order.",
    accompaniments: createAccompaniments([390, 400, 490, 600, 630]),
  },
  {
    slug: "kienyeji-chicken",
    name: "Kienyeji Chicken (Quarter)",
    category: "chicken",
    groupKey: "chicken",
    groupLabel: "Chicken Specials",
    basePrice: 470,
    tag: "Free-Range",
    image: "/images/chicken.jpg",
    description: "Free-range local quarter chicken, deep natural flavour, stewed tender or fried crisp.",
    accompaniments: createAccompaniments([470, 480, 570, 620, 670]),
  },

  // ── FISH (KFC-STYLE WITH ACCOMPANIMENTS) ───────────────────
  {
    slug: "tilapia-stew",
    name: "Whole Tilapia (Wet Stew)",
    category: "fish",
    groupKey: "fish",
    groupLabel: "Lake Victoria Fish",
    basePrice: 590,
    popular: true,
    tag: "House Special",
    image: "/images/fishwetfry.png",
    description: "Whole fresh lake tilapia gently simmered in a rich, deeply fragrant tomato & herb stew.",
    accompaniments: createAccompaniments([590, 600, 690, 720, 770]),
  },
  {
    slug: "tilapia-dry",
    name: "Whole Tilapia (Dry Fry)",
    category: "fish",
    groupKey: "fish",
    groupLabel: "Lake Victoria Fish",
    basePrice: 570,
    image: "/images/fishdryfry.png",
    description: "Whole lake tilapia deep-fried crisp then tossed in a sizzling pan with onions & mild chili.",
    accompaniments: createAccompaniments([570, 580, 680, 700, 750]),
  },
  {
    slug: "fish-fillet",
    name: "Fish Fillet",
    category: "fish",
    groupKey: "fish",
    groupLabel: "Lake Victoria Fish",
    basePrice: 490,
    image: "/images/fish.jpg",
    description: "Tender boneless fish fillet seasoned with garlic & lemon, pan-fried to golden flake.",
    accompaniments: createAccompaniments([490, 480, 570, 600, 650]),
  },

  // ── SIDES & EXTRAS ─────────────────────────────────────────
  {
    slug: "extra-chips-masala",
    name: "Chips Masala",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 270,
    popular: true,
    image: "/images/Chipsmasala.png",
    description: "Golden fries smothered in tangy, spiced tomato-garlic masala sauce.",
  },
  {
    slug: "extra-chips-plain",
    name: "Chips Plain",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 220,
    image: "/images/Fries with salad.png",
    description: "Freshly cut hand-fried potato chips, crispy outside and soft inside.",
  },
  {
    slug: "extra-pilau-special",
    name: "Pilau Special",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 270,
    image: "/images/Pilauplain.png",
    description: "Fragrant spiced coastal rice cooked with whole aromatics and beef broth.",
  },
  {
    slug: "extra-mukimo-plain",
    name: "Mukimo Plain",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 200,
    image: "/images/mukimospecial.png",
    description: "Traditional mashed potatoes, pumpkin leaves, soft corn and beans.",
  },
  {
    slug: "extra-rice-plain",
    name: "Rice Plain",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 200,
    image: "/images/Riceplain.png",
    description: "Fluffy steamed long-grain white rice.",
  },
  {
    slug: "extra-rice-mukimo-special",
    name: "Rice / Mukimo Special",
    category: "extras",
    groupKey: "specials",
    groupLabel: "Special Plates",
    basePrice: 250,
    image: "/images/mukimospecial.png",
    description: "Generous combo plate of fragrant steamed rice paired with traditional mukimo.",
  },
  {
    slug: "extra-spinach",
    name: "Spinach",
    category: "extras",
    groupKey: "sides",
    groupLabel: "Sides & Greens",
    basePrice: 120,
    image: "/images/pilau.jpg",
    description: "Fresh sautéed garden greens with onions and light seasoning.",
  },
  {
    slug: "extra-waru",
    name: "Waru",
    category: "extras",
    groupKey: "sides",
    groupLabel: "Sides & Greens",
    basePrice: 120,
    image: "/images/snacks.jpg",
    description: "Soft boiled and lightly buttered Kenyan potatoes.",
  },
  {
    slug: "extra-banana",
    name: "Banana",
    category: "extras",
    groupKey: "sides",
    groupLabel: "Sides & Greens",
    basePrice: 100,
    image: "/images/snacks.jpg",
    description: "Sweet cooked plantain banana.",
  },

  // ── SNACKS & SOUPS ─────────────────────────────────────────
  {
    slug: "snack-samosa",
    name: "Beef Samosa",
    category: "snacks",
    groupKey: "snacks",
    groupLabel: "Hot Snacks",
    basePrice: 70,
    popular: true,
    image: "/images/Samosa.png",
    description: "Crispy triangular pastry loaded with spiced minced beef, onions and chilies.",
  },
  {
    slug: "snack-sausage",
    name: "Sausage",
    category: "snacks",
    groupKey: "snacks",
    groupLabel: "Hot Snacks",
    basePrice: 70,
    image: "/images/Sauseges.png",
    description: "Classic deep-fried beef sausage.",
  },
  {
    slug: "snack-kebab",
    name: "Beef Kebab",
    category: "snacks",
    groupKey: "snacks",
    groupLabel: "Hot Snacks",
    basePrice: 100,
    image: "/images/snacks.jpg",
    description: "Spiced minced beef wrapped in egg coating and deep-fried golden.",
  },
  {
    slug: "snack-chapati",
    name: "Chapati",
    category: "snacks",
    groupKey: "snacks",
    groupLabel: "Hot Snacks",
    basePrice: 70,
    image: "/images/snacks.jpg",
    description: "Warm, layered soft flatbread made fresh on the tawa.",
    variants: [
      { slug: "chapati-white", name: "White Flour", price: 70 },
      { slug: "chapati-brown", name: "Brown / Whole Wheat", price: 70 },
    ],
  },
  {
    slug: "snack-andazi",
    name: "Andazi",
    category: "snacks",
    groupKey: "snacks",
    groupLabel: "Hot Snacks",
    basePrice: 50,
    image: "/images/snacks.jpg",
    description: "Soft coastal-style lightly sweet fried dough with cardamom.",
  },
  {
    slug: "soup-chemsha",
    name: "Chemsha Soup",
    category: "snacks",
    groupKey: "soups",
    groupLabel: "Warm Soups",
    basePrice: 150,
    image: "/images/Goatsoup.png",
    description: "House special: slow-simmered rich meat broth infused with herbs & black pepper.",
  },
  {
    slug: "soup-bone",
    name: "Bone Soup",
    category: "snacks",
    groupKey: "soups",
    groupLabel: "Warm Soups",
    basePrice: 100,
    image: "/images/BONE SOUP.jpeg",
    description: "Slow-simmered marrow bone broth, comforting and nutrient-packed.",
  },

  // ── DRINKS: JUICES & COLD ──────────────────────────────────
  {
    slug: "drink-passion",
    name: "Passion Juice",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Fresh Cold Juices",
    basePrice: 150,
    popular: true,
    image: "/images/drinks.jpg",
    description: "Fresh-pressed daily from sun-ripened passion fruit.",
  },
  {
    slug: "drink-cocktail",
    name: "Cocktail Juice",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Fresh Cold Juices",
    basePrice: 150,
    popular: true,
    image: "/images/drinks.jpg",
    description: "Blended tropical medley of mango, passion and fresh orange.",
  },
  {
    slug: "drink-mango",
    name: "Mango Juice",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Fresh Cold Juices",
    basePrice: 150,
    image: "/images/drinks.jpg",
    description: "Sweet, creamy fresh mango nectar served chilled.",
  },
  {
    slug: "drink-mint-lemonade",
    name: "Mint Lemonade",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Fresh Cold Juices",
    basePrice: 100,
    image: "/images/drinks.jpg",
    description: "Zesty freshly squeezed lemon with crushed garden mint and ice.",
  },
  {
    slug: "drink-soda",
    name: "Soda (300ml)",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Cold Sodas & Water",
    basePrice: 70,
    image: "/images/drinks.jpg",
    description: "Ice cold Coke · Fanta · Sprite · Stoney Tangawizi.",
  },
  {
    slug: "drink-water",
    name: "Mineral Water",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Cold Sodas & Water",
    basePrice: 60,
    image: "/images/drinks.jpg",
    description: "Pure bottled drinking water.",
    variants: [
      { slug: "water-500ml", name: "500 ml", price: 60 },
      { slug: "water-1l", name: "1 Litre", price: 70 },
      { slug: "dasani-500ml", name: "Dasani 500 ml", price: 80 },
      { slug: "dasani-1l", name: "Dasani 1 Litre", price: 100 },
    ],
  },
  {
    slug: "drink-minute-maid",
    name: "Minute Maid",
    category: "drinks",
    groupKey: "cold",
    groupLabel: "Cold Sodas & Water",
    basePrice: 100,
    image: "/images/drinks.jpg",
    description: "Bottled fruit nectar.",
  },

  // ── DRINKS: SHAKES & BARISTA ───────────────────────────────
  {
    slug: "shake-milkshake",
    name: "Flavoured Milkshake",
    category: "drinks",
    groupKey: "shakes",
    groupLabel: "Milkshakes & Ice Cream",
    basePrice: 250,
    popular: true,
    image: "/images/MILKSHAKE_FLAVORED.png",
    description: "Rich blended dairy shake: Chocolate, Strawberry, Vanilla or Blueberry.",
  },
  {
    slug: "shake-oreo",
    name: "Oreo Shake",
    category: "drinks",
    groupKey: "shakes",
    groupLabel: "Milkshakes & Ice Cream",
    basePrice: 300,
    image: "/images/Oreoshake.png",
    description: "Loaded with crushed Oreo cookies, rich milk and vanilla ice cream.",
  },
  {
    slug: "shake-icecream",
    name: "Ice Cream Scoop",
    category: "drinks",
    groupKey: "shakes",
    groupLabel: "Milkshakes & Ice Cream",
    basePrice: 150,
    image: "/images/icecream.png",
    description: "Creamy scoops in vanilla, chocolate or strawberry.",
  },
  {
    slug: "barista-dawa",
    name: "Dawa Special",
    category: "drinks",
    groupKey: "barista",
    groupLabel: "Barista Specials",
    basePrice: 250,
    popular: true,
    tag: "Kenyan Classic",
    image: "/images/Dawa.png",
    description: "Fresh crushed ginger, garlic, honey, lemon and steaming hot water.",
  },
  {
    slug: "barista-tea-special",
    name: "Special Tea",
    category: "drinks",
    groupKey: "barista",
    groupLabel: "Barista Specials",
    basePrice: 250,
    image: "/images/Tea_special.png",
    description: "Premium house blend steeped with secret spices and creamy whole milk.",
  },
  {
    slug: "coffee-cappuccino",
    name: "Cappuccino",
    category: "drinks",
    groupKey: "coffee",
    groupLabel: "Coffee Bar",
    basePrice: 150,
    image: "/images/Cappuccino_Single.png",
    description: "Velvety steamed milk over rich espresso with dusted cocoa.",
    variants: [
      { slug: "cappuccino-single", name: "Single Shot", price: 150 },
      { slug: "cappuccino-double", name: "Double Shot", price: 180 },
    ],
  },
  {
    slug: "coffee-espresso",
    name: "Espresso",
    category: "drinks",
    groupKey: "coffee",
    groupLabel: "Coffee Bar",
    basePrice: 120,
    image: "/images/Espresso_Double.png",
    description: "Pure, intense dark roast Kenyan coffee extraction.",
    variants: [
      { slug: "espresso-single", name: "Single Shot", price: 120 },
      { slug: "espresso-double", name: "Double Shot", price: 150 },
    ],
  },
  {
    slug: "coffee-latte-mocha",
    name: "Latte Mocha",
    category: "drinks",
    groupKey: "coffee",
    groupLabel: "Coffee Bar",
    basePrice: 180,
    image: "/images/Latte_Mocha.png",
    description: "Espresso combined with dark chocolate sauce and steamed microfoam.",
  },
  {
    slug: "hot-masala-tea",
    name: "Masala Tea",
    category: "drinks",
    groupKey: "hot",
    groupLabel: "Hot Beverages",
    basePrice: 100,
    image: "/images/Tea_Masala_White.png",
    description: "Rich Kenyan tea infused with crushed cloves, cinnamon, cardamom and black pepper.",
    variants: [
      { slug: "masala-white", name: "White (with Milk)", price: 100 },
      { slug: "masala-black", name: "Black (No Milk)", price: 100 },
    ],
  },
  {
    slug: "hot-house-coffee",
    name: "House Coffee",
    category: "drinks",
    groupKey: "hot",
    groupLabel: "Hot Beverages",
    basePrice: 200,
    image: "/images/House_Coffee_white.png",
    description: "Freshly brewed Kenyan highland arabica.",
    variants: [
      { slug: "house-coffee-white", name: "White", price: 300 },
      { slug: "house-coffee-black", name: "Black", price: 200 },
    ],
  },
  {
    slug: "hot-black-lemon",
    name: "Black Coffee With Lemon",
    category: "drinks",
    groupKey: "hot",
    groupLabel: "Hot Beverages",
    basePrice: 110,
    image: "/images/Black_Coffee_W_lemon.png",
    description: "Crisp black brewed coffee served with fresh lemon slices.",
  },
  {
    slug: "hot-lemon-tea-honey",
    name: "Lemon Tea with Honey",
    category: "drinks",
    groupKey: "hot",
    groupLabel: "Hot Beverages",
    basePrice: 150,
    image: "/images/Lemontea.png",
    description: "Soothing natural tea with pure honey and freshly squeezed lemon.",
  },
];

/** Recommended pairings for the KFC-style kiosk meal completion */
export const RECOMMENDED_PAIRINGS: DishPairing[] = [
  {
    slug: "drink-passion",
    name: "Fresh Passion Juice",
    price: 150,
    image: "/images/drinks.jpg",
    category: "Cold Juice",
  },
  {
    slug: "drink-soda",
    name: "Chilled Soda (300ml)",
    price: 70,
    image: "/images/drinks.jpg",
    category: "Soda",
  },
  {
    slug: "soup-bone",
    name: "Rich Bone Soup",
    price: 100,
    image: "/images/BONE SOUP.jpeg",
    category: "Soup",
  },
  {
    slug: "extra-spinach",
    name: "Sautéed Spinach",
    price: 120,
    image: "/images/pilau.jpg",
    category: "Greens",
  },
  {
    slug: "snack-samosa",
    name: "Crispy Beef Samosa",
    price: 70,
    image: "/images/Samosa.png",
    category: "Snack",
  },
  {
    slug: "barista-dawa",
    name: "Hot Dawa Special",
    price: 250,
    image: "/images/Dawa.png",
    category: "Barista",
  },
];

/**
 * Backward compatibility SeedItem interface and MENU_ITEMS array
 */
export interface SeedItem {
  slug: string;
  name: string;
  side: string | null;
  category: CategoryId;
  groupKey: string;
  groupLabel: string;
  price: number;
  description?: string;
  tag?: string;
  popular?: boolean;
  image?: string;
}

export const MENU_ITEMS: SeedItem[] = MENU_DISHES.flatMap((dish) => {
  if (dish.accompaniments && dish.accompaniments.length > 0) {
    return dish.accompaniments.map((acc) => ({
      slug: `${dish.slug}-${acc.slug}`,
      name: dish.name,
      side: acc.name,
      category: dish.category,
      groupKey: dish.groupKey,
      groupLabel: dish.groupLabel,
      price: acc.price,
      description: dish.description,
      tag: dish.tag,
      popular: dish.popular,
      image: dish.image,
    }));
  }
  return [
    {
      slug: dish.slug,
      name: dish.name,
      side: dish.side ?? null,
      category: dish.category,
      groupKey: dish.groupKey,
      groupLabel: dish.groupLabel,
      price: dish.basePrice,
      description: dish.description,
      tag: dish.tag,
      popular: dish.popular,
      image: dish.image,
    },
  ];
});

export const FIRE_PICKS = [
  "chicken-platter-4",
  "choma-goat",
  "choma-beef",
  "beef-stew",
  "extra-chips-masala",
  "barista-dawa",
];
