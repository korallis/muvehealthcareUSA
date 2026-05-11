export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { jobs, jobCategories } from "../../../db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import slugify from "slugify";
import { authGuard } from "@/lib/authGuard";

/**
 * Zod schema for creating a new Job Posting
 */
const JobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.enum([
    "Support",
    "Administration",
    "Clinical",
    "Maintenance",
    "Operations",
    "Finance",
  ]),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(20, "Description must be detailed"),
  salaryRange: z.string().optional(),
  type: z.string().default("Full-time"),
});

/**
 * GET /api/jobs
 * Paginated list of job vacancies (Public Access)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const offset = (page - 1) * limit;

  // Fetch jobs sorted by newest first
  const jobsList = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    page,
    limit,
    jobs: jobsList,
  });
}

/**
 * POST /api/jobs
 * Create a new job vacancy (ADMIN only)
 */
export async function POST(req: NextRequest) {
  try {
    await authGuard("admin");
  } catch (error: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate request body against job schema
    const data = JobSchema.parse(body);

    // FIXED: Look up the UUID for the category name provided in the request
    const [categoryRecord] = await db
      .select()
      .from(jobCategories)
      .where(eq(jobCategories.name, data.category))
      .limit(1);

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category "${data.category}" not found in database.` },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(jobs)
      .values({
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }),
        // CORRECTED: Use categoryId (UUID) instead of category (text)
        categoryId: categoryRecord.id,
        location: data.location,
        description: data.description,
        salaryRange: data.salaryRange ?? null,
        type: data.type,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === "23505"
    ) {
      return NextResponse.json(
        { error: "A job with this title already exists." },
        { status: 409 },
      );
    }

    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
