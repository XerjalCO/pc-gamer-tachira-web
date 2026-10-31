import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackToTop } from "@/components/BackToTop";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://pcgtachira.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PC Gamer Táchira | Computadoras y Laptops",
  description:
    "Venta de equipos usados y refurbished importados de USA. Tienda en San Cristóbal, Venezuela con garantía.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "PC Gamer Táchira | Computadoras y Laptops",
    description:
      "Venta de equipos usados y refurbished importados de USA. Tienda en San Cristóbal, Venezuela con garantía.",
    url: siteUrl,
    type: "website",
    siteName: "PC Gamer Táchira",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}
