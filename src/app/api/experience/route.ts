import { cv, formatPeriod } from "@/lib/cv";

export function GET() {
  return Response.json(cv.experience.map((e) => ({ ...e, period: formatPeriod(e.start, e.end) })));
}
