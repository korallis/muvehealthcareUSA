"use server";

import { authRateLimit } from "@/lib/rate-limit";
import { headers, cookies } from "next/headers";
import { hash, compare } from "bcrypt-ts";
import { db } from "@/db";
import { users, invitations } from "@/db/schema"; // Ensure invitations is exported from schema
import { eq, and } from "drizzle-orm";
import { SignJWT } from "jose";
import { redirect } from "next/navigation";
import { JWT_SECRET } from "@/lib/auth-config";
import { signupSchema, loginSchema } from "@/lib/validation/auth";

export async function signupAction(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    token: (formData.get("token") as string | null) || null,
  };

  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, token } = parsed.data;

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "anonymous";

  // 1. Rate Limiting
  const { success: rateOk } = await authRateLimit.limit(`signup:${ip}`);
  if (!rateOk) {
    return { error: "Too many signup attempts. Please try again later." };
  }

  try {
    let finalRole: "admin" | "user" = "user";

    // 2. Handle Admin Invitation
    if (token) {
      const [invitation] = await db
        .select()
        .from(invitations)
        .where(
          and(
            eq(invitations.token, token),
            eq(invitations.email, email.toLowerCase()),
            eq(invitations.status, "pending"),
          ),
        );

      if (!invitation) {
        return { error: "Invalid or expired admin invitation." };
      }

      // Check Expiry (if you have an expiresAt column)
      if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
        return { error: "This invitation has expired." };
      }

      finalRole = "admin";
    }

    const hashedPassword = await hash(password, 10);

    // 3. Transactional Database Update
    await db.transaction(async (tx) => {
      // Create the user
      await tx.insert(users).values({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: finalRole,
      });

      // If invited, mark the invitation as accepted
      if (token) {
        await tx
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.token, token));
      }
    });

    return { success: "Account created!" };
  } catch (err: unknown) {
    console.error("Signup error:", err);
    if (
      err instanceof Error &&
      "code" in err &&
      (err as Record<string, unknown>).code === "23505"
    )
      return { error: "User with this email already exists." };
    return { error: "An error occurred during signup." };
  }
}

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = parsed.data;

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "anonymous";
  const { success: rateOk } = await authRateLimit.limit(`login:${ip}`);
  if (!rateOk) {
    return { error: "Too many login attempts." };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user || !(await compare(password, user.password))) {
      return { error: "Invalid email or password." };
    }

    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });
  } catch (error) {
    console.error("Login process error:", error);
    return { error: "An unexpected error occurred." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    try {
      const { revokeToken } = await import("@/lib/auth/token-blocklist");
      await revokeToken(token, 3600);
    } catch (error) {
      console.error("Failed to revoke token during logout:", error);
    }
  }

  cookieStore.delete("authToken");
  redirect("/auth/login");
}
