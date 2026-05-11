import { db } from "@/db/index";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditEventForm from "./EditEventForm"; // We'll create this next

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  });

  if (!event) notFound();

  // Convert Date object to string format required by datetime-local input
  const formattedEvent = {
    ...event,
    startDate: new Date(event.startDate).toISOString().slice(0, 16),
  };

  return <EditEventForm event={formattedEvent} />;
}
