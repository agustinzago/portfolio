import { projects } from "@/lib/cv";

export function GET() {
  return Response.json(projects);
}
