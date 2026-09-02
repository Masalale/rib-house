import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { MenuExplorer } from "@/components/menu-explorer";
import { FireSection } from "@/components/fire-section";
import { CtaBanner } from "@/components/cta-banner";
import { SiteFooter } from "@/components/site-footer";
import { MENU_ITEMS } from "@/lib/menu-data";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />

      <section id="menu" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10">
          <h2 className="font-display text-5xl leading-[0.9] tracking-[0.02em] sm:text-6xl text-cream">
            OUR <span className="ember-gradient-text">MENU</span>
          </h2>
        </div>

        <MenuExplorer items={MENU_ITEMS} />
      </section>

      <FireSection />
      <CtaBanner />
      <SiteFooter />
    </main>
  );
}