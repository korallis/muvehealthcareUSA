import { db } from "@/db";
import { jobs, jobCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditJobForm from "./EditJobForm";
import { notFound } from "next/navigation";

// Change 1: params is now a Promise in Next.js 15+
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Change 2: Await the params to extract the slug
  const { slug } = await params;

  // Change 3: Query using the awaited slug variable
  const [job] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.slug, slug))
    .limit(1);

  const categories = await db.select().from(jobCategories);

  // If the query returns nothing because the slug was undefined, this fires
  if (!job) notFound();

  return <EditJobForm job={job} categories={categories} />;
}
