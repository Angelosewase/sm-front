import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Call external auth API
    const response = await axios.post(
      `http://sm-back:7000`,
      { email, password }
    );

    const data = response.data;

    if (response.status !== 200) {
      // If the response is not ok, throw an error with the message from the backend
      throw new Error(data.message || "Login failed");
    }

    // Set httpOnly cookie
    const cookieStore = cookies();
    (await cookieStore).set("accessToken", data.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Set user data in a separate non-httpOnly cookie for client-side use
    (await cookieStore).set("user", JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Set school data if available
    if (data.school) {
      (await cookieStore).set("school", JSON.stringify(data.school), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Login error:", error);
    // Return a proper error response with status code
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: error.status || 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "hello world" });
}
