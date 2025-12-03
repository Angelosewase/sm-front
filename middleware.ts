import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Simplified middleware - only redirect authenticated users away from auth routes
  // Role-based protection is handled client-side by RoleProtector components
  
  const authRoutes = ["/login", "/reset-password", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get token from Authorization header (if available)
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "") || null;
  
  // Try to get user info from header
  const userHeader = request.headers.get("x-user-info");
  let user = null;
  if (userHeader) {
    try {
      user = JSON.parse(userHeader);
    } catch {
      // Invalid user header, ignore
    }
  }

  // Only redirect authenticated users away from auth routes
  // All other route protection is handled client-side
  if (isAuthRoute && token && user) {
    try {
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
    } catch {
      // If parsing fails, allow access to auth route
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
