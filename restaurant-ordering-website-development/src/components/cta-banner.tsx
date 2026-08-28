import { Clock3, Mail, Phone } from "lucide-react";
import { RESTAURANT } from "@/lib/menu-data";
import { EmberCanvas } from "@/components/ember-canvas";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/choma.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
      <EmberCanvas className="opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-[0.02em]">
          HUNGRY? <span className="ember-gradient-text">WE DELIVER.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sand">
          One call and the fire is yours. Choma, platters and tumbukiza are made
          fresh on order — give us a shout and we&apos;ll handle the rest.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${RESTAURANT.phoneIntl}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-flame via-ember to-blood px-8 py-4 font-display text-2xl tracking-[0.1em] text-coal glow-ember transition-transform hover:scale-105 active:scale-95"
          >
            <Phone className="size-5" strokeWidth={2.6} />
            {RESTAURANT.phone}
          </a>
          <a
            href={`mailto:${RESTAURANT.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-4 text-sm font-bold text-cream shadow-sm transition-colors hover:border-ember/60 hover:text-flame"
          >
            <Mail className="size-4 text-ember" />
            {RESTAURANT.email}
          </a>
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-ash uppercase">
          <Clock3 className="size-3.5" /> {RESTAURANT.hours}
        </p>
      </div>
    </section>
  );
}
