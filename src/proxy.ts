import { NextResponse, type NextRequest } from "next/server";

/**
 * `/` has three doors:
 * - curl/wget or `Accept: text/plain` → plain-text CV (the curl trick)
 * - phones → /cv (terminal on a phone is painful)
 * - everyone else → the terminal
 */
export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const accept = request.headers.get("accept") ?? "";
  if (/^(curl|wget|httpie|http)\b/i.test(ua) || accept.trim() === "text/plain")
    return NextResponse.rewrite(new URL("/api/cv.txt", request.url));
  if (/Mobi|Android|iPhone/i.test(ua)) return NextResponse.redirect(new URL("/cv", request.url));
  return NextResponse.next();
}

export const config = { matcher: "/" };
