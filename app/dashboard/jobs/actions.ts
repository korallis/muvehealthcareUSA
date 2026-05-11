"use server";

import { db } from "@/db/index";
import { jobs, jobCategories } from "@/db/schema";
import { authGuard } from "@/lib/authGuard";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

/* READ JOBS (FOR COMPONENT) */
export async function getJobsAction() {
  try {
    const data = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        location: jobs.location,
        salaryRange: jobs.salaryRange,
        featuredImg: jobs.featuredImg,
        category: jobCategories.name,
        description: jobs.description,
        slug: jobs.slug,
      })
      .from(jobs)
      .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
      .orderBy(desc(jobs.createdAt));

    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/* READ JOB CATEGORIES */
export async function getJobCategoriesAction() {
  const data = await db
    .select()
    .from(jobCategories)
    .orderBy(jobCategories.name);
  return data;
}

/* CATEGORY ACTIONS */
export async function createCategoryAction(name: string) {
  await authGuard("admin");
  try {
    const trimmedName = name.trim();
    const [newCategory] = await db
      .insert(jobCategories)
      .values({ name: trimmedName })
      .returning();

    revalidatePath("/dashboard/jobs");
    // Ensure the creation page sees the new category immediately
    revalidatePath("/dashboard/jobs/create");
    return { success: true, category: newCategory };
  } catch (error) {
    return { error: "Category already exists or failed to save." };
  }
}

/* JOB ACTIONS */
export async function createJobAction(data: {
  title: string;
  category?: string;
  location: string;
  description: string;
  salaryRange?: string;
  featuredImg?: string;
  applyUrl?: string;
}) {
  await authGuard("admin");
  try {
    // THE FIX: Explicitly find the Category UUID using the name string from the form
    const categoryName = data.category?.trim();
    if (!categoryName) {
      return { error: "Category is required." };
    }

    const [categoryRecord] = await db
      .select()
      .from(jobCategories)
      .where(eq(jobCategories.name, categoryName))
      .limit(1);

    if (!categoryRecord) {
      return { error: `Category "${categoryName}" not found in database.` };
    }

    await db.insert(jobs).values({
      title: data.title,
      slug: slugify(data.title, { lower: true, strict: true }),
      categoryId: categoryRecord.id, // Assign the UUID from the lookup
      location: data.location,
      description: data.description,
      salaryRange: data.salaryRange || null,
      featuredImg: data.featuredImg || null,
      applyUrl: data.applyUrl || null,
      status: "Open",
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath("/careers");
    return { success: true };
  } catch (error) {
    console.error("Job Post Error:", error);
    return { error: "Failed to post job. Database error." };
  }
}

export async function updateJobAction(
  id: string,
  data: {
    title: string;
    category?: string;
    location: string;
    description: string;
    salaryRange?: string;
    featuredImg?: string;
    applyUrl?: string;
  },
) {
  await authGuard("admin");
  try {
    const categoryName = data.category?.trim();
    if (!categoryName) return { error: "Category is required." };

    const [categoryRecord] = await db
      .select()
      .from(jobCategories)
      .where(eq(jobCategories.name, categoryName))
      .limit(1);

    if (!categoryRecord) return { error: "Category not found." };

    await db
      .update(jobs)
      .set({
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }),
        categoryId: categoryRecord.id,
        location: data.location,
        description: data.description,
        salaryRange: data.salaryRange || null,
        featuredImg: data.featuredImg || null,
        applyUrl: data.applyUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id));

    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update job." };
  }
}

export async function deleteJobAction(id: string) {
  await authGuard("admin");
  try {
    await db.delete(jobs).where(eq(jobs.id, id));
    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete job." };
  }
}
