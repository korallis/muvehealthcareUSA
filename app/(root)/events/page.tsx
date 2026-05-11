import { db } from "@/db/index";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import EventsListClient from "@/components/events/EventsListClient";

export default async function EventsPage() {
  // Fetch real data from DB
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.startDate));

  return <EventsListClient initialEvents={allEvents} />;
}
