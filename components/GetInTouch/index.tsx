import { db } from "@/db";
import { jobs, jobCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Contact from "./Contact";
import FeedbackForm from "./Feedback";
import WorkWithUs from "./WorkWithUs";
import Locations from "./Locations";

export default async function GetInTouch() {
  // 1. Fetch categories from the database
  const cats = await db.select().from(jobCategories);
  const categoryNames = cats.map((c) => c.name);

  // 2. Fetch jobs and JOIN with category names
  const rawJobs = await db
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
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id));

  // THE FIX: Provide a fallback string so category is never null
  const initialJobs = rawJobs.map((job) => ({
    ...job,
    category: job.category || "Uncategorized",
  }));

  return (
    <>
      <Contact />
      <Locations />
      <WorkWithUs initialJobs={initialJobs} categories={categoryNames} />
      <FeedbackForm />
    </>
  );
}
