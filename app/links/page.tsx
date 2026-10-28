
import type { Metadata } from "next";
import { siteUrl } from "../lib/seo";

export const metadata: Metadata = {
  title: "Links",
  description: "BlackMail community and useful links.",
  alternates: {
    canonical: `${siteUrl}/links`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LinksPage() {
  return (

    <>
    
    <h2>Pages Are Coming  Soon, stay 
    tuned!
    </h2>
    </>
        )}