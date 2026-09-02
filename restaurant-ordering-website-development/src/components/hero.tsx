"use client";

import { motion } from "framer-motion";
import { Bike, Clock3, Flame, Phone, UtensilsCrossed } from "lucide-react";
import { EmberCanvas } from "@/components/ember-canvas";
import { RESTAURANT } from "@/lib/menu-data";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16" id="top">
      {/* ambient glows - subtle on white */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-ember/8 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-flame/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-8 lg:pt-16 lg:pb-24">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-7">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-[clamp(4.2rem,11vw,9.5rem)] leading-[0.86] tracking-[0.01em]"
          >
            MEAT MEETS
            <br />
            <span className="ember-gradient-text">FIRE HERE</span>
            <span className="text-ember">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-sand sm:text-lg"
          >
            Welcome to <span className="font-bold text-cream">Rib House</span>, best
            quality grilled meat. Choma by the kilo, slow-simmered stews, whole
            tilapia, thick shakes and everything a proper Kenyan feast needs.
            Cooked over real flame, delivered hot to your door.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-flame via-ember to-blood px-7 py-3.5 text-sm font-extrabold tracking-wide text-coal uppercase glow-ember transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            >
              <UtensilsCrossed className="size-4.5" strokeWidth={2.6} />
              Order from the menu
            </a>
            <a
              href={`tel:${RESTAURANT.phoneIntl}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-extrabold tracking-wide text-cream uppercase shadow-sm transition-colors hover:border-ember/60 hover:text-flame"
            >
              <Phone className="size-4.5 text-ember" />
              {RESTAURANT.phone}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
          >
            {[
              { icon: Bike, top: "Fast delivery", sub: "Hot & on time" },
              { icon: Flame, top: "Real charcoal", sub: "No shortcuts" },
              { icon: Clock3, top: "Open daily", sub: "From 5:30 AM" },
            ].map((s) => (
              <div key={s.top} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-line bg-soot text-flame shadow-sm">
                  <s.icon className="size-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-extrabold text-cream">{s.top}</span>
                  <span className="block text-xs text-ash">{s.sub}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 translate-y-4 rounded-t-[10rem] rounded-b-[2rem] bg-gradient-to-b from-ember/40 to-blood/40 blur-2xl animate-pulse-slow" />
            <div className="absolute inset-0 overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border border-ember/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.jpg"
                alt="Ribs grilling over open flame at Rib House"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
            </div>
            <EmberCanvas className="opacity-60" />

            {/* floating badge */}
            <div className="absolute -left-6 bottom-10 animate-floaty rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:-left-10">
              <p className="font-display text-2xl leading-none text-flame">GOAT CHOMA</p>
              <p className="mt-1 text-xs font-bold text-sand">
                1 KG · <span className="text-cream">Ksh 1,200</span>
              </p>
            </div>
            <div
              className="absolute -right-4 top-12 animate-floaty rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:-right-8"
              style={{ animationDelay: "-3.4s" }}
            >
              <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-flame uppercase">
                <Flame className="size-3.5 animate-flicker" /> We deliver
              </p>
              <p className="mt-1 text-xs text-ash">Order · Eat · Repeat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
