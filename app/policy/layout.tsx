import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteName, siteUrl } from "../lib/seo";

export const metadata: Metadata = {
  title: "Policies & Information",
  description: "Read BlackMail's service policies, privacy information, terms, and usage guidelines.",
  alternates: {
    canonical: `${siteUrl}/policy`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/policy`,
    title: `Policies & Information | ${siteName}`,
    description: "Read BlackMail's service policies, privacy information, terms, and usage guidelines.",
  },
};

export default function PolicyLayout({ children }: { children: ReactNode }) {
  return children;
}
