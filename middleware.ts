import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  const roles = ["admin", "teacher", "head teacher", "super admin"];
  const isProtectedRoute =
    roles.some((role) => pathname.startsWith(`/${role === "super admin" ? "super-admin" : role}`)) ||
    pathname.startsWith("/setup-school-profile");

  const authRoutes = ["/login", "/reset-password", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const userRole =
        user.role == "head teacher"
          ? "head-teacher"
          : user.role == "super admin"
          ? "super-admin"
          : user.role;
      const accessingRole = roles.find((role) => {
        const rolePath = role === "super admin" ? "super-admin" : role;
        return pathname.startsWith(`/${rolePath}`);
      });

      if (accessingRole) {
        const normalizedAccessingRole =
          accessingRole === "head teacher"
            ? "head-teacher"
            : accessingRole === "super admin"
            ? "super-admin"
            : accessingRole;
        if (normalizedAccessingRole !== userRole) {
          const url = new URL(`/${userRole}`, request.url);
          return NextResponse.redirect(url);
        }
      }
    } catch {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const rolePath =
        user.role == "head teacher"
          ? "head-teacher"
          : user.role == "super admin"
          ? "super-admin"
          : user.role;
      const url = new URL(`/${rolePath}`, request.url);
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
    "/register",
    "/head-teacher/:path*",
    "/super-admin/:path*",
  ],
};
