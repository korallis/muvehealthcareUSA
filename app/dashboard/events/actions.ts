"use server";

import { db } from "@/db/index";
import { events, categories } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import {
  getAllCategoriesAction as getAllCategoriesShared,
  createCategoryAction as createCategoryShared,
} from "@/lib/actions/shared-crud";

export async function getAllCategoriesAction() {
  return await getAllCategoriesShared();
}

export async function createCategoryAction(data: {
  name: string;
  description?: string;
}) {
  return await createCategoryShared(data.name, data.description, [
    "/dashboard/categories",
  ]);
}

// --- CREATE ACTION ---
export async function createEventAction(data: {
  title: string;
  categoryId?: string;
  seoDesc?: string;
  excerpt?: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  featuredImg?: string;
  applyUrl?: string;
}) {
  await authGuard("admin");

  try {
    await db.insert(events).values({
      title: data.title,
      slug: slugify(data.title, { lower: true, strict: true }),
      categoryId: data.categoryId,
      seoDesc: data.seoDesc,
      excerpt: data.excerpt,
      description: data.description,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      featuredImg: data.featuredImg || null,
      applyUrl: data.applyUrl || null,
    });

    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error: unknown) {
    console.error("Create Event Error:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    )
      return { error: "An event with this title already exists." };
    return { error: "Database error. Please try again." };
  }
}

// --- UPDATE ACTION ---
export async function updateEventAction(
  id: string,
  data: {
    title: string;
    categoryId?: string;
    seoDesc?: string;
    excerpt?: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    featuredImg?: string;
    applyUrl?: string;
  },
) {
  await authGuard("admin");

  try {
    await db
      .update(events)
      .set({
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }),
        categoryId: data.categoryId,
        seoDesc: data.seoDesc,
        excerpt: data.excerpt,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        featuredImg: data.featuredImg || null,
        applyUrl: data.applyUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Update Event Error:", error);
    return { error: "Failed to update event." };
  }
}

// --- DELETE ACTION ---
export async function deleteEventAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Delete Event Error:", error);
    return { error: "Failed to delete event." };
  }
}
