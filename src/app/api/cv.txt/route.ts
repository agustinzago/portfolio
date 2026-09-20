import { toPlainText } from "@/lib/cv";

export function GET() {
  return new Response(toPlainText(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
