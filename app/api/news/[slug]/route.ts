export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { newsArticles } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";

/**
 * Zod schema for updating news articles
 * UPDATED: Includes categoryId and new fields
 */
const NewsUpdate = z.object({
  title: z.string().optional(),
  categoryId: z.string().optional(), // Must be a valid UUID
  seoDesc: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.any().optional(),
  featuredImg: z.string().optional(),
});

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/news/[slug]
 * UPDATED: Fetches category relationship details
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  // Using relational query to fetch category name instead of just ID
  const article = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
    with: {
      category: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

/**
 * PUT /api/news/[slug]
 * UPDATED: Handles categoryId relationship and new metadata
 */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }

  const { slug } = await params;
  const body = NewsUpdate.parse(await req.json());

  // Prepare Drizzle update object
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (body.title) {
    updateData.title = body.title;
    updateData.slug = slugify(body.title, { lower: true, strict: true });
  }

  // Handle the new relationship and metadata fields
  if (body.categoryId) updateData.categoryId = body.categoryId;
  if (body.seoDesc !== undefined) updateData.seoDesc = body.seoDesc;
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.featuredImg !== undefined) updateData.featuredImg = body.featuredImg;

  try {
    const [updated] = await db
      .update(newsArticles)
      .set(updateData)
      .where(eq(newsArticles.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bad request" },
      { status: 400 },
    );
  }
}

/**
 * DELETE /api/news/[slug]
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }

  const { slug } = await params;

  const result = await db
    .delete(newsArticles)
    .where(eq(newsArticles.slug, slug))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
