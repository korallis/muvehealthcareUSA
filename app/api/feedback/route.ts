import { NextResponse } from "next/server";
import { formRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { feedbackFormSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: rateOk } = await formRateLimit.limit(`feedback:${ip}`);
    if (!rateOk) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let raw: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      raw = await req.json();
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const form = await req.formData();
      raw = {
        feedbackType: form.get("feedbackType"),
        userType: form.get("userType"),
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
      };
    } else {
      try {
        raw = await req.json();
      } catch {
        return NextResponse.json(
          { error: "Unsupported Content-Type" },
          { status: 400 },
        );
      }
    }

    const parsed = feedbackFormSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    console.log("FEEDBACK RECEIVED");

    return NextResponse.json(
      { success: true, message: "Feedback submitted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
