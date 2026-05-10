import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes — no auth needed
  if (
    pathname.startsWith("/shared/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Admin routes — full session check
  if (pathname.startsWith("/admin")) {
    const cookie = getSessionCookie(request);
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Edge can't use Prisma directly — call the auth endpoint
    const sessionRes = await fetch(
      new URL("/api/auth/get-session", request.url),
      {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      }
    );
    const session = await sessionRes.json();
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // TODO: check isAdmin on UserProfile via Prisma in a server component
    // Proxy-level guard ensures session exists; component-level guard checks role
    return NextResponse.next();
  }

  // App routes — cookie check (optimistic redirect)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/trips") || pathname.startsWith("/cities") || pathname.startsWith("/activities") || pathname.startsWith("/profile")) {
    const cookie = getSessionCookie(request);
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
