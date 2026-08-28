import Link from "next/link";
import { Clock3, Flame, Mail, MapPin, Phone } from "lucide-react";
import { RESTAURANT } from "@/lib/menu-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-soot">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-flame via-ember to-blood text-coal">
              <Flame className="size-5.5" strokeWidth={2.4} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-2xl tracking-[0.08em]">RIB HOUSE</span>
              <span className="block text-[10px] font-bold tracking-[0.28em] text-ember uppercase">
                Best Quality Grilled Meat
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">
            Charcoal-grilled choma, hearty stews, whole fish, snacks and drinks —
            ordered online, delivered hot.
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold tracking-[0.3em] text-sand uppercase">
            Talk to us
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`tel:${RESTAURANT.phoneIntl}`}
                className="flex items-center gap-3 font-bold text-cream transition-colors hover:text-flame"
              >
                <Phone className="size-4 text-ember" /> {RESTAURANT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${RESTAURANT.email}`}
                className="flex items-center gap-3 text-sand transition-colors hover:text-flame"
              >
                <Mail className="size-4 text-ember" /> {RESTAURANT.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sand">
              <Clock3 className="size-4 text-ember" /> {RESTAURANT.hours}
            </li>
            <li>
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sand transition-colors hover:text-flame"
              >
                <MapPin className="size-4 text-ember" /> {RESTAURANT.town} · Open in Maps ↗
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-extrabold tracking-[0.3em] text-sand uppercase">
            Quick links
          </p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            <li>
              <Link href="/#menu" className="text-sand transition-colors hover:text-flame">
                Full menu
              </Link>
            </li>
            <li>
              <Link href="/#fire" className="text-sand transition-colors hover:text-flame">
                The fire — our story
              </Link>
            </li>
            <li>
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand transition-colors hover:text-flame"
              >
                Find us on Google Maps ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-ash">
            © {new Date().getFullYear()} Rib House — Best Quality Grilled Meat.
          </p>
          <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.3em] text-ash uppercase">
            <Flame className="size-3 text-ember" /> Order · Eat · Repeat
          </p>
        </div>
      </div>
    </footer>
  );
}
