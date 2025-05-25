import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, decrypt } from "./actions/core/session";

const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await decrypt(cookie); // Decrypt the session first

  const isAuthenticated = !!session?.userId;
  const hasActiveSpace = !!session?.activeSpace;
  const isOnPublicRoute = publicRoutes.includes(path);
  const isOnSelectWorkspace = path.startsWith("/select-workspace");
  // A path is considered 'protected' if it's not a public route and not the select workspace page
  const isProtectedPath = !isOnPublicRoute && !isOnSelectWorkspace;

  // 1. Redirect unauthenticated users from protected paths
  if (!isAuthenticated && isProtectedPath) {
    const signInUrl = new URL("/sign-in", req.nextUrl);
    // Optionally, add a callbackUrl query parameter so the user is redirected back after login
    // signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Redirect authenticated users without active space (unless they are already on select-workspace)
  if (isAuthenticated && !hasActiveSpace && !isOnSelectWorkspace) {
    return NextResponse.redirect(new URL("/select-workspace", req.nextUrl));
  }

  // 3. Redirect authenticated users from public routes if they have an active space
  //    This prevents authenticated users from unnecessary landing on sign-in/sign-up pages.
  if (isAuthenticated && hasActiveSpace && isOnPublicRoute) {
    return NextResponse.redirect(
      new URL(`/${session.activeSpace}/projects`, req.nextUrl)
    );
  }

  // If none of the above conditions are met, allow the request to proceed
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
