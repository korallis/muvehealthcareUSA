import { db } from "@/db/index";
import { jobs, jobCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import CareersListClient from "@/components/GetInTouch/WorkWithUs";

export default async function Page() {
  // 1. Fetch jobs and join with the categories table
  const allJobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      location: jobs.location,
      salaryRange: jobs.salaryRange,
      featuredImg: jobs.featuredImg,
      category: jobCategories.name, // Select the name string from the joined table
      description: jobs.description,
      slug: jobs.slug,
      // Include any other required fields for your database cleanup
      categoryId: jobs.categoryId,
    })
    .from(jobs)
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
    .orderBy(desc(jobs.createdAt));

  // 2. Map the data to ensure it strictly matches your Job interface
  // Use JSON.parse/stringify to safely pass data to the Client Component
  const cleanJobs = JSON.parse(
    JSON.stringify(
      allJobsData.map((job) => ({
        ...job,
        category: job.category || "General", // Provide a fallback for null categories
      })),
    ),
  );

  return <CareersListClient initialJobs={cleanJobs} />;
}
