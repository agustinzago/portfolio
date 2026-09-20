import { cv } from "@/lib/cv";

export function GET() {
  return Response.json(cv.skills);
}
