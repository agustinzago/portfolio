import { NextResponse, type NextRequest } from "next/server";

/** `curl agustinzago.com` (or any client that only accepts text/plain) gets the plain-text CV. */
export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const accept = request.headers.get("accept") ?? "";
  const isCli = /^(curl|wget|httpie|http)\b/i.test(ua) || accept.trim() === "text/plain";
  if (isCli) return NextResponse.rewrite(new URL("/api/cv.txt", request.url));
  return NextResponse.next();
}

export const config = { matcher: "/" };
