import { NextResponse, type NextRequest } from "next/server";

/**
 * `/` has two doors:
 * - curl/wget or `Accept: text/plain` → plain-text CV (the curl trick)
 * - everyone else, phones included → the terminal
 */
export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const accept = request.headers.get("accept") ?? "";
  if (/^(curl|wget|httpie|http)\b/i.test(ua) || accept.trim() === "text/plain")
    return NextResponse.rewrite(new URL("/api/cv.txt", request.url));
  return NextResponse.next();
}

export const config = { matcher: "/" };
