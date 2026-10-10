import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIP } from "./lib/rate-limit";

// Middleware: rate-limit /admin visits + /api/* + protect write APIs with auth cookie
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIP(req as unknown as Request);

  // --- Admin page: soft rate limit to prevent brute-force scanning
  if (pathname.startsWith("/admin")) {
    const { ok, remaining, resetAt } = rateLimit(`admin:page:${ip}`, 60, 60_000);
    if (!ok) {
      return new NextResponse("Too many requests — slow down", {
        status: 429,
        headers: { "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(), "X-RateLimit-Remaining": remaining.toString() },
      });
    }
  }

  // --- API rate limits
  if (pathname.startsWith("/api/cms")) {
    const isWrite = req.method !== "GET";
    const key = `api:cms:${isWrite ? "write" : "read"}:${ip}`;
    const { ok, remaining, resetAt } = rateLimit(key, isWrite ? 20 : 120, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests" }, {
        status: 429,
        headers: { "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(), "X-RateLimit-Remaining": remaining.toString() },
      });
    }
    // Write guard: require ADMIN_TOKEN or admin cookie (so API not open to public POST)
    if (isWrite) {
      const token = process.env.ADMIN_TOKEN;
      const authHeader = req.headers.get("authorization");
      const cookieAuth = req.cookies.get("savana_admin_auth")?.value === "1";
      // If ADMIN_TOKEN is set, require it; else require valid admin cookie
      if (token) {
        if (authHeader !== `Bearer ${token}` && !cookieAuth) {
          // allow cookie as fallback even when token exists for browser admin
          // but block anonymous POSTs
          const hasAnyAuth = authHeader === `Bearer ${token}` || cookieAuth;
          if (!hasAnyAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
        if (!cookieAuth) return NextResponse.json({ error: "Unauthorized — login required" }, { status: 401 });
      }
    }
  }

  if (pathname.startsWith("/api/upload")) {
    const { ok, remaining, resetAt } = rateLimit(`api:upload:${ip}`, 10, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Too many uploads — try again shortly" }, {
        status: 429,
        headers: { "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(), "X-RateLimit-Remaining": remaining.toString() },
      });
    }
    // upload always requires auth (cookie or token)
    const token = process.env.ADMIN_TOKEN;
    const authHeader = req.headers.get("authorization");
    const cookieAuth = req.cookies.get("savana_admin_auth")?.value === "1";
    if (token) {
      if (authHeader !== `Bearer ${token}` && !cookieAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      if (!cookieAuth) return NextResponse.json({ error: "Unauthorized — login required" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
