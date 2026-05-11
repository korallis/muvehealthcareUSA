"use server";

import { db } from "@/db";
import { faqs, faqCategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { authGuard } from "@/lib/authGuard";

/**
 * Fetches all FAQs joined with their respective independent category names.
 */
export async function getFAQsAction() {
  try {
    const data = await db
      .select({
        id: faqs.id,
        question: faqs.question,
        answer: faqs.answer,
        categoryName: faqCategories.name,
        categoryId: faqs.categoryId,
        createdAt: faqs.createdAt,
      })
      .from(faqs)
      // Left join ensures FAQs appear even if their category was deleted
      .leftJoin(faqCategories, eq(faqs.categoryId, faqCategories.id))
      .orderBy(desc(faqs.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, data: [] };
  }
}

/**
 * Creates a new FAQ entry linked to a category UUID.
 */
export async function createFAQAction(data: {
  question: string;
  answer: string;
  categoryId: string; // Expecting a valid UUID string
}) {
  await authGuard("admin");
  try {
    await db.insert(faqs).values({
      question: data.question,
      answer: data.answer,
      categoryId: data.categoryId,
    });

    revalidatePath("/dashboard/faq");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create FAQ. Ensure the category exists." };
  }
}

/**
 * Updates an existing FAQ using its UUID.
 */
export async function updateFAQAction(
  id: string,
  data: {
    question: string;
    answer: string;
    categoryId: string;
  },
) {
  await authGuard("admin");
  try {
    await db
      .update(faqs)
      .set({
        question: data.question,
        answer: data.answer,
        categoryId: data.categoryId,
      })
      .where(eq(faqs.id, id));

    revalidatePath("/dashboard/faq");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update FAQ. Please check the ID and Category." };
  }
}

/**
 * Deletes an FAQ entry by its UUID.
 */
export async function deleteFAQAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(faqs).where(eq(faqs.id, id));

    revalidatePath("/dashboard/faq");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to delete FAQ." };
  }
}
