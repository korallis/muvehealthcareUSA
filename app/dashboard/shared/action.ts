"use server";

import { db } from "@/db/index";
import { categories } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";

import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function getAllCategoriesAction() {
  try {
    return await db.select().from(categories).orderBy(categories.name);
  } catch (error) {
    return [];
  }
}

export async function createCategoryAction(data: {
  name: string;
  description?: string;
}) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
      })
      .returning();

    revalidatePath("/dashboard");
    return created;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "Category already exists." };
    }
    return { error: "Failed to create category." };
  }
}
