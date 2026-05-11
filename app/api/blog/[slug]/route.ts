export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { jobs, jobCategories } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";

/**
 * Zod schema for updating a Job Vacancy
 */
const JobUpdate = z.object({
  title: z.string().min(5).optional(),
  category: z
    .enum([
      "Support",
      "Administration",
      "Clinical",
      "Maintenance",
      "Operations",
      "Finance",
    ])
    .optional(),
  location: z.string().min(1).optional(),
  description: z.string().min(20).optional(),
  salaryRange: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["Open", "Closed"]).optional(),
  featuredImg: z.string().url().optional().or(z.literal("")),
});

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/jobs/[slug]
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const [job] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.slug, slug))
    .limit(1);

  if (!job) {
    return NextResponse.json(
      { error: "Job vacancy not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(job);
}

/**
 * PUT /api/jobs/[slug]
 */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = JobUpdate.parse(await req.json());

  // Using 'any' for updateData allows us to build the object dynamically
  // while satisfying Drizzle's strict type checking for column names.
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (body.title) {
    updateData.title = body.title;
    updateData.slug = slugify(body.title, { lower: true, strict: true });
  }

  // FIXED: Lookup the category ID from the name string provided in the request
  if (body.category) {
    const [categoryRecord] = await db
      .select()
      .from(jobCategories)
      .where(eq(jobCategories.name, body.category))
      .limit(1);

    if (categoryRecord) {
      // Corrected to use 'categoryId' (UUID) as defined in your schema
      updateData.categoryId = categoryRecord.id;
    }
  }

  if (body.location) updateData.location = body.location;
  if (body.description) updateData.description = body.description;
  if (body.salaryRange !== undefined) updateData.salaryRange = body.salaryRange;
  if (body.type) updateData.type = body.type;
  if (body.status) updateData.status = body.status;

  if (body.featuredImg !== undefined) {
    updateData.featuredImg = body.featuredImg || null;
  }

  try {
    const [updated] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Job title results in duplicate slug" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/jobs/[slug]
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const [deleted] = await db
    .delete(jobs)
    .where(eq(jobs.slug, slug))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true, title: deleted.title });
}
