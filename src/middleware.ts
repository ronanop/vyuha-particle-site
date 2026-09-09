import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Permanent redirect from the apex host to the canonical www host. */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host !== "vyuha.ai") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = "www.vyuha.ai";
  url.port = "";
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: "/:path*",
};
