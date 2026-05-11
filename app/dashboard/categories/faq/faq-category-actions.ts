"use server";

import { db } from "@/db";
import { faqCategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { authGuard } from "@/lib/authGuard";

// --- FETCH CATEGORIES ---
export async function getFAQCategoriesAction() {
  try {
    const data = await db
      .select({
        id: faqCategories.id,
        name: faqCategories.name,
      })
      .from(faqCategories)
      .orderBy(asc(faqCategories.name)); // Sorts A-Z

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return { success: false, data: [] };
  }
}

// --- CREATE CATEGORY ---
export async function createFAQCategoryAction(data: {
  name: string;
  description?: string;
}) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(faqCategories)
      .values({ name: data.name })
      .returning();

    revalidatePath("/dashboard/faq");
    return created;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This category already exists." };
    }
    return { error: "Failed to create category." };
  }
}
