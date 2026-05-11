export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db/index";
import { events } from "../../../db/schema";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";
import { desc } from "drizzle-orm";

// Updated Zod schema for validating event input
const EventSchema = z.object({
  title: z.string(),
  categoryId: z.string(), // Required UUID from categories table
  seoDesc: z.string().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(), // ISO date string
  endDate: z.string().optional(),
  featuredImg: z.string().optional(),
});

// GET /api/events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "10") || 10),
  );

  // Using relational query to include category details
  const eventsList = await db.query.events.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(events.startDate)],
    limit: limit,
    offset: (page - 1) * limit,
  });

  return NextResponse.json({
    page,
    limit,
    events: eventsList,
  });
}

// POST /api/events
export async function POST(req: NextRequest) {
  // 1. Auth Guard
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = EventSchema.parse(await req.json());

    // 2. Prepare Insert Data
    const [inserted] = await db
      .insert(events)
      .values({
        title: body.title,
        slug: slugify(body.title, { lower: true, strict: true }),
        categoryId: body.categoryId, // Relationship Link
        seoDesc: body.seoDesc ?? null,
        excerpt: body.excerpt ?? null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description ?? null,
        location: body.location ?? null,
        featuredImg: body.featuredImg ?? null,
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err: unknown) {
    // Handle unique constraint errors (duplicate slugs)
    if (
      err instanceof Error &&
      "code" in err &&
      (err as Record<string, unknown>).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Event title/slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bad request" },
      { status: 400 },
    );
  }
}
