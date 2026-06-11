import { getIronSession } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import type { SessionData } from "@/lib/session";
import { sessionOptions } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page, register page, and all auth API routes through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
