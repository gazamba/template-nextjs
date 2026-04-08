import { NextRequest, NextResponse } from "next/server";

// Routes inside app/(protected)/ are guarded server-side by the layout.
// This proxy adds an optimistic redirect layer so unauthenticated users
// get bounced to /login before the page even renders, and authenticated
// users on auth pages get redirected to /dashboard.
const protectedPaths = ["/dashboard", "/settings", "/profile"];
const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAuthPath) {
    return NextResponse.next();
  }

  const session = await getSession(request);

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

async function getSession(request: NextRequest) {
  const response = await fetch(
    new URL("/api/auth/get-session", request.url),
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data?.session ? data : null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.).*)"],
};
