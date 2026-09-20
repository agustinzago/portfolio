import { experienceView } from "@/lib/cv";

export function GET() {
  return Response.json(experienceView());
}
