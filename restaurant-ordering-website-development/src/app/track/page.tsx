import type { Metadata } from "next";
import { TrackOrder } from "@/components/track-order";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Track Your Order — Rib House",
  description: "Follow your Rib House order from the grill to your door.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code : "";
  const phone = typeof sp.phone === "string" ? sp.phone : "";

  return (
    <main className="flex min-h-svh flex-col pt-16">
      <TrackOrder initialCode={code} initialPhone={phone} />
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </main>
  );
}
