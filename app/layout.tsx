import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { MiniCart } from "./components/MiniCart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xandcastle - Cool T-Shirts for Kids & Teens",
  description: "Unique clothing designs for kids and teens. Shop cool t-shirts, hoodies, and castle-themed apparel. Plus Windsor tourist merchandise!",
  keywords: "cool t-shirts for kids, teens fashion, castle-themed clothing, Windsor souvenirs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CurrencyProvider>
          <CartProvider>
            <Header />
            {children}
            <MiniCart />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}