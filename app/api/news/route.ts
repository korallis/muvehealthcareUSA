export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { newsArticles } from "../../../db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";

const NewsCreate = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  content: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  featuredImg: z.string().optional(),
  categoryId: z.string().uuid(),
  seoDesc: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10") || 10),
  );
  const offset = (page - 1) * limit;

  const articles = await db.query.newsArticles.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(newsArticles.createdAt)],
    limit: limit,
    offset: offset,
  });

  return NextResponse.json({
    page,
    limit,
    news: articles,
  });
}

export async function POST(req: NextRequest) {
  await authGuard("admin");

  try {
    const body = await req.json();
    const data = NewsCreate.parse(body);

    const contentValue =
      typeof data.content === "string"
        ? data.content
        : JSON.stringify(data.content ?? "");

    const [created] = await db
      .insert(newsArticles)
      .values({
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }),
        content: contentValue,
        excerpt: data.excerpt ?? null,
        seoDesc: data.seoDesc ?? null,
        featuredImg: data.featuredImg ?? null,
        categoryId: data.categoryId,
        status: "PUBLISHED",
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
