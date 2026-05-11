"use server";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Data } from "@puckeditor/core";
import { authGuard } from "@/lib/authGuard";

export async function savePageAction(slug: string, data: Data) {
  await authGuard("admin");
  const cleanSlug = slug.replace(/^\/|\/$/g, "").toLowerCase() || "home";

  await db
    .insert(pages)
    .values({
      slug: cleanSlug,
      content: data,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pages.slug,
      set: { content: data, updatedAt: new Date() },
    });

  revalidatePath(`/${cleanSlug}`, "page");
  revalidatePath("/dashboard/pages");
  // Also revalidate root in case the slug was "home"
  revalidatePath("/", "layout");
}

export async function getAllPagesAction() {
  await authGuard("admin");
  return await db
    .select({
      slug: pages.slug,
      updatedAt: pages.updatedAt,
    })
    .from(pages)
    .orderBy(desc(pages.updatedAt));
}

export async function getPageDataAction(slug: string): Promise<Data | null> {
  const cleanSlug = slug.replace(/^\/|\/$/g, "").toLowerCase() || "home";
  const result = await db.select().from(pages).where(eq(pages.slug, cleanSlug));

  if (result.length === 0) return null;

  // Type assertion: tell Drizzle the content follows the Puck Data structure
  return result[0].content as Data;
}
