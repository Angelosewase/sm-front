import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next/server";

export async function POST() {
  try {
    // Clear all auth-related cookies using cookies-next/server
    await deleteCookie("accessToken", { cookies });
    await deleteCookie("user", { cookies });
    await deleteCookie("school", { cookies });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
