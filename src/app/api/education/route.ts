import { cv } from "@/lib/cv";

export function GET() {
  return Response.json({ education: cv.education, languages: cv.languages });
}
