import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME as SESSION_COOKIE,
  decrypt,
} from "@/actions/core/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/projects", "/chat", "/workspace", "/settings"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  // 🔐 Redirect to /sign-in if trying to access protected route without session
  if (isProtectedRoute && !session?.userId) {
    const signInUrl = new URL("/sign-in", req.nextUrl);
    // Store the current path as callbackUrl in the URL
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated but has no active workspace, redirect to select-workspace
  if (
    session?.userId &&
    !session?.activeSpace &&
    !path.startsWith("/select-workspace")
  ) {
    return NextResponse.redirect(new URL("/select-workspace", req.nextUrl));
  }

  // If user is authenticated and has an active workspace, ensure path starts with active workspace
  if (
    session?.userId &&
    session?.activeSpace &&
    !path.startsWith(`/${session.activeSpace}`) &&
    !path.startsWith("/select-workspace")
  ) {
    return NextResponse.redirect(
      new URL(`/${session.activeSpace}/projects`, req.nextUrl)
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
