import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { MenuExplorer } from "@/components/menu-explorer";
import { FireSection } from "@/components/fire-section";
import { CtaBanner } from "@/components/cta-banner";
import { SiteFooter } from "@/components/site-footer";
import { getMenuItems } from "@/lib/menu-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getMenuItems();

  return (
    <main>
      <Hero />
      <Marquee />

      <section id="menu" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-5xl leading-[0.9] tracking-[0.02em] sm:text-6xl text-cream">
              OUR <span className="ember-gradient-text">MENU</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ash">
            Everything is cooked fresh over charcoal and seasoned the Rib House
            way. Tap <span className="font-bold text-flame">+</span> to add to your
            order — delivery or pickup, your call.
          </p>
        </div>

        <MenuExplorer items={items} />
      </section>

      <FireSection />
      <CtaBanner />
      <SiteFooter />
    </main>
  );
}
