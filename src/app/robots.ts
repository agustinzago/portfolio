import type { MetadataRoute } from "next";
import { cv } from "@/lib/cv";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/ask" },
    sitemap: `${cv.contact.website}/sitemap.xml`,
  };
}
