import { NextRequest, NextResponse } from "next/server";
import {
  ACTIVE_WS,
  COOKIE_NAME as SESSION_COOKIE,
  decrypt,
} from "@/actions/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/projects", "/chat", "/workspace", "/settings"];
const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const ws_cookie = (await cookies()).get(ACTIVE_WS)?.value;
  const session = await decrypt(cookie);

  // 🔐 Redirect to /sign-in if trying to access protected route without session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/projects")
  ) {
    if (ws_cookie) {
      return NextResponse.redirect(
        new URL(`/${ws_cookie}/projects`, req.nextUrl)
      );
    }
    return NextResponse.redirect(new URL("/select-workspace", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
