import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JWT_SECRET } from "@/lib/auth-config";

export async function authGuard(
  requiredRole?: "admin" | "user",
): Promise<{ userId: string; role: "admin" | "user" }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) redirect("/auth/login");

  let payload;
  try {
    const result = await jwtVerify(token, JWT_SECRET);
    payload = result.payload;
  } catch (err) {
    console.error("authGuard failed:", err);
    redirect("/auth/login");
  }

  if (requiredRole && payload.role !== requiredRole) {
    redirect("/auth/login");
  }

  return {
    userId: payload.userId as string,
    role: payload.role as "admin" | "user",
  };
}
