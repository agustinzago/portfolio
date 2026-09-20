import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agustín Zago — Backend & Platform Engineer",
  description: "Backend & platform engineer. Integrations, distributed pipelines, AI features. Node.js, TypeScript, AWS. Try `curl agustinzago.com`.",
  metadataBase: new URL("https://agustinzago.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
