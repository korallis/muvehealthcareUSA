// lib/get-jobs.ts
import { db } from "@/db";
import { jobs as jobsTable } from "@/db/schema"; // Import your actual table definition

export async function getJobs() {
  try {
    // Drizzle syntax for "SELECT * FROM jobs"
    const jobs = await db.select().from(jobsTable);

    // Drizzle returns an array of objects directly (no .rows needed)
    return jobs || [];
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}
