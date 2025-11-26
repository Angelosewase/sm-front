import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setCookie } from "cookies-next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Call external auth API using native fetch
    const response = await fetch(`http://sm-back:7000/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Set cookies using cookies-next/server
    await setCookie("accessToken", data.accessToken, {
      cookies,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    await setCookie("user", JSON.stringify(data.user), {
      cookies,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    if (data.school) {
      await setCookie("school", JSON.stringify(data.school), {
        cookies,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
