import { Metadata } from "next";
import Script from "next/script";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Xandcastle - Cool T-Shirts for Kids & Teens | Windsor Souvenirs",
  description: "Shop unique clothing designs for kids and teens at Xandcastle. Cool t-shirts, hoodies, and castle-themed apparel. Plus exclusive Windsor tourist merchandise and British heritage souvenirs!",
  keywords: ["cool t-shirts for kids", "teens fashion", "castle-themed clothing", "Windsor souvenirs", "kids clothing UK", "youth apparel", "custom t-shirts", "Windsor Castle merchandise"],
  openGraph: {
    title: "Xandcastle - Cool T-Shirts for Kids & Teens | Windsor Souvenirs",
    description: "Shop unique clothing designs for kids and teens. Cool t-shirts, hoodies, and castle-themed apparel. Plus exclusive Windsor tourist merchandise!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Xandcastle - Cool clothing for kids and teens",
      }
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://xandcastle.com",
  },
};

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Xandcastle",
    url: "https://xandcastle.com",
    logo: "https://xandcastle.com/logo.png",
    description: "Unique clothing designs for kids and teens. Cool t-shirts, hoodies, and castle-themed apparel.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressRegion: "Berkshire",
      addressLocality: "Windsor"
    },
    sameAs: [
      "https://twitter.com/xandcastle",
      "https://instagram.com/xandcastle",
      "https://facebook.com/xandcastle"
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Product",
        name: "Kids and Teens Clothing"
      }
    }
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <HomeClient />
    </>
  );
}