"use server";

import { db } from "@/db";
import { quicklinks, quicklinkCategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { authGuard } from "@/lib/authGuard";

/**
 * Fetches all Quicklinks joined with their independent category names.
 */
export async function getQuicklinksAction() {
  try {
    const data = await db
      .select({
        id: quicklinks.id,
        question: quicklinks.question,
        answer: quicklinks.answer,
        downloadUrl: quicklinks.downloadUrl,
        categoryName: quicklinkCategories.name,
        categoryId: quicklinks.categoryId,
        createdAt: quicklinks.createdAt,
      })
      .from(quicklinks)
      .leftJoin(
        quicklinkCategories,
        eq(quicklinks.categoryId, quicklinkCategories.id),
      )
      .orderBy(desc(quicklinks.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Quicklinks Error:", error);
    return { success: false, data: [] };
  }
}

/**
 * Creates a new Quicklink linked to a category UUID.
 */
export async function createQuicklinkAction(data: {
  question: string;
  answer: string;
  categoryId: string; // Expecting UUID string
  downloadUrl?: string;
}) {
  await authGuard("admin");
  try {
    await db.insert(quicklinks).values({
      question: data.question,
      answer: data.answer,
      categoryId: data.categoryId,
      downloadUrl: data.downloadUrl,
    });

    revalidatePath("/dashboard/quicklinks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Create Quicklink Error:", error);
    return { error: "Failed to create quicklink. Ensure the category exists." };
  }
}

/**
 * Updates an existing Quicklink using its UUID.
 */
export async function updateQuicklinkAction(
  id: string,
  data: {
    question?: string;
    answer?: string;
    categoryId?: string; // Expecting UUID string
    downloadUrl?: string;
  },
) {
  await authGuard("admin");
  try {
    await db
      .update(quicklinks)
      .set({
        question: data.question,
        answer: data.answer,
        categoryId: data.categoryId,
        downloadUrl: data.downloadUrl,
      })
      .where(eq(quicklinks.id, id));

    revalidatePath("/dashboard/quicklinks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update Quicklink Error:", error);
    return { error: "Failed to update quicklink" };
  }
}

/**
 * Deletes a Quicklink by its UUID string.
 */
export async function deleteQuicklinkAction(formData: FormData) {
  await authGuard("admin");
  try {
    const id = formData.get("id");
    if (id) {
      // Treat ID as string (UUID), no Number() conversion needed
      await db.delete(quicklinks).where(eq(quicklinks.id, id.toString()));

      revalidatePath("/dashboard/quicklinks");
      revalidatePath("/");
      return { success: true };
    }
  } catch (error) {
    console.error("Delete Quicklink Error:", error);
    return { error: "Failed to delete quicklink" };
  }
}
