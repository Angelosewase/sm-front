import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  const roles = ["admin", "teacher", "head teacher"];
  const isProtectedRoute =
    roles.some((role) => pathname.startsWith(`/${role}`)) ||
    pathname.startsWith("/setup-school-profile");

  const authRoutes = ["/login", "/reset-password"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const userRole = user.role == "head teacher" ? "head-teacher" : user.role;
      const accessingRole = roles.find((role) =>
        pathname.startsWith(`/${role}`)
      );

      if (accessingRole && accessingRole !== userRole) {
        const url = new URL(`/${userRole}`, request.url);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const url = new URL(
        `/${user.role == "head teacher" ? "head-teacher" : user.role}`,
        request.url
      );
      return NextResponse.redirect(url);
    } catch {
      // If parsing fails, let them stay on auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/setup-school-profile/:path*",
    "/login",
    "/reset-password",
    "/head-teacher/:path*",
  ],
};
