import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/blackmail-theme.css";
import { siteDescription, siteName, siteUrl } from "./lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BlackMail - Fast & Anonymous Temporary Email Service",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "temp mail",
    "temporary email",
    "disposable email",
    "fake email generator",
    "10 minute mail",
    "anonymous email",
    "anti spam email",
    "burn after read mail",
    
    "blackmail temp mail",
  ],
  authors: [{ name: "BlackMail" }],
  creator: "BlackMail",
  publisher: "BlackMail",
  alternates: {
    canonical: siteUrl,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BlackMail - Temporary & Disposable Email Service",
    description:
      "Generate instant disposable email addresses. Keep your personal inbox safe from spam, tracking, and phishing.",
    url: siteUrl,
    siteName: "BlackMail",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Temporary Email Service`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackMail - Fast & Anonymous Temporary Email Service",
    description:
      "Generate instant disposable email addresses. Keep your personal inbox safe from spam.",
    images: [`${siteUrl}/logo.png`],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
