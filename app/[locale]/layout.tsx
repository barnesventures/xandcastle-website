import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import "../globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { CartProvider } from "@/app/contexts/CartContext";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import { CookieConsentProvider } from "@/app/contexts/CookieConsentContext";
import { MiniCart } from "@/app/components/MiniCart";
import { SessionProvider } from "@/app/components/SessionProvider";
import { GoogleAnalytics } from "@/app/components/GoogleAnalytics";
import { CookieConsentBanner } from "@/app/components/CookieConsentBanner";
import DevelopmentIndicator from "@/app/components/DevelopmentIndicator";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  
  // Define metadata for each locale
  const metadataByLocale: Record<Locale, Metadata> = {
    en: {
      title: {
        default: "Xandcastle - Cool T-Shirts for Kids & Teens",
        template: '%s | Xandcastle'
      },
      description: "Unique clothing designs for kids and teens. Shop cool t-shirts, hoodies, and castle-themed apparel. Plus Windsor tourist merchandise!",
    },
    es: {
      title: {
        default: "Xandcastle - Camisetas Geniales para Niños y Adolescentes",
        template: '%s | Xandcastle'
      },
      description: "Diseños únicos de ropa para niños y adolescentes. Compra camisetas geniales, sudaderas y ropa temática de castillo. ¡Además mercancía turística de Windsor!",
    },
    fr: {
      title: {
        default: "Xandcastle - T-Shirts Cool pour Enfants et Ados",
        template: '%s | Xandcastle'
      },
      description: "Designs de vêtements uniques pour enfants et ados. Achetez des t-shirts cool, des sweats à capuche et des vêtements thématiques château. Plus marchandise touristique Windsor!",
    },
    de: {
      title: {
        default: "Xandcastle - Coole T-Shirts für Kinder und Teenager",
        template: '%s | Xandcastle'
      },
      description: "Einzigartige Kleidungsdesigns für Kinder und Teenager. Kaufe coole T-Shirts, Hoodies und Schloss-thematische Kleidung. Plus Windsor Touristen-Merchandise!",
    }
  };

  const localeMetadata = metadataByLocale[locale as Locale] || metadataByLocale.en;

  return {
    metadataBase: new URL('https://xandcastle.com'),
    ...localeMetadata,
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
      ...localeMetadata,
      url: `https://xandcastle.com${locale === 'en' ? '' : `/${locale}`}`,
      siteName: "Xandcastle",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Xandcastle - Cool clothing for kids and teens",
        }
      ],
      locale: locale === 'en' ? 'en_GB' : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      ...localeMetadata,
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
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}