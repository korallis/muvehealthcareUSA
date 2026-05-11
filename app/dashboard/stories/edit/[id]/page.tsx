import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditStoryForm from "./EditStoryForm";
import { notFound } from "next/navigation";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storyId = parseInt(id);

  // 1. Safety check for non-numeric IDs
  if (isNaN(storyId)) {
    return notFound();
  }

  // 2. Fetch the specific story
  const [story] = await db
    .select()
    .from(stories)
    .where(eq(stories.id, storyId))
    .limit(1);

  // 3. Use the built-in notFound() helper for a cleaner 404
  if (!story) {
    return notFound();
  }

  return <EditStoryForm story={story} />;
}
