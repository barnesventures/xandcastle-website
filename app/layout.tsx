import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

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
        <Header />
        {children}
      </body>
    </html>
  );
}