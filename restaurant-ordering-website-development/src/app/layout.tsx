import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  title: "Rib House",
  description:
    "Charcoal-grilled goat & beef choma, hearty stews, whole Lake Victoria tilapia, snacks and drinks. Order online for fast delivery or pickup in Nairobi.",
  keywords: ["Rib House", "nyama choma", "restaurant", "delivery", "Nairobi", "grilled meat", "Kenya"],
  icons: {
    icon: "/logo_background.jpeg",
    shortcut: "/logo_background.jpeg",
    apple: "/logo_background.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/jpeg" href="/logo_background.jpeg" />
        <link rel="apple-touch-icon" href="/logo_background.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbf9f6] text-[#181512] font-sans antialiased">
        <CartProvider>
          <SiteHeader />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
