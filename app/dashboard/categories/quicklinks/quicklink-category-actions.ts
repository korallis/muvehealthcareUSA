"use server";

import { db } from "@/db";
import { quicklinkCategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { authGuard } from "@/lib/authGuard";

/**
 * Fetches all Quicklink categories sorted alphabetically.
 */
export async function getQuicklinkCategoriesAction() {
  try {
    const data = await db
      .select({
        id: quicklinkCategories.id,
        name: quicklinkCategories.name,
      })
      .from(quicklinkCategories)
      .orderBy(asc(quicklinkCategories.name));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Quicklink Categories Error:", error);
    return { success: false, data: [] };
  }
}

/**
 * Creates a new independent category for Quicklinks.
 */
export async function createQuicklinkCategoryAction(data: {
  name: string;
  description?: string;
}) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(quicklinkCategories)
      .values({ name: data.name })
      .returning();

    revalidatePath("/dashboard/quicklinks");
    return created;
  } catch (error: unknown) {
    // Check for PostgreSQL unique constraint violation (code 23505)
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This Quicklink category already exists." };
    }
    return { error: "Failed to create category." };
  }
}
