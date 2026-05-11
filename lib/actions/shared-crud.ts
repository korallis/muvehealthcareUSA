import { db } from "@/db";
import { categories } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function getAllCategoriesAction() {
  return await db.select().from(categories).orderBy(categories.name);
}

export async function createCategoryAction(
  name: string,
  description?: string,
  revalidatePaths: string[] = [],
) {
  await authGuard("admin");

  try {
    const [created] = await db
      .insert(categories)
      .values({
        name,
        slug: slugify(name, { lower: true, strict: true }),
        description,
      })
      .returning();

    revalidatePaths.forEach((path) => revalidatePath(path));
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
