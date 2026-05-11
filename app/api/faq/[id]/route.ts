import { db } from "@/db";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/lib/authGuard";
import { updateFAQSchema } from "@/lib/validation/schemas";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await authGuard("admin");

  try {
    const { id } = await params;
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("API Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await authGuard("admin");

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateFAQSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    await db
      .update(faqs)
      .set({
        question: parsed.data.question,
        answer: parsed.data.answer,
        categoryId: parsed.data.categoryId,
      })
      .where(eq(faqs.id, id));

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("API Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const data = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);

    if (!data.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
