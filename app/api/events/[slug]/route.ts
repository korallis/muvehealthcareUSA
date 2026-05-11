export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/index";
import { events } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";

/**
 * Zod schema for updating events
 * UPDATED: Includes categoryId and new editorial fields
 */
const EventUpdate = z.object({
  title: z.string().optional(),
  categoryId: z.string().optional(), // Must be a valid UUID
  seoDesc: z.string().optional(),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  featuredImg: z.string().optional(),
});

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/events/[slug]
 * UPDATED: Fetches category relationship details via findFirst
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  // Using relational query to fetch category name instead of just ID
  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      category: true,
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

/**
 * PUT /api/events/[slug]
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
  const body = EventUpdate.parse(await req.json());

  // Build Drizzle-safe update object
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (body.title) {
    updateData.title = body.title;
    updateData.slug = slugify(body.title, { lower: true, strict: true });
  }

  // Handle the new relationship and editorial fields
  if (body.categoryId) updateData.categoryId = body.categoryId;
  if (body.seoDesc !== undefined) updateData.seoDesc = body.seoDesc;
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;

  if (body.description !== undefined) updateData.description = body.description;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.featuredImg !== undefined) updateData.featuredImg = body.featuredImg;

  if (body.startDate) updateData.startDate = new Date(body.startDate);
  if (body.endDate) updateData.endDate = new Date(body.endDate);

  try {
    const [updated] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
 * DELETE /api/events/[slug]
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
    .delete(events)
    .where(eq(events.slug, slug))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
