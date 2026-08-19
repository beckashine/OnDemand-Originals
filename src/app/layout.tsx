import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description =
  "Authentic sports memorabilia. One-of-a-kind and limited pieces, sourced and sold directly.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "On Demand Originals",
  description,
  openGraph: {
    title: "On Demand Originals",
    description,
    siteName: "On Demand Originals",
    url: siteUrl,
    type: "website",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "On Demand Originals" }],
  },
  twitter: {
    card: "summary",
    title: "On Demand Originals",
    description,
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
