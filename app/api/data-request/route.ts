import { NextResponse } from "next/server";
import { formRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { logAuditEvent } from "@/lib/audit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit: 5 requests per minute per IP
    const { success: rateOk } = await formRateLimit.limit(`data-request:${ip}`);
    if (!rateOk) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { email, requestType } = body;

    const emailResult = z.string().email().safeParse(email);
    if (
      !emailResult.success ||
      !requestType ||
      !["access", "deletion", "rectification", "portability"].includes(
        requestType,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid request. Valid email and request type required." },
        { status: 400 },
      );
    }

    // Log the data subject request
    await logAuditEvent({
      action: `data_subject_${requestType}`,
      resource: "data_request",
      metadata: { email, requestType, ip },
    });

    return NextResponse.json({
      message:
        "Your request has been received. We will respond within 30 days as required by UK GDPR.",
    });
  } catch (error) {
    console.error("Data request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
