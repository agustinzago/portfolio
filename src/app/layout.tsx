import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { cv } from "@/lib/cv";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description = `${cv.name}, ${cv.title.toLowerCase()} in ${cv.location}. ${cv.summary.split(". ").slice(0, 2).join(". ")}.`;

export const metadata: Metadata = {
  metadataBase: new URL(cv.contact.website),
  title: { default: `${cv.name} — ${cv.title}`, template: `%s — ${cv.name}` },
  description,
  alternates: { canonical: "/" },
  keywords: [cv.name, "Agustin Zago", "backend engineer", "platform engineer", "Node.js", "TypeScript", "AWS", "Córdoba", "Argentina"],
  authors: [{ name: cv.name, url: cv.contact.website }],
  creator: cv.name,
  openGraph: { type: "profile", siteName: cv.name, title: `${cv.name} — ${cv.title}`, description, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${cv.name} — ${cv.title}`, description },
  robots: { index: true, follow: true },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: cv.name,
  alternateName: "Agustin Zago",
  jobTitle: cv.title,
  description: cv.summary,
  url: cv.contact.website,
  email: `mailto:${cv.contact.email}`,
  sameAs: [cv.contact.linkedin, cv.contact.github],
  address: { "@type": "PostalAddress", addressLocality: "Córdoba", addressCountry: "AR" },
  nationality: ["AR", "IT"],
  knowsAbout: Object.values(cv.skills).flat(),
  worksFor: { "@type": "Organization", name: cv.experience[0].company },
  alumniOf: { "@type": "CollegeOrUniversity", name: cv.education[0].institution },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
