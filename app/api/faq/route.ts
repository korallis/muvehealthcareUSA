import { db } from "@/db";
import { faqs, faqCategories } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { authGuard } from "@/lib/authGuard";
import { createFAQSchema } from "@/lib/validation/schemas";

// GET: Fetch all FAQs joined with their independent category names
export async function GET() {
  try {
    const data = await db
      .select({
        id: faqs.id,
        question: faqs.question,
        answer: faqs.answer,
        categoryName: faqCategories.name, // Readable name from the category table
        categoryId: faqs.categoryId,
        createdAt: faqs.createdAt,
      })
      .from(faqs)
      .leftJoin(faqCategories, eq(faqs.categoryId, faqCategories.id))
      .orderBy(desc(faqs.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 },
    );
  }
}

// POST: Create a new FAQ entry linked to a category UUID
export async function POST(req: Request) {
  try {
    await authGuard("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createFAQSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { question, answer, categoryId } = parsed.data;

    const newItem = await db
      .insert(faqs)
      .values({ question, answer, categoryId })
      .returning();

    return NextResponse.json(newItem[0]);
  } catch (error: unknown) {
    console.error("API Create Error:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 },
    );
  }
}
