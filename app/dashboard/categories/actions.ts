"use server";

import { db } from "@/db";
import {
  categories,
  faqCategories,
  quicklinkCategories,
  jobCategories,
} from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const REVALIDATE_PATHS = [
  "/dashboard/categories",
  "/dashboard/news",
  "/dashboard/events",
  "/dashboard/faq",
  "/dashboard/quicklinks",
  "/dashboard/jobs",
  "/News",
  "/events",
  "/",
];

function revalidateAll() {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
}

// ─── News/Events categories (shared `categories` table) ───

export async function getCategoriesWithCounts() {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      newsCount: sql<number>`cast((SELECT count(*) FROM news_articles WHERE news_articles.category_id = categories.id) as integer)`.as(
        "news_count",
      ),
      eventsCount: sql<number>`cast((SELECT count(*) FROM events WHERE events.category_id = categories.id) as integer)`.as(
        "events_count",
      ),
    })
    .from(categories)
    .orderBy(categories.name);

  return rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    newsCount: Number(r.newsCount),
    eventsCount: Number(r.eventsCount),
  }));
}

export async function updateCategoryAction(
  id: string,
  data: { name: string; description?: string },
) {
  await authGuard("admin");
  try {
    const [updated] = await db
      .update(categories)
      .set({
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
      })
      .where(eq(categories.id, id))
      .returning();

    revalidateAll();
    return updated;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "A category with this name already exists." };
    }
    return { error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidateAll();
    return { success: true };
  } catch {
    return { error: "Failed to delete category. It may still be in use." };
  }
}

// ─── FAQ categories ───

export async function getFAQCategoriesWithCounts() {
  const rows = await db
    .select({
      id: faqCategories.id,
      name: faqCategories.name,
      itemCount: sql<number>`cast((SELECT count(*) FROM faqs WHERE faqs.category_id = faq_categories.id) as integer)`.as(
        "item_count",
      ),
    })
    .from(faqCategories)
    .orderBy(faqCategories.name);

  return rows.map((r) => ({
    ...r,
    itemCount: Number(r.itemCount),
  }));
}

export async function createFAQCategoryAction(data: { name: string }) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(faqCategories)
      .values({ name: data.name })
      .returning();

    revalidateAll();
    return created;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This FAQ category already exists." };
    }
    return { error: "Failed to create category." };
  }
}

export async function updateFAQCategoryAction(
  id: string,
  data: { name: string },
) {
  await authGuard("admin");
  try {
    const [updated] = await db
      .update(faqCategories)
      .set({ name: data.name })
      .where(eq(faqCategories.id, id))
      .returning();

    revalidateAll();
    return updated;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This FAQ category already exists." };
    }
    return { error: "Failed to update category." };
  }
}

export async function deleteFAQCategoryAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(faqCategories).where(eq(faqCategories.id, id));
    revalidateAll();
    return { success: true };
  } catch {
    return { error: "Failed to delete category. It may still have FAQs." };
  }
}

// ─── Quicklink categories ───

export async function getQuicklinkCategoriesWithCounts() {
  const rows = await db
    .select({
      id: quicklinkCategories.id,
      name: quicklinkCategories.name,
      itemCount: sql<number>`cast((SELECT count(*) FROM quicklinks WHERE quicklinks.category_id = quicklink_categories.id) as integer)`.as(
        "item_count",
      ),
    })
    .from(quicklinkCategories)
    .orderBy(quicklinkCategories.name);

  return rows.map((r) => ({
    ...r,
    itemCount: Number(r.itemCount),
  }));
}

export async function createQuicklinkCategoryAction(data: { name: string, }) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(quicklinkCategories)
      .values({ name: data.name })
      .returning();

    revalidateAll();

    console.log([created], " This is the created category")
    return created;
  } catch (error: unknown) {
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

export async function updateQuicklinkCategoryAction(
  id: string,
  data: { name: string },
) {
  await authGuard("admin");
  try {
    const [updated] = await db
      .update(quicklinkCategories)
      .set({ name: data.name })
      .where(eq(quicklinkCategories.id, id))
      .returning();

    revalidateAll();
    return updated;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This Quicklink category already exists." };
    }
    return { error: "Failed to update category." };
  }
}

export async function deleteQuicklinkCategoryAction(id: string) {
  await authGuard("admin");
  try {
    await db
      .delete(quicklinkCategories)
      .where(eq(quicklinkCategories.id, id));
    revalidateAll();
    return { success: true };
  } catch {
    return {
      error: "Failed to delete category. It may still have Quick Links.",
    };
  }
}

// ─── Job categories ───

export async function getJobCategoriesWithCounts() {
  const rows = await db
    .select({
      id: jobCategories.id,
      name: jobCategories.name,
      itemCount: sql<number>`cast((SELECT count(*) FROM jobs WHERE jobs.category_id = job_categories.id) as integer)`.as(
        "item_count",
      ),
    })
    .from(jobCategories)
    .orderBy(jobCategories.name);

  return rows.map((r) => ({
    ...r,
    itemCount: Number(r.itemCount),
  }));
}

export async function createJobCategoryAction(data: { name: string }) {
  await authGuard("admin");
  try {
    const [created] = await db
      .insert(jobCategories)
      .values({ name: data.name })
      .returning();

    revalidateAll();
    return created;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This Job category already exists." };
    }
    return { error: "Failed to create category." };
  }
}

export async function updateJobCategoryAction(
  id: string,
  data: { name: string },
) {
  await authGuard("admin");
  try {
    const [updated] = await db
      .update(jobCategories)
      .set({ name: data.name })
      .where(eq(jobCategories.id, id))
      .returning();

    revalidateAll();
    return updated;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "This Job category already exists." };
    }
    return { error: "Failed to update category." };
  }
}

export async function deleteJobCategoryAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(jobCategories).where(eq(jobCategories.id, id));
    revalidateAll();
    return { success: true };
  } catch {
    return { error: "Failed to delete category. It may still have jobs." };
  }
}

// ─── Shared: Create category for News/Events ───

export async function createSharedCategoryAction(data: {
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

    revalidateAll();
    return created;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return { error: "A category with this name already exists." };
    }
    return { error: "Failed to create category." };
  }
}
