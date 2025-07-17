import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";
import { MiniCart } from "./components/MiniCart";
import { SessionProvider } from "./components/SessionProvider";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import DevelopmentIndicator from "./components/DevelopmentIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://xandcastle.com'),
  title: {
    default: "Xandcastle - Cool T-Shirts for Kids & Teens",
    template: '%s | Xandcastle'
  },
  description: "Unique clothing designs for kids and teens. Shop cool t-shirts, hoodies, and castle-themed apparel. Plus Windsor tourist merchandise!",
  keywords: ["cool t-shirts for kids", "teens fashion", "castle-themed clothing", "Windsor souvenirs", "kids clothing", "youth apparel", "custom t-shirts", "print on demand"],
  authors: [{ name: "Xandcastle" }],
  creator: "Xandcastle",
  publisher: "Xandcastle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Xandcastle - Cool T-Shirts for Kids & Teens",
    description: "Unique clothing designs for kids and teens. Shop cool t-shirts, hoodies, and castle-themed apparel. Plus Windsor tourist merchandise!",
    url: "https://xandcastle.com",
    siteName: "Xandcastle",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Xandcastle - Cool clothing for kids and teens",
      }
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xandcastle - Cool T-Shirts for Kids & Teens",
    description: "Unique clothing designs for kids and teens. Shop cool t-shirts, hoodies, and castle-themed apparel!",
    images: ["/logo.png"],
    creator: "@xandcastle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <CookieConsentProvider>
            <CurrencyProvider>
              <CartProvider>
                <GoogleAnalytics />
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
                <MiniCart />
                <CookieConsentBanner />
                <DevelopmentIndicator />
              </CartProvider>
            </CurrencyProvider>
          </CookieConsentProvider>
        </SessionProvider>
      </body>
    </html>
  );
}