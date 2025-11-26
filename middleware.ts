import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from "cookies-next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const token = await getCookie("accessToken", { req: request, res });
  const userCookie = await getCookie("user", { req: request, res });
  const { pathname } = request.nextUrl;

  const roles = ["admin", "teacher", "head teacher", "super admin", "school owner"];

  const isProtectedRoute =
    roles.some((role) => {
      const rolePath =
        role === "head teacher"
          ? "head-teacher"
          : role === "super admin"
          ? "super-admin"
          : role === "school owner"
          ? "admin"
          : role;
      return pathname.startsWith(`/${rolePath}`);
    }) ||
    pathname.startsWith("/setup-school-profile");

  const authRoutes = ["/login", "/reset-password", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && token && userCookie) {
    try {
      const user = JSON.parse(userCookie as string);
      const userRole =
        user.role === "head teacher"
          ? "head-teacher"
          : user.role === "super admin"
          ? "super-admin"
          : user.role === "school owner"
          ? "admin"
          : user.role;
      const accessingRole = roles.find((role) => {
        const rolePath =
          role === "head teacher"
            ? "head-teacher"
            : role === "super admin"
            ? "super-admin"
            : role === "school owner"
            ? "admin"
            : role;
        return pathname.startsWith(`/${rolePath}`);
      });

      if (accessingRole) {
        const normalizedAccessingRole =
          accessingRole === "head teacher"
            ? "head-teacher"
            : accessingRole === "super admin"
            ? "super-admin"
            : accessingRole === "school owner"
            ? "admin"
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
      const user = JSON.parse(userCookie as string);
      const rolePath =
        user.role === "head teacher"
          ? "head-teacher"
          : user.role === "super admin"
          ? "super-admin"
          : user.role === "school owner"
          ? "admin"
          : user.role;
      const url = new URL(`/${rolePath}`, request.url);
      return NextResponse.redirect(url);
    } catch {}
  }

  return res;
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
