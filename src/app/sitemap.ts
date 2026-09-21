import type { MetadataRoute } from "next";
import { cv } from "@/lib/cv";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${cv.contact.website}/`, lastModified, priority: 1 },
    { url: `${cv.contact.website}/cv`, lastModified, priority: 0.9 },
  ];
}
