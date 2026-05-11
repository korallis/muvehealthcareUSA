import { db } from "@/db/index";
import { jobs, jobCategories } from "@/db/schema";
import { desc } from "drizzle-orm";
import Contact from "@/components/GetInTouch/Contact";
import FeedbackForm from "@/components/GetInTouch/Feedback";
import WorkWithUs from "@/components/GetInTouch/WorkWithUs";
import Locations from "@/components/GetInTouch/Locations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  // 1. Fetch all categories directly
  const dbCategories = await db.select().from(jobCategories);
  const allCategoryNames = dbCategories.map((c) => c.name);

  // 2. Fetch Jobs using Relational Query
  const rawJobs = await db.query.jobs.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(jobs.createdAt)],
  });

  // 3. Map the data and provide a fallback to ensure 'category' is never null
  const cleanJobs = rawJobs.map((job) => ({
    id: job.id,
    title: job.title,
    location: job.location,
    salaryRange: job.salaryRange,
    featuredImg: job.featuredImg,
    // The fallback "Uncategorized" ensures this matches the 'string' type in the Job interface
    category: job.category?.name || "Uncategorized",
    description: job.description,
    slug: job.slug,
  }));

  // 4. Filter categories to only show those with active jobs
  const activeCategories = allCategoryNames.filter((catName) =>
    cleanJobs.some((job) => job.category === catName),
  );

  // 5. Serialize for Client Component
  // We use type assertion here to satisfy the 'Job[]' requirement if necessary
  const serializedJobs = JSON.parse(JSON.stringify(cleanJobs));
  const serializedCategories = JSON.parse(JSON.stringify(activeCategories));

  return (
    <>
      <Contact />
      <Locations />
      <WorkWithUs
        initialJobs={serializedJobs}
        categories={serializedCategories}
      />
      <FeedbackForm />
    </>
  );
}
