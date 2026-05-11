"use server";

import { db } from "@/db/index";
import { stories } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- FETCH ACTION ---
export async function getStoriesAction() {
  try {
    const data = await db
      .select()
      .from(stories)
      .orderBy(desc(stories.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return { success: false, data: [] };
  }
}

type StoryInput = {
  name: string;
  role?: string;
  content: string;
  imageUrl?: string;
};

// --- CREATE ACTION ---
export async function createStoryAction(data: StoryInput) {
  await authGuard("admin");

  try {
    await db.insert(stories).values({
      name: data.name,
      role: data.role || "Impact Story",
      content: data.content,
      imageUrl: data.imageUrl || "",
    });
  } catch (error) {
    return { error: "Failed to create story." };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/stories");
  return { success: true };
}

// --- UPDATE ACTION ---
export async function updateStoryAction(id: number, data: StoryInput) {
  await authGuard("admin");

  try {
    await db
      .update(stories)
      .set({
        name: data.name,
        role: data.role,
        content: data.content,
        imageUrl: data.imageUrl || "",
      })
      .where(eq(stories.id, id));

    revalidatePath("/");
    revalidatePath("/dashboard/stories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update story." };
  }
}

// --- DELETE ACTION ---
export async function deleteStoryAction(id: number) {
  await authGuard("admin");

  try {
    await db.delete(stories).where(eq(stories.id, id));

    revalidatePath("/");
    revalidatePath("/dashboard/stories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete story." };
  }
}
