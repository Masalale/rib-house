// ─────────────────────────────────────────────────────────────
// RIB HOUSE — full menu dataset (transcribed from the house menu)
// ─────────────────────────────────────────────────────────────

export const RESTAURANT = {
  name: "Rib House",
  tagline: "Best Quality Grilled Meat",
  phone: "0724 594 204",
  phoneIntl: "+254724594204",
  email: "ribhouseke@gmail.com",
  hours: "Mon – Sat: 5:30 AM – 11:00 PM · Sun: 5:30 AM – 10:00 PM",
  town: "Nairobi, Kenya",
  mapsUrl: "https://maps.app.goo.gl/8LANeu4XzatDjyBr9",
} as const;

export const DELIVERY_FEE = 100;

export type CategoryId =
  | "choma"
  | "mains"
  | "chicken"
  | "fish"
  | "extras"
  | "snacks"
  | "drinks";

export interface SeedItem {
  slug: string;
  /** Dish name, e.g. "Beef Stew / Fry" */
  name: string;
  /** Accompaniment / size, e.g. "Chips Masala" or "1 KG" */
  side: string | null;
  category: CategoryId;
  groupKey: string;
  groupLabel: string;
  price: number;
  description?: string;
  tag?: string;
  popular?: boolean;
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
    blurb: "Charcoal-grilled beef & goat, sold by the kilo — the house fire signature.",
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
    blurb: "Whole tilapia — wet stew or dry fry — and golden fish fillet.",
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

const SIDES = ["Ugali / Chapati", "Rice / Mukimo", "Pilau", "Chips", "Chips Masala"] as const;
const SIDE_SLUGS = ["ugali", "rice", "pilau", "chips", "chips-masala"] as const;

/** Build a 5-side group (Ugali/Rice/Pilau/Chips/Chips Masala) */
function stewGroup(
  category: CategoryId,
  groupKey: string,
  groupLabel: string,
  prices: [number, number, number, number, number],
  description?: string,
): SeedItem[] {
  return prices.map((price, i) => ({
    slug: `${groupKey}-${SIDE_SLUGS[i]}`,
    name: groupLabel,
    side: SIDES[i],
    category,
    groupKey,
    groupLabel,
    price,
    description,
  }));
}

export const MENU_ITEMS: SeedItem[] = [
  // ── CHOMA ZONE ─────────────────────────────────────────────
  { slug: "choma-beef-1kg", name: "Beef Choma", side: "1 KG", category: "choma", groupKey: "choma-zone", groupLabel: "Choma — Charcoal Grill", price: 1100, popular: true, description: "Char-grilled over open flame, served with kachumbari" },
  { slug: "choma-beef-half", name: "Beef Choma", side: "½ KG", category: "choma", groupKey: "choma-zone", groupLabel: "Choma — Charcoal Grill", price: 550, description: "Char-grilled over open flame, served with kachumbari" },
  { slug: "choma-goat-1kg", name: "Goat Choma", side: "1 KG", category: "choma", groupKey: "choma-zone", groupLabel: "Choma — Charcoal Grill", price: 1200, popular: true, description: "Tender goat, flame-kissed — the house favourite" },
  { slug: "choma-goat-half", name: "Goat Choma", side: "½ KG", category: "choma", groupKey: "choma-zone", groupLabel: "Choma — Charcoal Grill", price: 600, description: "Tender goat, flame-kissed — the house favourite" },
  { slug: "chemsha-beef-1kg", name: "Beef Chemsha", side: "1 KG", category: "choma", groupKey: "chemsha-zone", groupLabel: "Chemsha Zone", price: 1200, description: "Slow-boiled till tender, finished with house spices" },
  { slug: "chemsha-beef-half", name: "Beef Chemsha", side: "½ KG", category: "choma", groupKey: "chemsha-zone", groupLabel: "Chemsha Zone", price: 600, description: "Slow-boiled till tender, finished with house spices" },
  { slug: "chemsha-goat-1kg", name: "Goat Chemsha", side: "1 KG", category: "choma", groupKey: "chemsha-zone", groupLabel: "Chemsha Zone", price: 1300, description: "Slow-boiled till tender, finished with house spices" },
  { slug: "chemsha-goat-half", name: "Goat Chemsha", side: "½ KG", category: "choma", groupKey: "chemsha-zone", groupLabel: "Chemsha Zone", price: 650, description: "Slow-boiled till tender, finished with house spices" },
  { slug: "tumbukiza-beef", name: "Tumbukiza Beef", side: "1 KG", category: "choma", groupKey: "tumbukiza", groupLabel: "Fry / Tumbukiza", price: 1300, tag: "On Order", description: "Rich one-pot fry — made fresh to order, allow extra time" },
  { slug: "tumbukiza-goat", name: "Tumbukiza Goat", side: "1 KG", category: "choma", groupKey: "tumbukiza", groupLabel: "Fry / Tumbukiza", price: 1400, tag: "On Order", description: "Rich one-pot fry — made fresh to order, allow extra time" },
  {
    slug: "chicken-platter-4",
    name: "Chicken Platter — Feeds 4",
    side: null,
    category: "choma",
    groupKey: "platters",
    groupLabel: "Sharing Platters",
    price: 1900,
    tag: "On Order",
    popular: true,
    description: "2 portions chicken wet fry · 2 beef fry · 2 chips · 2 ugali/chapati · veggies + spinach · 4 glasses of juice",
  },

  // ── SIGNATURE MAINS ────────────────────────────────────────
  ...stewGroup("mains", "matumbo", "Matumbo Fry", [400, 410, 500, 540, 600]),
  ...stewGroup("mains", "beef-stew", "Beef Stew / Fry", [440, 450, 540, 590, 630]),
  ...stewGroup("mains", "liver", "Liver", [450, 460, 550, 630, 680]),
  ...stewGroup("mains", "goat-stew", "Goat Stew / Fry", [470, 480, 570, 620, 670]),
  ...stewGroup("mains", "chicken-wet", "Chicken Wet Fry", [450, 460, 550, 580, 630]),
  ...stewGroup("mains", "beef-steak", "Beef Steak", [590, 600, 690, 740, 800]),

  // ── CHICKEN ────────────────────────────────────────────────
  ...stewGroup("chicken", "kienyeji", "Kienyeji Chicken — Quarter", [470, 480, 570, 620, 670], "Free-range quarter chicken, stewed or fried"),
  ...stewGroup("chicken", "deep-fried", "Deep Fried Chicken", [390, 400, 490, 600, 630], "Crispy golden coating, juicy inside"),

  // ── FISH ───────────────────────────────────────────────────
  ...stewGroup("fish", "fish-fillet", "Fish Fillet", [490, 480, 570, 600, 650]),
  ...stewGroup("fish", "tilapia-stew", "Whole Tilapia — Wet Stew", [590, 600, 690, 720, 770], "Whole fish simmered in rich tomato stew"),
  ...stewGroup("fish", "tilapia-dry", "Whole Tilapia — Dry Fry", [570, 580, 680, 700, 750], "Whole fish fried crisp with onions"),

  // ── SIDES & EXTRAS ─────────────────────────────────────────
  { slug: "extra-waru", name: "Waru", side: null, category: "extras", groupKey: "sides", groupLabel: "Sides & Extras", price: 120, description: "Soft boiled potatoes" },
  { slug: "extra-spinach", name: "Spinach", side: null, category: "extras", groupKey: "sides", groupLabel: "Sides & Extras", price: 120, description: "Fresh sautéed greens" },
  { slug: "extra-banana", name: "Banana", side: null, category: "extras", groupKey: "sides", groupLabel: "Sides & Extras", price: 100, description: "Sweet cooked banana" },
  { slug: "extra-rice-mukimo-special", name: "Rice / Mukimo Special", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 250 },
  { slug: "extra-pilau-special", name: "Pilau Special", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 270 },
  { slug: "extra-chips-plain", name: "Chips Plain", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 220 },
  { slug: "extra-chips-masala", name: "Chips Masala", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 270, popular: true },
  { slug: "extra-rice-plain", name: "Rice Plain", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 200 },
  { slug: "extra-mukimo-plain", name: "Mukimo Plain", side: null, category: "extras", groupKey: "specials", groupLabel: "Special Plates", price: 200 },

  // ── SNACKS & SOUPS ─────────────────────────────────────────
  { slug: "snack-samosa", name: "Samosa", side: null, category: "snacks", groupKey: "snacks", groupLabel: "Snacks", price: 70, description: "Crispy shell, spiced filling" },
  { slug: "snack-sausage", name: "Sausage", side: null, category: "snacks", groupKey: "snacks", groupLabel: "Snacks", price: 70 },
  { slug: "snack-andazi", name: "Andazi", side: null, category: "snacks", groupKey: "snacks", groupLabel: "Snacks", price: 50, description: "Soft coastal-style fried dough" },
  { slug: "snack-kebab", name: "Beef Kebab", side: null, category: "snacks", groupKey: "snacks", groupLabel: "Snacks", price: 100 },
  { slug: "snack-chapati", name: "Chapati", side: "White / Brown", category: "snacks", groupKey: "snacks", groupLabel: "Snacks", price: 70 },
  { slug: "soup-bone", name: "Bone Soup", side: null, category: "snacks", groupKey: "soups", groupLabel: "Soups", price: 100, description: "Slow-simmered marrow broth" },
  { slug: "soup-chemsha", name: "Chemsha Soup", side: null, category: "snacks", groupKey: "soups", groupLabel: "Soups", price: 150, description: "House special — rich & spicy" },

  // ── DRINKS: COLD ───────────────────────────────────────────
  { slug: "drink-soda", name: "Soda", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 70, description: "Coke · Fanta · Sprite · Stoney" },
  { slug: "drink-pepsi", name: "Pepsi", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 70 },
  { slug: "drink-minute-maid", name: "Minute Maid", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 100 },
  { slug: "drink-dasani-1l", name: "Dasani", side: "1 Litre", category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 100 },
  { slug: "drink-dasani-500", name: "Dasani", side: "500 ml", category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 80 },
  { slug: "drink-water-500", name: "Mineral Water", side: "500 ml", category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 60 },
  { slug: "drink-water-1l", name: "Mineral Water", side: "1 Litre", category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 70 },
  { slug: "drink-passion", name: "Passion Juice", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 150, description: "Fresh-pressed daily" },
  { slug: "drink-cocktail", name: "Cocktail Juice", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 150, popular: true },
  { slug: "drink-mango", name: "Mango Juice", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 150 },
  { slug: "drink-mint-lemonade", name: "Mint Lemonade", side: null, category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 100 },
  { slug: "drink-juice-takeaway", name: "Juice Take Away", side: "1 Litre", category: "drinks", groupKey: "cold", groupLabel: "Cold Beverages", price: 200 },

  // ── DRINKS: SHAKES ─────────────────────────────────────────
  { slug: "shake-milkshake", name: "Milkshake", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 250, description: "Chocolate · Blueberry · Strawberry · Vanilla" },
  { slug: "shake-oreo", name: "Oreo Shake", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 300 },
  { slug: "shake-espresso", name: "Espresso Shake", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 250 },
  { slug: "shake-smoothie", name: "Smoothie", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 200, description: "Banana · Passion · Tropical" },
  { slug: "shake-icecream", name: "Ice Cream Scoop", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 150 },
  { slug: "shake-lemonade", name: "Lemonade", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 100, description: "Blue · Classic · Mint" },
  { slug: "shake-iced-coffee", name: "Iced Coffee", side: null, category: "drinks", groupKey: "shakes", groupLabel: "Milkshakes & Smoothies", price: 250 },

  // ── DRINKS: COFFEE BAR ─────────────────────────────────────
  { slug: "coffee-cappuccino", name: "Cappuccino", side: "Single", category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 150, description: "Double shot — 180" },
  { slug: "coffee-espresso", name: "Espresso", side: "Single", category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 120, description: "Double shot — 150" },
  { slug: "coffee-americano", name: "Americano", side: null, category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 150 },
  { slug: "coffee-latte-macchiato", name: "Latte Macchiato", side: null, category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 150 },
  { slug: "coffee-latte-mocha", name: "Latte Mocha", side: null, category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 180 },
  { slug: "coffee-cafe-latte", name: "Café Latte", side: null, category: "drinks", groupKey: "coffee", groupLabel: "Coffee Bar", price: 150 },

  // ── DRINKS: HOT ────────────────────────────────────────────
  { slug: "hot-white-coffee", name: "White Coffee", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-black-coffee", name: "Black Coffee", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 80 },
  { slug: "hot-black-coffee-lemon", name: "Black Coffee", side: "With Lemon", category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 110 },
  { slug: "hot-masala-white", name: "Masala Tea", side: "White", category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-masala-black", name: "Masala Tea", side: "Black", category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-milk", name: "Milk", side: "Hot", category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-lemon-water", name: "Lemon Water", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 70 },
  { slug: "hot-lemon-tea", name: "Lemon Tea", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-lemon-tea-honey", name: "Lemon Tea", side: "With Honey", category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 150 },
  { slug: "hot-white-chocolate", name: "White Chocolate", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 100 },
  { slug: "hot-black-milo", name: "Black Milo", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 90 },
  { slug: "hot-honey-cone", name: "Honey Cone", side: null, category: "drinks", groupKey: "hot", groupLabel: "Hot Beverages", price: 50 },

  // ── DRINKS: BARISTA SPECIALS ───────────────────────────────
  { slug: "barista-dawa", name: "Dawa", side: null, category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 250, popular: true, description: "Ginger, garlic, honey & lemon — the Kenyan classic" },
  { slug: "barista-tea-special", name: "Special Tea", side: null, category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 250 },
  { slug: "barista-house-white", name: "House Coffee", side: "White", category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 300 },
  { slug: "barista-house-black", name: "House Coffee", side: "Black", category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 200 },
  { slug: "barista-smoothie", name: "House Smoothie", side: null, category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 150 },
  { slug: "barista-milkshake", name: "House Milkshake", side: null, category: "drinks", groupKey: "barista", groupLabel: "Barista Specials", price: 100 },
];

/** Slugs highlighted in the “Fire Picks” rail */
export const FIRE_PICKS = [
  "chicken-platter-4",
  "choma-goat-1kg",
  "choma-beef-1kg",
  "beef-stew-chips-masala",
  "extra-chips-masala",
  "barista-dawa",
];
