import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, decrypt } from "./actions/core/session";

const protectedRoutes = ["/projects"];
const publicRoutes = ["/sign-in", "/sign-up", "/", "/select-workspace"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await decrypt(cookie);
  // console.log("session", session);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (isPublicRoute && session?.activeSpace) {
    return NextResponse.redirect(
      new URL(`${session.activeSpace}/projects`, req.nextUrl)
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
