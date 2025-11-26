import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next/server";

function getRolePath(role: string) {
  if (!role) {
    return "/login";
  }

  if (role === "super admin") {
    return "/super-admin";
  }
  if (role === "school owner") {
    return "/admin";
  }

  const normalizedRole = role.toLowerCase().replace(/\s+/g, "-");
  return `/${normalizedRole}`;
}

export default async function Home() {
  const token = await getCookie("accessToken", { cookies });
  const userCookie = await getCookie("user", { cookies });
  const schoolCookie = await getCookie("school", { cookies });

  if (!token || !userCookie || userCookie === "undefined") {
    redirect("/login");
  }

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(userCookie as string);
  } catch {
    redirect("/login");
  }

  if (!user?.role) {
    redirect("/login");
  }

  let school: unknown = null;
  if (schoolCookie && schoolCookie !== "undefined") {
    try {
      school = JSON.parse(schoolCookie as string);
    } catch {
      school = null;
    }
  }

  if (user.role === "admin" && !school) {
    redirect("/setup-school-profile");
  }

  // Super admin doesn't need school association
  if (user.role === "super admin") {
    redirect("/super-admin");
  }

  redirect(getRolePath(user.role));
}