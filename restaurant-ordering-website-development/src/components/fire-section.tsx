import { Bike, Flame, Leaf, Timer } from "lucide-react";

const FEATURES = [
  {
    icon: Flame,
    title: "Real charcoal fire",
    text: "Every piece of meat kisses open flame, giving that smoky char you can't fake.",
  },
  {
    icon: Leaf,
    title: "Fresh, every morning",
    text: "Meat, sukuma, waru and spices sourced daily. Nothing frozen, nothing tired.",
  },
  {
    icon: Timer,
    title: "Made to order",
    text: "Tumbukiza, platters and chemsha are fired up when you order, well worth the wait.",
  },
  {
    icon: Bike,
    title: "We deliver",
    text: "Hot to your door, or ready for pickup. Call us and it's handled.",
  },
];

export function FireSection() {
  return (
    <section id="fire" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <p
        aria-hidden
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none tracking-[0.05em] whitespace-nowrap text-cream/[0.06] select-none"
      >
        RIB HOUSE
      </p>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* images */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/story.jpg"
              alt="Mixed grilled meat platter at Rib House"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.25em] text-flame uppercase backdrop-blur-sm shadow-sm">
              Chicken platter · feeds 4
            </div>
          </div>
          <div className="absolute -right-3 -bottom-8 hidden w-44 rotate-3 overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block lg:-right-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/snacks.jpg"
              alt="Masala chips"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        {/* copy */}
        <div>
          <h2 className="font-display text-5xl leading-[0.95] tracking-[0.03em] sm:text-6xl">
            BORN FROM <span className="ember-gradient-text">CHARCOAL</span>,
            <br />
            RAISED ON FLAVOUR
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-sand">
            Rib House started with one grill, one secret dry rub, and a promise:
            <span className="font-bold text-cream"> best quality grilled meat</span>,
            every single plate. Today the fire burns bigger: choma by the kilo,
            kienyeji chicken, whole tilapia, barista specials and fresh juices,
            but the promise hasn&apos;t moved an inch.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-line bg-white p-4 shadow-sm transition-colors hover:border-ember/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-flame/20 to-ember/20 text-flame transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="size-5" />
                </span>
                <p className="mt-3 text-sm font-extrabold text-cream">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ash">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
