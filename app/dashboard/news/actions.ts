"use server";

import { db } from "@/db/index";
import { newsArticles, events, categories, newsImages } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

import {
  getAllCategoriesAction as getAllCategoriesShared,
  createCategoryAction as createCategoryShared,
} from "@/lib/actions/shared-crud";

/* -----------------------------------------------------
   CATEGORY ACTIONS
----------------------------------------------------- */

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

export async function updateCategoryAction(
  id: string,
  data: { name: string; description?: string },
) {
  await authGuard("admin");
  try {
    await db
      .update(categories)
      .set({
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
      })
      .where(eq(categories.id, id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category." };
  }
}

/* -----------------------------------------------------
   NEWS ACTIONS
----------------------------------------------------- */

export async function createNewsAction(data: {
  title: string;
  content: string;
  categoryId: string;
  seoDesc?: string;
  excerpt?: string;
  featuredImg?: string;
  galleryImages?: string[];
}) {
  await authGuard("admin");

  try {
    return await db.transaction(async (tx) => {
      const [newArticle] = await tx
        .insert(newsArticles)
        .values({
          title: data.title,
          slug: slugify(data.title, { lower: true, strict: true }),
          content: data.content,
          categoryId: data.categoryId,
          seoDesc: data.seoDesc,
          excerpt: data.excerpt,
          featuredImg: data.featuredImg,
          status: "PUBLISHED",
        })
        .returning({ id: newsArticles.id });

      if (data.galleryImages && Array.isArray(data.galleryImages)) {
        // FIXED: Added types to filter and map parameters
        const imageRows = data.galleryImages
          .filter((url: string) => typeof url === "string" && url.trim() !== "")
          .slice(0, 50)
          .map((url: string, index: number) => ({
            articleId: newArticle.id,
            url: url,
            order: index,
          }));

        if (imageRows.length > 0) {
          await tx.insert(newsImages).values(imageRows);
        }
      }

      revalidatePath("/News");
      revalidatePath("/dashboard/news");
      return { success: true };
    });
  } catch (error: unknown) {
    console.error("News Creation Error:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    )
      return { error: "Title already exists." };
    return { error: "Database error." };
  }
}

export async function updateNewsAction(
  id: string,
  data: {
    title: string;
    content: string;
    categoryId: string;
    seoDesc?: string;
    excerpt?: string;
    featuredImg?: string;
    galleryImages?: string[];
  },
) {
  await authGuard("admin");
  try {
    return await db.transaction(async (tx) => {
      await tx
        .update(newsArticles)
        .set({
          title: data.title,
          slug: slugify(data.title, { lower: true, strict: true }),
          content: data.content,
          categoryId: data.categoryId,
          seoDesc: data.seoDesc,
          excerpt: data.excerpt,
          featuredImg: data.featuredImg,
          updatedAt: new Date(),
        })
        .where(eq(newsArticles.id, id));

      if (Array.isArray(data.galleryImages)) {
        await tx.delete(newsImages).where(eq(newsImages.articleId, id));

        // FIXED: Added types to filter and map parameters
        const imageRows = data.galleryImages
          .filter((url: string) => typeof url === "string" && url.trim() !== "")
          .slice(0, 50)
          .map((url: string, index: number) => ({
            articleId: id,
            url: url,
            order: index,
          }));

        if (imageRows.length > 0) {
          await tx.insert(newsImages).values(imageRows);
        }
      }

      revalidatePath("/News");
      revalidatePath("/dashboard/news");
      return { success: true };
    });
  } catch (error) {
    console.error("News Update Error:", error);
    return { error: "Failed to update article." };
  }
}

export async function deleteNewsAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
    revalidatePath("/News");
    revalidatePath("/dashboard/news");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete article." };
  }
}

/* -----------------------------------------------------
   EVENT ACTIONS
----------------------------------------------------- */

export async function createEventAction(data: {
  title: string;
  categoryId?: string;
  description?: string;
  location?: string;
  seoDesc?: string;
  excerpt?: string;
  startDate: string;
  featuredImg?: string;
}) {
  await authGuard("admin");
  try {
    await db.insert(events).values({
      title: data.title,
      slug: slugify(data.title, { lower: true, strict: true }),
      categoryId: data.categoryId,
      description: data.description,
      location: data.location,
      seoDesc: data.seoDesc,
      excerpt: data.excerpt,
      startDate: new Date(data.startDate),
      featuredImg: data.featuredImg || null,
    });

    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    )
      return { error: "Event title already exists." };
    return { error: "Failed to create event." };
  }
}

export async function updateEventAction(
  id: string,
  data: {
    title: string;
    categoryId?: string;
    description?: string;
    location?: string;
    seoDesc?: string;
    excerpt?: string;
    startDate: string;
    featuredImg?: string;
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
        description: data.description,
        location: data.location,
        seoDesc: data.seoDesc,
        excerpt: data.excerpt,
        startDate: new Date(data.startDate),
        featuredImg: data.featuredImg || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update event." };
  }
}

export async function deleteEventAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete event." };
  }
}
