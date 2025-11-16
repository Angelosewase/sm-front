import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getRolePath(role: string) {
  if (!role) {
    return "/login";
  }

  const normalizedRole = role.toLowerCase().replace(/\s+/g, "-");
  return `/${normalizedRole}`;
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const userCookie = cookieStore.get("user")?.value;
  const schoolCookie = cookieStore.get("school")?.value;

  if (!token || !userCookie || userCookie === "undefined") {
    redirect("/login");
  }

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(userCookie);
  } catch {
    redirect("/login");
  }

  if (!user?.role) {
    redirect("/login");
  }

  let school: unknown = null;
  if (schoolCookie && schoolCookie !== "undefined") {
    try {
      school = JSON.parse(schoolCookie);
    } catch {
      school = null;
    }
  }

  if (user.role === "admin" && !school) {
    redirect("/setup-school-profile");
  }

  redirect(getRolePath(user.role));
}