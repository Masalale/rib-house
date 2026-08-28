import { Flame } from "lucide-react";

const ITEMS = [
  "Nyama Choma",
  "Chips Masala",
  "Goat Chemsha",
  "Whole Tilapia",
  "Kienyeji Chicken",
  "Fresh Juice",
  "Beef Tumbukiza",
  "Pilau",
  "Dawa Special",
  "Sharing Platters",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-soot py-3.5">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-xl tracking-[0.14em] text-sand">
              {item.toUpperCase()}
            </span>
            <Flame className="size-4 text-ember/80" />
          </span>
        ))}
      </div>
    </div>
  );
}
